// StatusDisplay.jsx
import { useEffect, useState } from 'react';
import { checkStatus, downloadAudio } from '../api/apiService';

// ProgressBar component: displays translation progress visually
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

// StatusDisplay component: shows translation status, progress, result, and download/play options
export default function StatusDisplay({ taskId, onNewTranslation }) {
  // State for status info, audio URL, and error messages
  const [status, setStatus] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);

  // Poll backend for translation status and fetch audio when done
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

  // Cleanup: revoke audio URL and reset state when new translation starts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        onNewTranslation?.();
      }
    };
  }, [audioUrl, onNewTranslation]);

  // If no status yet, render nothing
  if (!status) return null;

  return (
    <div className="status-container">
      {/* Show error message and retry button if translation failed */}
      {error ? (
        <div className="error-message">
          <h3>Translation Error</h3>
          <p style={{ color: 'black' }}>{error}</p>
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
          {/* Show translation progress bar and status */}
          <div className="progress-section">
            <label className="select-label">
              Translation Progress:&nbsp;
              {status.status === 'Processing'
                ? `Processing chunk ${status.progress} of ${status.total_chunks}`
                : status.status}
            </label>
            <ProgressBar
              progress={status.progress}
              total={status.total_chunks}
            />
          </div>

          {/* Show translated text if available */}
          {status.translated_text && (
            <div className="translation-result">
              <label className="select-label">Translated Text</label>
              <div className="translated-text-container">
                <p>{status.translated_text}</p>
              </div>
            </div>
          )}

          {/* Show audio player for translated audio if available */}
          {audioUrl && (
            <div className="audio-player-container">
              <label className="select-label">Play: Translated Audio</label>
              <audio
                controls
                src={audioUrl}
                className="audio-player"
                onEnded={() => URL.revokeObjectURL(audioUrl)}
              />
            </div>
          )}

          {/* Download button for translated audio */}
          <div>
            {audioUrl && (
              <button className="submit-button px-4 py-2 text-white">
                <a
                  href={`/download/${taskId}`}
                  download
                  className="flex justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                    />
                  </svg>
                  <span className="button-label">Download Translated Audio</span>
                </a>
              </button>             
            )}
          </div>
        </>
      )}
    </div>
  );
}