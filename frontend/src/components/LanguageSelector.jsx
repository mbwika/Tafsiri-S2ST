import { useState } from 'react';
import { uploadAudio } from '../api/apiService';

const languages = [
  {
    languageName: "English",
    languageCode: "eng",
    voices: ["en-US-JennyNeural", "en-US-GuyNeural"],
  },
  {
    languageName: "French",
    languageCode: "fra",
    voices: ["fr-FR-HenriNeural", "fr-FR-DeniseNeural"],
  },
  {
    languageName: "Swahili",
    languageCode: "swh",
    voices: ["sw-KE-RafikiNeural", "sw-TZ-DaudiNeural", "sw-KE-ZuriNeural", "sw-TZ-RehemaNeural"],
  },
  {
    languageName: "Espanol",
    languageCode: "spa",
    voices: ["es-ES-ElviraNeural", "es-ES-AlvaroNeural"],
  },
  {
    languageName: "Arabic",
    languageCode: "arb",
    voices: ["ar-SA-ZariNeural", "ar-SA-HamedNeural"],
  },
];

const LanguageSelector = ({ onUploadSuccess }) => {
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(languages[0].languageCode);
  const [selectedVoice, setSelectedVoice] = useState(languages[0].voices[0]);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLanguageChange = (event) => {
    const selectedLangCode = event.target.value;
    setSelectedLanguageCode(selectedLangCode);
    const voices = languages.find(lang => lang.languageCode === selectedLangCode).voices;
    setSelectedVoice(voices[0]);
  };

  const handleVoiceChange = (event) => {
    setSelectedVoice(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setIsUploading(true);
    try {
      const response = await uploadAudio(file, selectedLanguageCode, selectedVoice);
      onUploadSuccess(response.data.task_id);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const currentLanguage = languages.find(lang => lang.languageCode === selectedLanguageCode);

  return (
    <form onSubmit={handleSubmit} className="language-upload-form">
      <div className="selector-container">
        <div className="select-group">
          <label className="select-label">Target Language</label>
          <select 
            value={selectedLanguageCode} 
            onChange={handleLanguageChange}
            className="styled-select"
          >
            {languages.map((lang) => (
              <option key={lang.languageCode} value={lang.languageCode}>
                {lang.languageName}
              </option>
            ))}
          </select>
        </div>

        <div className="select-group">
          <label className="select-label">Voice Style</label>
          <select 
            value={selectedVoice} 
            onChange={handleVoiceChange}
            className="styled-select"
          >
            {currentLanguage.voices.map((voice) => (
              <option key={voice} value={voice}>
                {voice.split('-').pop().replace('Neural', '')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="file-upload-container">
        <label className="file-upload-label">
          <input 
            type="file" 
            accept="audio/*" 
            onChange={handleFileChange}
            className="file-input"
            required
          />
          <div className="file-upload-box">
            {file ? (
              <span className="file-name">{file.name}</span>
            ) : (
              <>
                <span className="upload-icon">📁</span>
                <span>Click to browse or drag audio file here</span>
              </>
            )}
          </div>
        </label>
      </div>

      <button type="submit" className="submit-button" disabled={!file || isUploading}>
        {isUploading ? 'Translating...' : 'Start Translation'}
      </button>
    </form>
  );
};

export default LanguageSelector;