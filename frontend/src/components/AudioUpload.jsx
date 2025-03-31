import { useState } from 'react';
import { uploadAudio } from '../api/apiService';

export default function AudioUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [tgtLang, setTgtLang] = useState('swh');
  const [voice, setVoice] = useState('sw-KE-ZuriNeural');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setIsUploading(true);
    try {
      const response = await uploadAudio(file, tgtLang, voice);
      onUploadSuccess(response.data.task_id);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

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