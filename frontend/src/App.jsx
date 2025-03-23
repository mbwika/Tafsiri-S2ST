
//App.jsx

import React, { useState } from "react";
import reactLogo from "./assets/utd-logo.png";
import viteLogo from "./assets/Artscilab.png";
import "./App.css";
import FileUploader from "./components/FileUploader";
import LanguageSelectorWrapper from "./components/languages";

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translation, setTranslation] = useState(null);
  const [downloadLink, setDownloadLink] = useState("");

  // Handles the translation request to the backend
  const handleTranslate = async () => {
    try {
      if (!audioFile || !selectedLanguage || !selectedVoice) {
        console.error("Please make sure to upload an audio file and select a language and voice.");
        alert("Please make sure to upload an audio file and select a language and voice.");
        return;
      }

      setIsTranslating(true); // Disable the button to prevent multiple requests
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("target_language", selectedLanguage);
      formData.append("voice", selectedVoice);

      console.log("Sending request to backend...");
      const response = await fetch("/translate/", {  // No need for full URL anymore
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Translation response:", data);

      setTranslation(data.translated_text);
      setDownloadLink(data.download_link);
      setIsTranslating(false); // Re-enable the button after the translation is done
    } catch (error) {
      console.error("Error during translation:", error);
      setIsTranslating(false); // Re-enable the button in case of an error
    }
  };

  return (

    <div className="app-container min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react rotate" alt="React logo" />
        </a>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </header>

      <h1 className="text-3xl font-bold mb-4">Tafsiri S2ST</h1>

      <div>
        <h4>Select a Language and Voice</h4>
        <LanguageSelectorWrapper setSelectedLanguage={setSelectedLanguage} setSelectedVoice={setSelectedVoice} />

        <FileUploader setAudioFile={setAudioFile} setUploadProgress={setUploadProgress} />

        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {audioFile && (
          <div className="mt-4">
            <p className="text-gray-600">Uploaded: {audioFile.name}</p>
            <audio controls className="mt-2">
              <source src={URL.createObjectURL(audioFile)} type={audioFile.type} />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <button
          className={`mt-4 p-2 rounded text-white ${isTranslating ? "bg-gray-500" : "bg-green-500"}`}
          onClick={handleTranslate}
          disabled={isTranslating}
        >
          {isTranslating ? "Translating..." : "Translate"}
        </button>

        {translation && (
          <div className="mt-6 p-4 bg-gray-200 rounded">
            <h2 className="font-bold text-lg">Translated Text:</h2>
            <p className="mt-2 text-gray-800">{translation}</p>
          </div>
        )}

        {downloadLink && (
          <div className="mt-4">
            <a
              href={downloadLink}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-lg transition duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              📥 Download Audio
            </a>
          </div>
        )}


      </div>
    </div>
  );
}

export default App;
