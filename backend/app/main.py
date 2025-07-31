
# backend-fastapi/app/main.py

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse, Response
from fastapi.middleware.cors import CORSMiddleware 
import torch
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq
import torchaudio
import edge_tts
import asyncio
import textwrap
from pydub import AudioSegment
from pydub.silence import split_on_silence
import os
from tempfile import NamedTemporaryFile
from typing import Dict
import uuid
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
import time


app = FastAPI(root_path="/api-llm")

# Define allowed origins
origins = [
    "https://tafsiri.creativedisturbance.org",  # deployed frontend
    "http://localhost:5173",                    # Vite dev server (localhost)
    "http://localhost:3000",
    "http://127.0.0.1:5173"                     # Alternative localhost
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus metrics
REQUEST_COUNT = Counter("translate_requests_total", "Total number of translation requests")
REQUEST_LATENCY = Histogram("translate_request_latency_seconds", "Latency of translation requests")


# Load SeamlessM4T model
model_id = "facebook/seamless-m4t-v2-large"
processor = AutoProcessor.from_pretrained(model_id)
model = AutoModelForSpeechSeq2Seq.from_pretrained(model_id)

# Move model to GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"
model = model.to(device)

# Dictionary to track progress and store file paths
processing_status: Dict[str, Dict] = {}

# Directory to store output files
OUTPUT_DIR = "output_files"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Function to load and process audio
def load_audio(file_path):
    speech_array, sample_rate = torchaudio.load(file_path)
    if sample_rate != 16000:
        speech_array = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)(speech_array)
    return speech_array.squeeze(0)

# Function to split audio into chunks
def split_audio(file_path, silence_threshold=-40, min_silence_len=500):
    audio = AudioSegment.from_file(file_path)
    chunks = split_on_silence(
        audio,
        silence_thresh=silence_threshold,  # Silence threshold in dB
        min_silence_len=min_silence_len,  # Minimum silence length in ms
        keep_silence=500  # Keep some silence at the beginning/end of chunks
    )
    return chunks

# Function for text-to-speech using Edge-TTS
async def text_to_speech(text, output_path, voice):
    sentences = textwrap.wrap(text, width=290)  # Split long text into chunks
    audio_segments = []
    for i, sentence in enumerate(sentences):
        segment_path = f"segment_{i}.mp3"
        tts = edge_tts.Communicate(sentence, voice)
        await tts.save(segment_path)
        audio_segments.append(segment_path)

    # Merge all segments into the final output
    combined = AudioSegment.empty()
    for segment in audio_segments:
        combined += AudioSegment.from_file(segment)
    combined.export(output_path, format="mp3")

    # Clean up temporary segment files
    for segment in audio_segments:
        os.remove(segment)

# Background task to process audio
async def process_audio(file_path, output_path, tgt_lang, voice, task_id):
    try:
        # Split the audio into chunks
        chunks = split_audio(file_path)
        processing_status[task_id] = {"progress": 0, "total_chunks": len(chunks), "status": "processing"}

        # Translate each chunk and combine the results
        combined_audio = AudioSegment.empty()
        translated_text = ""
        for i, chunk in enumerate(chunks):
            # Save the chunk to a temporary file
            chunk_path = f"chunk_{i}.wav"
            chunk.export(chunk_path, format="wav")

            # Load and process the chunk
            audio_waveform = load_audio(chunk_path)
            inputs = processor(audios=[audio_waveform], sampling_rate=16000, return_tensors="pt").to(device)

            # Step 1: Speech-to-Text Translation (S2TT)
            with torch.no_grad():
                output = model.generate(**inputs, tgt_lang=tgt_lang)

            # Decode the generated text
            chunk_translated_text = processor.batch_decode(output, skip_special_tokens=True)[0]
            translated_text += chunk_translated_text + " "

            # Step 2: Text-to-Speech with Edge-TTS
            chunk_audio_path = f"chunk_translated_{i}.mp3"
            await text_to_speech(chunk_translated_text, chunk_audio_path, voice)

            # Add the translated chunk to the combined audio
            combined_audio += AudioSegment.from_file(chunk_audio_path)

            # Update progress
            processing_status[task_id]["progress"] = i + 1

            # Clean up temporary files
            os.remove(chunk_path)
            os.remove(chunk_audio_path)

        # Save the combined translated audio
        combined_audio.export(output_path, format="mp3")

        # Update status
        processing_status[task_id]["status"] = "completed"
        processing_status[task_id]["output_file"] = output_path
        processing_status[task_id]["translated_text"] = translated_text.strip()
    except Exception as e:
        processing_status[task_id]["status"] = "failed"
        processing_status[task_id]["error"] = str(e)
    finally:
        # Clean up temporary files
        if os.path.exists(file_path):
            os.remove(file_path)

# API endpoint to submit audio for translation
@app.post("/translate/")
async def translate_speech(
    file: UploadFile = File(...),
    tgt_lang: str = Form(...),
    voice: str = Form(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    try:
        # Generate a unique task ID
        task_id = str(uuid.uuid4())

        # Save the uploaded file temporarily
        file_name = file.filename
        output_file_name = f"{OUTPUT_DIR}/translated_{task_id}.mp3"
        with NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            temp_file.write(await file.read())
            temp_file_path = temp_file.name

        # Add the task to the background
        background_tasks.add_task(process_audio, temp_file_path, output_file_name, tgt_lang, voice, task_id)

        # Return acknowledgment
        return JSONResponse(
            status_code=202,
            content={
                "message": "Audio file received and processing started.",
                "task_id": task_id,
                "output_file": output_file_name
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# API endpoint to submit audio for translation (with metrics)
@app.post("/translate/")
async def translate_speech(
    file: UploadFile = File(...),
    tgt_lang: str = Form(...),
    voice: str = Form(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    start_time = time.time()
    REQUEST_COUNT.inc()  # increment request count

    try:
        # Generate a unique task ID
        task_id = str(uuid.uuid4())

        # Save the uploaded file temporarily
        file_name = file.filename
        output_file_name = f"{OUTPUT_DIR}/translated_{task_id}.mp3"
        with NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            temp_file.write(await file.read())
            temp_file_path = temp_file.name

        # Add the task to the background
        background_tasks.add_task(process_audio, temp_file_path, output_file_name, tgt_lang, voice, task_id)

        # Return acknowledgment
        return JSONResponse(
            status_code=202,
            content={
                "message": "Audio file received and processing started.",
                "task_id": task_id,
                "output_file": output_file_name
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        duration = time.time() - start_time
        REQUEST_LATENCY.observe(duration)

# API endpoint to check status
@app.get("/status/{task_id}")
async def check_status(task_id: str):
    if task_id not in processing_status:
        raise HTTPException(status_code=404, detail="Task ID not found.")
    return processing_status[task_id]

# API endpoint to download the translated file
@app.get("/download/{task_id}")
async def download_file(task_id: str):
    if task_id not in processing_status:
        raise HTTPException(status_code=404, detail="Task ID not found.")
    
    output_file = processing_status[task_id].get("output_file")
    if not output_file or not os.path.exists(output_file):
        raise HTTPException(status_code=404, detail="File not found.")

    return FileResponse(output_file, media_type="audio/mpeg", filename=f"translated_{task_id}.mp3")

# API endpoint for Prometheus metrics
@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
    
# Run the API
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)