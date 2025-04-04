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

// import { useState } from 'react';
// import { uploadAudio, checkStatus } from '../api/apiService';

// export default function AudioUpload({ onUploadSuccess }) {
//   const [file, setFile] = useState(null);
//   const [tgtLang, setTgtLang] = useState('swh');
//   const [voice, setVoice] = useState('sw-KE-ZuriNeural');
//   const [isUploading, setIsUploading] = useState(false);
//   const [taskId, setTaskId] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);  // Track upload progress
//   const [statusMessage, setStatusMessage] = useState('');  // Track status message

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return;

//     setIsUploading(true);
//     try {
//       const response = await uploadAudio(file, tgtLang, voice);
//       setTaskId(response.data.task_id);  // Save the task ID
//       onUploadSuccess(response.data.task_id);
//       pollTaskStatus(response.data.task_id);  // Start polling the status
//     } catch (error) {
//       console.error('Upload failed:', error);
//       setStatusMessage('Upload failed, try again.');
//     }
//   };

//   // Poll the task status to update progress
//   const pollTaskStatus = async (taskId) => {
//     const interval = setInterval(async () => {
//       try {
//         const response = await checkStatus(taskId);
//         const { progress, total_chunks, status } = response.data;

//         // Update progress
//         setUploadProgress(Math.round((progress / total_chunks) * 100));
//         setStatusMessage(status);

//         // Stop polling once completed or failed
//         if (status === 'completed' || status === 'failed') {
//           clearInterval(interval);
//         }
//       } catch (error) {
//         console.error('Status check failed:', error);
//         setStatusMessage('Error checking status.');
//         clearInterval(interval);
//       }
//     }, 1000);
//   };

//   return (
//     <div className="upload-container">
//       <h2>Upload Audio</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Audio File:</label>
//           <input 
//             type="file" 
//             accept="audio/*" 
//             onChange={(e) => setFile(e.target.files[0])}
//           />
//         </div>
//         <div>
//           <label>Target Language:</label>
//           <input
//             type="text"
//             value={tgtLang}
//             onChange={(e) => setTgtLang(e.target.value)}
//             placeholder="e.g., swh"
//           />
//         </div>
//         <div>
//           <label>Voice:</label>
//           <input
//             type="text"
//             value={voice}
//             onChange={(e) => setVoice(e.target.value)}
//             placeholder="e.g., sw-KE-ZuriNeural"
//           />
//         </div>
//         <button 
//           type="submit" 
//           disabled={!file || isUploading}
//         >
//           {isUploading 
//             ? `Uploading... ${uploadProgress}%` 
//             : taskId 
//             ? `Processing... ${uploadProgress}%` 
//             : 'Translate Audio'
//           }
//         </button>
//         {statusMessage && <p>{statusMessage}</p>}
//       </form>
//     </div>
//   );
// }
