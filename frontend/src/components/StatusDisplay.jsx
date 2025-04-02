import { useEffect, useState } from 'react';
import { checkStatus, downloadAudio } from '../api/apiService';

const ProgressBar = ({ progress, total }) => {
  const percentage = Math.round((progress / (total || 1)) * 100);
  
  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar-fill"
        style={{ width: `${percentage}%` }}
      ></div>
      <div className="progress-text">{percentage}%</div>
    </div>
  );
};

export default function StatusDisplay({ taskId, onNewTranslation }) {
  const [status, setStatus] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!taskId) return;

    const interval = setInterval(async () => {
      try {
        const response = await checkStatus(taskId);
        setStatus(response.data);
        
        // Stop polling if failed or completed
        if (response.data.status === 'failed') {
          clearInterval(interval);
          setError(response.data.error || 'Translation failed');
        }
        
        if (response.data.status === 'completed') {
          clearInterval(interval);
          const audioResponse = await downloadAudio(taskId);
          setAudioUrl(URL.createObjectURL(audioResponse.data));
        }
      } catch (error) {
        console.error('Status check failed:', error);
        clearInterval(interval);
        setError('Failed to check translation status');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [taskId]);

  // Clear previous when new translation starts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        onNewTranslation?.();
      }
    };
  }, [audioUrl, onNewTranslation]);

  if (!status) return null;

  return (
    <div className="status-container">
      {error ? (
        <div className="error-message">
          <h3>Translation Error</h3>
          <p style={{color: 'black'}}>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              onNewTranslation?.();
            }}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="progress-section">
            <h3>Translation Progress</h3>
            <ProgressBar 
              progress={status.progress} 
              total={status.total_chunks} 
            />
            <p className="status-text">
              {status.status === 'processing' 
                ? `Processing chunk ${status.progress} of ${status.total_chunks}`
                : status.status}
            </p>
          </div>

          {status.translated_text && (
            <div className="translation-result">
              <h4>Translated Text</h4>
              <p>{status.translated_text}</p>
            </div>
          )}

          {audioUrl && (
            <div className="audio-player-container">
              <h4>Translated Audio</h4>
              <audio 
                controls 
                src={audioUrl} 
                className="audio-player"
                onEnded={() => URL.revokeObjectURL(audioUrl)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}