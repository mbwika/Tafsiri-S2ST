//Uncaught ReferenceError: LanguageSelector is not defined

// LanguageSelector.jsx

const LanguageSelector = ({ selectedLanguage, setSelectedLanguage, languages }) => {
  return (
    <select
      value={selectedLanguage}
      onChange={(e) => setSelectedLanguage(e.target.value)}
    >
      {languages.map(({ languageName, languageCode, voices = [] }) => (
        <optgroup key={languageCode} label={languageName}>
          {voices.length > 0 ? (
            voices.map((voice) => (
              <option key={voice} value={voice}>
                {voice}
              </option>
            ))
          ) : (
            <option key={languageCode} value={languageCode}>
              {languageName} (No voices available)
            </option>
          )}
        </optgroup>
      ))}
    </select>
  );
};

export default LanguageSelector;


  