

   {/* languages.jsx */}

   import { useState } from "react";
   import LanguageSelector from "./LanguageSelector";
   
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
   
   const LanguageSelectorWrapper = ({ setSelectedLanguage, setSelectedVoice }) => {
     const [selectedLanguageCode, setSelectedLanguageCode] = useState(languages[0].languageCode);
     const [selectedVoice, setSelectedVoiceState] = useState(languages[0].voices[0]);
   
     const handleLanguageChange = (event) => {
       const selectedLangCode = event.target.value;
       setSelectedLanguageCode(selectedLangCode);
       setSelectedLanguage(selectedLangCode);
   
       // Reset voice when changing language
       const voicesForLanguage = languages.find(lang => lang.languageCode === selectedLangCode).voices;
       setSelectedVoiceState(voicesForLanguage[0]);
       setSelectedVoice(voicesForLanguage[0]);
     };
   
     const handleVoiceChange = (event) => {
       const selectedVoice = event.target.value;
       setSelectedVoiceState(selectedVoice);
       setSelectedVoice(selectedVoice);
     };
   
     const voicesForSelectedLanguage = languages.find(lang => lang.languageCode === selectedLanguageCode)?.voices;
   
     return (
       <div>
         <select value={selectedLanguageCode} onChange={handleLanguageChange}>
           {languages.map((lang) => (
             <option key={lang.languageCode} value={lang.languageCode}>
               {lang.languageName}
             </option>
           ))}
         </select>
   
         {voicesForSelectedLanguage && (
           <select value={selectedVoice} onChange={handleVoiceChange}>
             {voicesForSelectedLanguage.map((voice) => (
               <option key={voice} value={voice}>
                 {voice}
               </option>
             ))}
           </select>
         )}
       </div>
     );
   };
   
   export default LanguageSelectorWrapper;
   