import { useState } from "react";

export default function Landing() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Waiting...");
  const [translatedAudio, setTranslatedAudio] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:5173/upload/", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Uploaded:", data.file_path);
    setStatus("Processing...");
  };

  return (
    <div className="bg-white dark:bg-gray-900 dracula:bg-dracula-background p-4 rounded-lg">
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="p-6 max-w-lg bg-white shadow-lg rounded-lg">
        <h1 className="text-xl font-bold">Tafsiri - Audio Translator</h1>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full p-2 border" />
        <button onClick={handleUpload} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Upload</button>
        <p className="mt-2">{status}</p>
        {translatedAudio && <audio controls src={translatedAudio} className="mt-4 w-full" />}
      </div>
    </div>
    </div>
  );
}
