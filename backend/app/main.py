#main.py

from fastapi import FastAPI, File, UploadFile, Form
from pydantic import BaseModel
import torch
import torchaudio
import os
import asyncio
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq
import edge_tts
import logging
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


# Initialize FastAPI
app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers, including Content-Type
    expose_headers=["Content-Disposition"]  # Ensure file downloads work correctly
)

# Serve static files from the "uploads" directory
app.mount("/static", StaticFiles(directory="uploads"), name="static")

# Load SeamlessM4T Model
MODEL_ID = "facebook/seamless-m4t-v2-large"
processor = AutoProcessor.from_pretrained(MODEL_ID)
model = AutoModelForSpeechSeq2Seq.from_pretrained(MODEL_ID).to("cuda" if torch.cuda.is_available() else "cpu")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define data model for request
class TranslationRequest(BaseModel):
    target_language: str
    voice: str

# Upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def load_audio(file_path):
    # Load the audio file
    waveform, sample_rate = torchaudio.load(file_path)
    
    # Ensure mono if stereo (convert to single channel)
    if waveform.shape[0] > 1:  # If there are multiple channels (e.g., stereo)
        waveform = waveform.mean(dim=0, keepdim=True)  # Convert to mono by averaging channels

    # Resample the audio to 16000 Hz if necessary
    if sample_rate != 16000:
        waveform = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)(waveform)
    
    return waveform  # Return only the waveform tensor

VALID_LANGUAGES = [
    'afr', 'amh', 'arb', 'ary', 'arz', 'asm', 'azj', 'bel', 'ben', 'bos', 'bul', 
    'cat', 'ceb', 'ces', 'ckb', 'cmn', 'cmn_Hant', 'cym', 'dan', 'deu', 'ell', 'eng', 
    'est', 'eus', 'fin', 'fra', 'fuv', 'gaz', 'gle', 'glg', 'guj', 'heb', 'hin', 'hrv', 
    'hun', 'hye', 'ibo', 'ind', 'isl', 'ita', 'jav', 'jpn', 'kan', 'kat', 'kaz', 'khk', 
    'khm', 'kir', 'kor', 'lao', 'lit', 'lug', 'luo', 'lvs', 'mai', 'mal', 'mar', 'mkd', 
    'mlt', 'mni', 'mya', 'nld', 'nno', 'nob', 'npi', 'nya', 'ory', 'pan', 'pbt', 'pes', 
    'pol', 'por', 'ron', 'rus', 'sat', 'slk', 'slv', 'sna', 'snd', 'som', 'spa', 'srp', 
    'swe', 'swh', 'tam', 'tel', 'tgk', 'tgl', 'tha', 'tur', 'ukr', 'urd', 'uzn', 'vie', 
    'yor', 'yue', 'zlm', 'zul'
]

#main.py

@app.post("/translate/")
async def translate_audio(file: UploadFile = File(...), target_language: str = Form(...), voice: str = Form(...)):
    try:
        # Check if target_language is empty
        if not target_language:
            logger.error("Target language is empty")
            return {"error": "Target language cannot be empty"}
        
        # Log the received target_language
        logger.info(f"Received target_language: {target_language}")
        
        # Validate the target_language
        if target_language not in VALID_LANGUAGES:
            logger.error(f"Invalid target language: {target_language}")
            return {"error": f"Invalid target language. Supported languages are: {', '.join(VALID_LANGUAGES)}"}

        # Save the uploaded file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as audio_file:
            audio_file.write(await file.read())
        logger.info(f"File saved at {file_path}")

        # Load audio
        waveform = load_audio(file_path)

        # Prepare inputs for processor
        inputs = processor(audios=[waveform], sampling_rate=16000, return_tensors="pt").to("cuda" if torch.cuda.is_available() else "cpu")
        
        if "input_features" not in inputs:
            logger.error("Processor output missing 'input_features'")
            return {"error": "Invalid audio processing"}

        logger.info(f"Audio input tensor shape: {inputs['input_features'].shape}")

        # Perform translation
        translated_output = model.generate(inputs["input_features"], tgt_lang=target_language)
        translated_text = processor.batch_decode(translated_output, skip_special_tokens=True)[0]
        logger.info(f"Translated Text: {translated_text}")

        # Generate speech output using Edge TTS
        output_audio_path = os.path.join(UPLOAD_DIR, "translated_audio.mp3")
        communicate = edge_tts.Communicate(translated_text, voice)
        await communicate.save(output_audio_path)

        # Generate a publicly accessible URL for the translated audio file
        download_url = f"http://localhost:8000/static/{os.path.basename(output_audio_path)}"

        return {
            "translated_text": translated_text,
            "download_link": download_url  # Provide the download link for the audio file
        }

    except Exception as e:
        logger.error(f"Error during translation: {e}", exc_info=True)
        return {"error": str(e)}

