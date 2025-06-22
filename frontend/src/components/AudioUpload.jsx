import { useState } from 'react';
import { uploadAudio } from '../api/apiService';

// AudioUpload component handles audio file upload and translation request
export default function AudioUpload({ onUploadSuccess }) {
  // State variables for file, target language, voice, and upload status
  const [file, setFile] = useState(null);
  const [tgtLang, setTgtLang] = useState('swh');
  const [voice, setVoice] = useState('sw-KE-ZuriNeural');
  const [isUploading, setIsUploading] = useState(false);

  // Handle form submission: upload audio and notify parent on success
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Call API to upload audio file for translation
      const response = await uploadAudio(file, tgtLang, voice);
      // Pass the returned task ID to parent component
      onUploadSuccess(response.data.task_id);
    } catch (error) {
      // Handle upload errors
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Render upload form UI
  return (
    <div className="upload-container">
      <h2>Upload Audio</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Audio File:</label>
          <input 
            type="file" 
            accept="audio/*" 
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div>
          <label>Target Language:</label>
          <input
            type="text"
            value={tgtLang}
            onChange={(e) => setTgtLang(e.target.value)}
            placeholder="e.g., swh"
          />
        </div>
        <div>
          <label>Voice:</label>
          <input
            type="text"
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            placeholder="e.g., sw-KE-ZuriNeural"
          />
        </div>
        <button type="submit" disabled={!file || isUploading}>
          {isUploading ? 'Uploading...' : 'Translate Audio'}
        </button>
      </form>
    </div>
  );
}
