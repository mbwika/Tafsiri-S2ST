// File: frontend/src/App.jsx
import { useState } from 'react';
import StatusDisplay from './components/StatusDisplay';
import ThemeToggle from './components/ThemeToggle';
import LanguageSelector from './components/LanguageSelector';
import './styles/App.css';
import './styles/theme.css';
import OrgLogo from './assets/utd-logo.png';
import LabLogo from './assets/artscilab-logo.png'; // Import your logo

export default function App() {
  const [taskId, setTaskId] = useState(null);

  const handleNewTranslation = () => {
    setTaskId(null); // Clear previous translation
  };

  return (
    <div className="app-container">
      <div className="app-content">
      <header className="app-header">
        <div className="header-content">
        <a href="https://utdallas.edu/" target="_blank" rel="noopener noreferrer">
          <img src={OrgLogo} alt="UTD Logo" className="logo rotate-logo" />
        </a>
        <a href="https://artscilab.utdallas.edu/" target="_blank" rel="noopener noreferrer">
          <img src={LabLogo} alt="Artscilab Logo" className="logo" />
        </a>
          <div className="title-container">
            <h1>TAFSIRI</h1>
            <div className="subtitle">Seamless Podcast Translation</div>
          </div>
          <div className="theme-toggle-wrapper">
            <ThemeToggle />
          </div>
        </div>
      </header>

        <div className="main-card">
          <section className="upload-section">
            <h2>Audio Translation</h2>
            <p className="instruction-text">
              Upload an audio file and select target language to begin translation
            </p>
            
            <LanguageSelector onUploadSuccess={setTaskId} />
          </section>

          {taskId && (
            <section className="status-section">
              <StatusDisplay taskId={taskId} 
              onNewTranslation={handleNewTranslation}/>
            </section>
          )}
        </div>

        <footer className="app-footer">
          <p>Powered by SeamlessM4T + Edge TTS</p>
        </footer>
      </div>
    </div>
  );
}