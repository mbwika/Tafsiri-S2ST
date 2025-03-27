import { useState } from "react";

const FileUploader = ({ setAudioFile, setUploadProgress }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);

      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 500);
    }
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-900 dracula:bg-dracula-background p-4 rounded-lg">

      <label className="block text-gray-700 font-medium">Upload Audio File:</label>
      <input
        type="file"
        accept="audio/*"
        className="w-full p-2 border rounded-md"
        onChange={handleFileChange}
      />
      </div>
    </div>
  );
};

export default FileUploader;
