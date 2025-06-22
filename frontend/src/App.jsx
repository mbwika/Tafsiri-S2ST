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
  // State to track the current translation task ID and translation readiness
  const [taskId, setTaskId] = useState(null);
  const [isTranslationReady, setIsTranslationReady] = useState(false);

  // Handler to reset translation state (used for starting a new translation)
  const handleNewTranslation = () => {
    setTaskId(null); // Clear previous translation
  };

  // Main app layout and rendering
  return (
    <div className="app-container">
      <div className="app-content">
        {/* Theme toggle button (light/dark mode) */}
        <div className="theme-toggle-wrapper">
          <ThemeToggle />
        </div>
        {/* Header with logos and title */}
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
              <div className="subtitle">A Speech-to-Speech Translator (S2ST)</div>
              <p className='instruction-text'>  
                Upload an audio file and select target language to begin translation
              </p>
            </div>
          </div>
        </header>

        {/* Main card: language selector and status display side by side (on desktop) */}
        <div className="main-card">
          <div className={`flex flex-col gap-4 w-full ${taskId ? 'md:flex-row' : ''}`}>
            {/* Language and voice selection, file upload */}
            <section className={`w-full ${taskId ? 'md:w-1/2' : 'w-full'}`}>
              <LanguageSelector onUploadSuccess={setTaskId} />
            </section>

            {/* Status and result display, only shown after upload */}
            {taskId && (
              <section className="w-full md:w-1/2">
                <StatusDisplay taskId={taskId} onNewTranslation={handleNewTranslation} />
              </section>
            )}
          </div>
        </div>

        {/* Footer with copyright */}
        <footer className="app-footer">
          <p className="">
            © 2025 <a href="https://artscilab.utdallas.edu/"> ArtSciLab</a>. The University of Texas at Dallas (UTD).
          </p>
        </footer>
      </div>
    </div>
  );
}