import { useState } from 'react';
import { uploadAudio } from '../api/apiService';

const languages = [
  {
    languageName: "English",
    languageCode: "eng",
    voices: ["en-US-JennyNeural", "en-US-GuyNeural", "en-ZA-LeahNeural", "en-ZA-LukeNeural"],
  },
  {
    languageName: "French",
    languageCode: "fra",
    voices: [
      "fr-FR-HenriNeural", "fr-FR-DeniseNeural", "fr-BE-CharlineNeural", "fr-BE-GerardNeural",
      "fr-CA-AntoineNeural", "fr-CA-JeanNeural", "fr-CA-SylvieNeural", "fr-CA-ThierryNeural",
      "fr-CH-ArianeNeural", "fr-CH-FabriceNeural", "fr-FR-EloiseNeural", "fr-FR-RemyMultilingualNeural",
      "fr-FR-VivienneMultilingualNeural"
    ],
  },
  {
    languageName: "Swahili",
    languageCode: "swh",
    voices: ["sw-KE-RafikiNeural", "sw-TZ-DaudiNeural", "sw-KE-ZuriNeural", "sw-TZ-RehemaNeural"],
  },
  {
    languageName: "Afrikaans",
    languageCode: "afr",
    voices: ["af-ZA-AdriNeural", "af-ZA-WillemNeural"],
  },
  {
    languageName: "Amharic",
    languageCode: "am-ET",
    voices: ["am-ET-AmehaNeural", "am-ET-MekdesNeural"],
  },
  {
    languageName: "Arabic",
    languageCode: "arb",
    voices: [
      "ar-AE-FatimaNeural", "ar-AE-HamdanNeural", "ar-BH-AliNeural", "ar-BH-LailaNeural",
      "ar-DZ-AminaNeural", "ar-DZ-IsmaelNeural", "ar-EG-SalmaNeural", "ar-EG-ShakirNeural",
      "ar-IQ-BasselNeural", "ar-IQ-RanaNeural", "ar-JO-SanaNeural", "ar-JO-TaimNeural",
      "ar-KW-FahedNeural", "ar-KW-NouraNeural", "ar-LB-LaylaNeural", "ar-LB-RamiNeural",
      "ar-LY-ImanNeural", "ar-LY-OmarNeural", "ar-MA-JamalNeural", "ar-MA-MounaNeural",
      "ar-OM-AbdullahNeural", "ar-OM-AyshaNeural", "ar-QA-AmalNeural", "ar-QA-MoazNeural",
      "ar-SA-HamedNeural", "ar-SA-ZariyahNeural", "ar-SY-AmanyNeural", "ar-SY-LaithNeural",
      "ar-TN-HediNeural", "ar-TN-ReemNeural", "ar-YE-MaryamNeural", "ar-YE-SalehNeural"
    ],
  },
  {
    languageName: "Azerbaijani",
    languageCode: "az-AZ",
    voices: ["az-AZ-BabekNeural", "az-AZ-BanuNeural"],
  },
  {
    languageName: "Bulgarian",
    languageCode: "bg-BG",
    voices: ["bg-BG-BorislavNeural", "bg-BG-KalinaNeural"],
  },
  {
    languageName: "Bengali (Bangladesh)",
    languageCode: "bn-BD",
    voices: ["bn-BD-NabanitaNeural", "bn-BD-PradeepNeural"],
  },
  {
    languageName: "Bengali (India)",
    languageCode: "bn-IN",
    voices: ["bn-IN-BashkarNeural", "bn-IN-TanishaaNeural"],
  },
  {
    languageName: "Bosnian",
    languageCode: "bs-BA",
    voices: ["bs-BA-GoranNeural", "bs-BA-VesnaNeural"],
  },
  {
    languageName: "Catalan",
    languageCode: "ca-ES",
    voices: ["ca-ES-EnricNeural", "ca-ES-JoanaNeural"],
  },
  {
    languageName: "Czech",
    languageCode: "cs-CZ",
    voices: ["cs-CZ-AntoninNeural", "cs-CZ-VlastaNeural"],
  },
  {
    languageName: "Welsh",
    languageCode: "cy-GB",
    voices: ["cy-GB-AledNeural", "cy-GB-NiaNeural"],
  },
  {
    languageName: "Danish",
    languageCode: "da-DK",
    voices: ["da-DK-ChristelNeural", "da-DK-JeppeNeural"],
  },
  {
    languageName: "German (Austria)",
    languageCode: "de-AT",
    voices: ["de-AT-IngridNeural", "de-AT-JonasNeural"],
  },
  {
    languageName: "German (Switzerland)",
    languageCode: "de-CH",
    voices: ["de-CH-JanNeural", "de-CH-LeniNeural"],
  },
  {
    languageName: "German (Germany)",
    languageCode: "de-DE",
    voices: [
      "de-DE-AmalaNeural", "de-DE-ConradNeural", "de-DE-FlorianMultilingualNeural",
      "de-DE-KatjaNeural", "de-DE-KillianNeural", "de-DE-SeraphinaMultilingualNeural"
    ],
  },
  {
    languageName: "Greek",
    languageCode: "el-GR",
    voices: ["el-GR-AthinaNeural", "el-GR-NestorasNeural"],
  },
  {
    languageName: "Spanish",
    languageCode: "spa",
    voices: [
      "es-ES-ElviraNeural", "es-ES-AlvaroNeural", "es-ES-XimenaNeural", "es-AR-ElenaNeural", "es-AR-TomasNeural",
      "es-BO-MarceloNeural", "es-BO-SofiaNeural", "es-CL-CatalinaNeural", "es-CL-LorenzoNeural", "es-CO-GonzaloNeural",
      "es-CO-SalomeNeural", "es-CR-JuanNeural", "es-CR-MariaNeural", "es-CU-BelkysNeural", "es-CU-ManuelNeural",
      "es-DO-EmilioNeural", "es-DO-RamonaNeural", "es-EC-AndreaNeural", "es-EC-LuisNeural", "es-GQ-JavierNeural",
      "es-GQ-TeresaNeural", "es-GT-AndresNeural", "es-GT-MartaNeural", "es-HN-CarlosNeural", "es-HN-KarlaNeural",
      "es-MX-DaliaNeural", "es-MX-JorgeNeural", "es-NI-FedericoNeural", "es-NI-YolandaNeural", "es-PA-MargaritaNeural",
      "es-PA-RobertoNeural", "es-PE-AlexNeural", "es-PE-CamilaNeural", "es-PR-KarinaNeural", "es-PR-VictorNeural",
      "es-PY-MarioNeural", "es-PY-TaniaNeural", "es-SV-LorenaNeural", "es-SV-RodrigoNeural", "es-US-AlonsoNeural",
      "es-US-PalomaNeural", "es-UY-MateoNeural", "es-UY-ValentinaNeural", "es-VE-PaolaNeural", "es-VE-SebastianNeural"
    ],
  },
  {
    languageName: "Estonian",
    languageCode: "est",
    voices: ["et-EE-AnuNeural", "et-EE-KertNeural"],
  },
  {
    languageName: "Persian",
    languageCode: "fas",
    voices: ["fa-IR-DilaraNeural", "fa-IR-FaridNeural"],
  },
  {
    languageName: "Finnish",
    languageCode: "fin",
    voices: ["fi-FI-HarriNeural", "fi-FI-NooraNeural"],
  },
  {
    languageName: "Filipino",
    languageCode: "fil",
    voices: ["fil-PH-AngeloNeural", "fil-PH-BlessicaNeural"],
  },
  {
    languageName: "Irish",
    languageCode: "ga-IE",
    voices: ["ga-IE-ColmNeural", "ga-IE-OrlaNeural"],
  },
  {
    languageName: "Galician",
    languageCode: "gl-ES",
    voices: ["gl-ES-RoiNeural", "gl-ES-SabelaNeural"],
  },
  {
    languageName: "Gujarati",
    languageCode: "gu-IN",
    voices: ["gu-IN-DhwaniNeural", "gu-IN-NiranjanNeural"],
  },
  {
    languageName: "Hebrew",
    languageCode: "he-IL",
    voices: ["he-IL-AvriNeural", "he-IL-HilaNeural"],
  },
  {
    languageName: "Hindi",
    languageCode: "hi-IN",
    voices: ["hi-IN-MadhurNeural", "hi-IN-SwaraNeural"],
  },
  {
    languageName: "Croatian",
    languageCode: "hr-HR",
    voices: ["hr-HR-GabrijelaNeural", "hr-HR-SreckoNeural"],
  },
  {
    languageName: "Hungarian",
    languageCode: "hu-HU",
    voices: ["hu-HU-NoemiNeural", "hu-HU-TamasNeural"],
  },
  {
    languageName: "Indonesian",
    languageCode: "id-ID",
    voices: ["id-ID-ArdiNeural", "id-ID-GadisNeural"],
  },
  {
    languageName: "Icelandic",
    languageCode: "is-IS",
    voices: ["is-IS-GudrunNeural", "is-IS-GunnarNeural"],
  },
  {
    languageName: "Italian",
    languageCode: "it-IT",
    voices: ["it-IT-DiegoNeural", "it-IT-ElsaNeural", "it-IT-GiuseppeMultilingualNeural", "it-IT-IsabellaNeural"],
  },
  {
    languageName: "Japanese",
    languageCode: "ja-JP",
    voices: ["ja-JP-KeitaNeural", "ja-JP-NanamiNeural"],
  },
  {
    languageName: "Javanese",
    languageCode: "jv-ID",
    voices: ["jv-ID-DimasNeural", "jv-ID-SitiNeural"],
  },
  {
    languageName: "Georgian",
    languageCode: "ka-GE",
    voices: ["ka-GE-EkaNeural", "ka-GE-GiorgiNeural"],
  },
  {
    languageName: "Kazakh",
    languageCode: "kk-KZ",
    voices: ["kk-KZ-AigulNeural", "kk-KZ-DauletNeural"],
  },
  {
    languageName: "Korean",
    languageCode: "kor",
    voices: ["ko-KR-HyunsuMultilingualNeural", "ko-KR-InJoonNeural", "ko-KR-SunHiNeural"],
  },
  {
    languageName: "Lithuanian",
    languageCode: "lt-LT",
    voices: ["lt-LT-LeonasNeural", "lt-LT-OnaNeural"],
  },
  {
    languageName: "Latvian",
    languageCode: "lv-LV",
    voices: ["lv-LV-EveritaNeural", "lv-LV-NilsNeural"],
  },
  {
    languageName: "Maltese",
    languageCode: "mt-MT",
    voices: ["mt-MT-GraceNeural", "mt-MT-JosephNeural"],
  },
  {
    languageName: "Portuguese (Brazilian)",
    languageCode: "pt-BR",
    voices: ["pt-BR-AntonioNeural", "pt-BR-FranciscaNeural", "pt-BR-ThalitaMultilingualNeural"],
  },
  {
    languageName: "Portuguese (Portugal)",
    languageCode: "pt-PT",
    voices: ["pt-PT-DuarteNeural", "pt-PT-RaquelNeural"],
  },
  {
    languageName: "Russian",
    languageCode: "ru-RU",
    voices: ["ru-RU-DmitryNeural", "ru-RU-SvetlanaNeural"],
  },
  {
    languageName: "Turkish",
    languageCode: "tr-TR",
    voices: ["tr-TR-AhmetNeural", "tr-TR-EmelNeural"],
  },
  {
    languageName: "Ukrainian",
    languageCode: "uk-UA",
    voices: ["uk-UA-OstapNeural", "uk-UA-PolinaNeural"],
  },
  {
    languageName: "Vietnamese",
    languageCode: "vi-VN",
    voices: ["vi-VN-HoaiMyNeural", "vi-VN-NamMinhNeural"],
  },
  {
    languageName: "Chinese (Simplified)",
    languageCode: "zh-CN",
    voices: ["zh-CN-XiaoxiaoNeural", "zh-CN-YunjianNeural", "zh-CN-YunxiNeural"],
  },
  {
    languageName: "Chinese (Traditional, Hong Kong)",
    languageCode: "zh-HK",
    voices: ["zh-HK-HiuGaaiNeural", "zh-HK-WanLungNeural"],
  },
  {
    languageName: "Zulu",
    languageCode: "zu-ZA",
    voices: ["zu-ZA-ThandoNeural", "zu-ZA-ThembaNeural"],
  }
];

const LanguageSelector = ({ onUploadSuccess }) => {
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(languages[0].languageCode);
  const [selectedVoice, setSelectedVoice] = useState(languages[0].voices[0]);
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
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
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAudioUrl(URL.createObjectURL(selectedFile)); // Create a local URL for preview
    }
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

      {/* Audio player for preview */}
      {audioUrl && (
        <div className="--accent-color flex flex-col items-center justify-center w-full mt-5">
          <h4 className="--accent-color text-lg font-semibold mb-2">Preview: Original Audio</h4>
          <audio controls className="--accent-color w-4/5 max-w-2xl">
            <source src={audioUrl} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}


      <button type="submit" className="submit-button" disabled={!file || isUploading}>
        {isUploading ? 'Uploading...' : 'Start Translation'}
      </button>
    </form>
  );
};

export default LanguageSelector;


// #******Language Code

// # afr, amh, arb, ary, arz, asm, azj, bel, ben, bos, bul, cat, ceb, ces, ckb, cmn, 
// # cmn_Hant, cym, dan, deu, ell, eng, est, eus, fin, fra, fuv, gaz, gle, glg, guj, 
// # heb, hin, hrv, hun, hye, ibo, ind, isl, ita, jav, jpn, kan, kat, kaz, khk, khm, 
// # kir, kor, lao, lit, lug, luo, lvs, mai, mal, mar, mkd, mlt, mni, mya, nld, nno, 
// # nob, npi, nya, ory, pan, pbt, pes, pol, por, ron, rus, sat, slk, slv, sna, snd, 
// # som, spa, srp, swe, swh, tam, tel, tgk, tgl, tha, tur, ukr, urd, uzn, vie, yor, 
// # yue, zlm, zul

// #**************

// # $ edge-tts --list-voices
// # Name                               Gender    ContentCategories      VoicePersonalities
// # ---------------------------------  --------  ---------------------  --------------------------------------
// # af-ZA-AdriNeural                   Female    General                Friendly, Positive
// # af-ZA-WillemNeural                 Male      General                Friendly, Positive
// # am-ET-AmehaNeural                  Male      General                Friendly, Positive
// # am-ET-MekdesNeural                 Female    General                Friendly, Positive
// # ar-AE-FatimaNeural                 Female    General                Friendly, Positive
// # ar-AE-HamdanNeural                 Male      General                Friendly, Positive
// # ar-BH-AliNeural                    Male      General                Friendly, Positive
// # ar-BH-LailaNeural                  Female    General                Friendly, Positive
// # ar-DZ-AminaNeural                  Female    General                Friendly, Positive
// # ar-DZ-IsmaelNeural                 Male      General                Friendly, Positive
// # ar-EG-SalmaNeural                  Female    General                Friendly, Positive
// # ar-EG-ShakirNeural                 Male      General                Friendly, Positive
// # ar-IQ-BasselNeural                 Male      General                Friendly, Positive
// # ar-IQ-RanaNeural                   Female    General                Friendly, Positive
// # ar-JO-SanaNeural                   Female    General                Friendly, Positive
// # ar-JO-TaimNeural                   Male      General                Friendly, Positive
// # ar-KW-FahedNeural                  Male      General                Friendly, Positive
// # ar-KW-NouraNeural                  Female    General                Friendly, Positive
// # ar-LB-LaylaNeural                  Female    General                Friendly, Positive
// # ar-LB-RamiNeural                   Male      General                Friendly, Positive
// # ar-LY-ImanNeural                   Female    General                Friendly, Positive
// # ar-LY-OmarNeural                   Male      General                Friendly, Positive
// # ar-MA-JamalNeural                  Male      General                Friendly, Positive
// # ar-MA-MounaNeural                  Female    General                Friendly, Positive
// # ar-OM-AbdullahNeural               Male      General                Friendly, Positive
// # ar-OM-AyshaNeural                  Female    General                Friendly, Positive
// # ar-QA-AmalNeural                   Female    General                Friendly, Positive
// # ar-QA-MoazNeural                   Male      General                Friendly, Positive
// # ar-SA-HamedNeural                  Male      General                Friendly, Positive
// # ar-SA-ZariyahNeural                Female    General                Friendly, Positive
// # ar-SY-AmanyNeural                  Female    General                Friendly, Positive
// # ar-SY-LaithNeural                  Male      General                Friendly, Positive
// # ar-TN-HediNeural                   Male      General                Friendly, Positive
// # ar-TN-ReemNeural                   Female    General                Friendly, Positive
// # ar-YE-MaryamNeural                 Female    General                Friendly, Positive
// # ar-YE-SalehNeural                  Male      General                Friendly, Positive
// # az-AZ-BabekNeural                  Male      General                Friendly, Positive
// # az-AZ-BanuNeural                   Female    General                Friendly, Positive
// # bg-BG-BorislavNeural               Male      General                Friendly, Positive
// # bg-BG-KalinaNeural                 Female    General                Friendly, Positive
// # bn-BD-NabanitaNeural               Female    General                Friendly, Positive
// # bn-BD-PradeepNeural                Male      General                Friendly, Positive
// # bn-IN-BashkarNeural                Male      General                Friendly, Positive
// # bn-IN-TanishaaNeural               Female    General                Friendly, Positive
// # bs-BA-GoranNeural                  Male      General                Friendly, Positive
// # bs-BA-VesnaNeural                  Female    General                Friendly, Positive
// # ca-ES-EnricNeural                  Male      General                Friendly, Positive
// # ca-ES-JoanaNeural                  Female    General                Friendly, Positive
// # cs-CZ-AntoninNeural                Male      General                Friendly, Positive
// # cs-CZ-VlastaNeural                 Female    General                Friendly, Positive
// # cy-GB-AledNeural                   Male      General                Friendly, Positive
// # cy-GB-NiaNeural                    Female    General                Friendly, Positive
// # da-DK-ChristelNeural               Female    General                Friendly, Positive
// # da-DK-JeppeNeural                  Male      General                Friendly, Positive
// # de-AT-IngridNeural                 Female    General                Friendly, Positive
// # de-AT-JonasNeural                  Male      General                Friendly, Positive
// # de-CH-JanNeural                    Male      General                Friendly, Positive
// # de-CH-LeniNeural                   Female    General                Friendly, Positive
// # de-DE-AmalaNeural                  Female    General                Friendly, Positive
// # de-DE-ConradNeural                 Male      General                Friendly, Positive
// # de-DE-FlorianMultilingualNeural    Male      General                Friendly, Positive
// # de-DE-KatjaNeural                  Female    General                Friendly, Positive
// # de-DE-KillianNeural                Male      General                Friendly, Positive
// # de-DE-SeraphinaMultilingualNeural  Female    General                Friendly, Positive
// # el-GR-AthinaNeural                 Female    General                Friendly, Positive
// # el-GR-NestorasNeural               Male      General                Friendly, Positive
// # en-AU-NatashaNeural                Female    General                Friendly, Positive
// # en-AU-WilliamNeural                Male      General                Friendly, Positive
// # en-CA-ClaraNeural                  Female    General                Friendly, Positive
// # en-CA-LiamNeural                   Male      General                Friendly, Positive
// # en-GB-LibbyNeural                  Female    General                Friendly, Positive
// # en-GB-MaisieNeural                 Female    General                Friendly, Positive
// # en-GB-RyanNeural                   Male      General                Friendly, Positive
// # en-GB-SoniaNeural                  Female    General                Friendly, Positive
// # en-GB-ThomasNeural                 Male      General                Friendly, Positive
// # en-HK-SamNeural                    Male      General                Friendly, Positive
// # en-HK-YanNeural                    Female    General                Friendly, Positive
// # en-IE-ConnorNeural                 Male      General                Friendly, Positive
// # en-IE-EmilyNeural                  Female    General                Friendly, Positive
// # en-IN-NeerjaExpressiveNeural       Female    General                Friendly, Positive
// # en-IN-NeerjaNeural                 Female    General                Friendly, Positive
// # en-IN-PrabhatNeural                Male      General                Friendly, Positive
// # en-KE-AsiliaNeural                 Female    General                Friendly, Positive
// # en-KE-ChilembaNeural               Male      General                Friendly, Positive
// # en-NG-AbeoNeural                   Male      General                Friendly, Positive
// # en-NG-EzinneNeural                 Female    General                Friendly, Positive
// # en-NZ-MitchellNeural               Male      General                Friendly, Positive
// # en-NZ-MollyNeural                  Female    General                Friendly, Positive
// # en-PH-JamesNeural                  Male      General                Friendly, Positive
// # en-PH-RosaNeural                   Female    General                Friendly, Positive
// # en-SG-LunaNeural                   Female    General                Friendly, Positive
// # en-SG-WayneNeural                  Male      General                Friendly, Positive
// # en-TZ-ElimuNeural                  Male      General                Friendly, Positive
// # en-TZ-ImaniNeural                  Female    General                Friendly, Positive
// # en-US-AnaNeural                    Female    Cartoon, Conversation  Cute
// # en-US-AndrewMultilingualNeural     Male      Conversation, Copilot  Warm, Confident, Authentic, Honest
// # en-US-AndrewNeural                 Male      Conversation, Copilot  Warm, Confident, Authentic, Honest
// # en-US-AriaNeural                   Female    News, Novel            Positive, Confident
// # en-US-AvaMultilingualNeural        Female    Conversation, Copilot  Expressive, Caring, Pleasant, Friendly
// # en-US-AvaNeural                    Female    Conversation, Copilot  Expressive, Caring, Pleasant, Friendly
// # en-US-BrianMultilingualNeural      Male      Conversation, Copilot  Approachable, Casual, Sincere
// # en-US-BrianNeural                  Male      Conversation, Copilot  Approachable, Casual, Sincere
// # en-US-ChristopherNeural            Male      News, Novel            Reliable, Authority
// # en-US-EmmaMultilingualNeural       Female    Conversation, Copilot  Cheerful, Clear, Conversational
// # en-US-EmmaNeural                   Female    Conversation, Copilot  Cheerful, Clear, Conversational
// # en-US-EricNeural                   Male      News, Novel            Rational
// # en-US-GuyNeural                    Male      News, Novel            Passion
// # en-US-JennyNeural                  Female    General                Friendly, Considerate, Comfort
// # en-US-MichelleNeural               Female    News, Novel            Friendly, Pleasant
// # en-US-RogerNeural                  Male      News, Novel            Lively
// # en-US-SteffanNeural                Male      News, Novel            Rational
// # en-ZA-LeahNeural                   Female    General                Friendly, Positive
// # en-ZA-LukeNeural                   Male      General                Friendly, Positive
// # es-AR-ElenaNeural                  Female    General                Friendly, Positive
// # es-AR-TomasNeural                  Male      General                Friendly, Positive
// # es-BO-MarceloNeural                Male      General                Friendly, Positive
// # es-BO-SofiaNeural                  Female    General                Friendly, Positive
// # es-CL-CatalinaNeural               Female    General                Friendly, Positive
// # es-CL-LorenzoNeural                Male      General                Friendly, Positive
// # es-CO-GonzaloNeural                Male      General                Friendly, Positive
// # es-CO-SalomeNeural                 Female    General                Friendly, Positive
// # es-CR-JuanNeural                   Male      General                Friendly, Positive
// # es-CR-MariaNeural                  Female    General                Friendly, Positive
// # es-CU-BelkysNeural                 Female    General                Friendly, Positive
// # es-CU-ManuelNeural                 Male      General                Friendly, Positive
// # es-DO-EmilioNeural                 Male      General                Friendly, Positive
// # es-DO-RamonaNeural                 Female    General                Friendly, Positive
// # es-EC-AndreaNeural                 Female    General                Friendly, Positive
// # es-EC-LuisNeural                   Male      General                Friendly, Positive
// # es-ES-AlvaroNeural                 Male      General                Friendly, Positive
// # es-ES-ElviraNeural                 Female    General                Friendly, Positive
// # es-ES-XimenaNeural                 Female    General                Friendly, Positive
// # es-GQ-JavierNeural                 Male      General                Friendly, Positive
// # es-GQ-TeresaNeural                 Female    General                Friendly, Positive
// # es-GT-AndresNeural                 Male      General                Friendly, Positive
// # es-GT-MartaNeural                  Female    General                Friendly, Positive
// # es-HN-CarlosNeural                 Male      General                Friendly, Positive
// # es-HN-KarlaNeural                  Female    General                Friendly, Positive
// # es-MX-DaliaNeural                  Female    General                Friendly, Positive
// # es-MX-JorgeNeural                  Male      General                Friendly, Positive
// # es-NI-FedericoNeural               Male      General                Friendly, Positive
// # es-NI-YolandaNeural                Female    General                Friendly, Positive
// # es-PA-MargaritaNeural              Female    General                Friendly, Positive
// # es-PA-RobertoNeural                Male      General                Friendly, Positive
// # es-PE-AlexNeural                   Male      General                Friendly, Positive
// # es-PE-CamilaNeural                 Female    General                Friendly, Positive
// # es-PR-KarinaNeural                 Female    General                Friendly, Positive
// # es-PR-VictorNeural                 Male      General                Friendly, Positive
// # es-PY-MarioNeural                  Male      General                Friendly, Positive
// # es-PY-TaniaNeural                  Female    General                Friendly, Positive
// # es-SV-LorenaNeural                 Female    General                Friendly, Positive
// # es-SV-RodrigoNeural                Male      General                Friendly, Positive
// # es-US-AlonsoNeural                 Male      General                Friendly, Positive
// # es-US-PalomaNeural                 Female    General                Friendly, Positive
// # es-UY-MateoNeural                  Male      General                Friendly, Positive
// # es-UY-ValentinaNeural              Female    General                Friendly, Positive
// # es-VE-PaolaNeural                  Female    General                Friendly, Positive
// # es-VE-SebastianNeural              Male      General                Friendly, Positive
// # et-EE-AnuNeural                    Female    General                Friendly, Positive
// # et-EE-KertNeural                   Male      General                Friendly, Positive
// # fa-IR-DilaraNeural                 Female    General                Friendly, Positive
// # fa-IR-FaridNeural                  Male      General                Friendly, Positive
// # fi-FI-HarriNeural                  Male      General                Friendly, Positive
// # fi-FI-NooraNeural                  Female    General                Friendly, Positive
// # fil-PH-AngeloNeural                Male      General                Friendly, Positive
// # fil-PH-BlessicaNeural              Female    General                Friendly, Positive
// # fr-BE-CharlineNeural               Female    General                Friendly, Positive
// # fr-BE-GerardNeural                 Male      General                Friendly, Positive
// # fr-CA-AntoineNeural                Male      General                Friendly, Positive
// # fr-CA-JeanNeural                   Male      General                Friendly, Positive
// # fr-CA-SylvieNeural                 Female    General                Friendly, Positive
// # fr-CA-ThierryNeural                Male      General                Friendly, Positive
// # fr-CH-ArianeNeural                 Female    General                Friendly, Positive
// # fr-CH-FabriceNeural                Male      General                Friendly, Positive
// # fr-FR-DeniseNeural                 Female    General                Friendly, Positive
// # fr-FR-EloiseNeural                 Female    General                Friendly, Positive
// # fr-FR-HenriNeural                  Male      General                Friendly, Positive
// # fr-FR-RemyMultilingualNeural       Male      General                Friendly, Positive
// # fr-FR-VivienneMultilingualNeural   Female    General                Friendly, Positive
// # ga-IE-ColmNeural                   Male      General                Friendly, Positive
// # ga-IE-OrlaNeural                   Female    General                Friendly, Positive
// # gl-ES-RoiNeural                    Male      General                Friendly, Positive
// # gl-ES-SabelaNeural                 Female    General                Friendly, Positive
// # gu-IN-DhwaniNeural                 Female    General                Friendly, Positive
// # gu-IN-NiranjanNeural               Male      General                Friendly, Positive
// # he-IL-AvriNeural                   Male      General                Friendly, Positive
// # he-IL-HilaNeural                   Female    General                Friendly, Positive
// # hi-IN-MadhurNeural                 Male      General                Friendly, Positive
// # hi-IN-SwaraNeural                  Female    General                Friendly, Positive
// # hr-HR-GabrijelaNeural              Female    General                Friendly, Positive
// # hr-HR-SreckoNeural                 Male      General                Friendly, Positive
// # hu-HU-NoemiNeural                  Female    General                Friendly, Positive
// # hu-HU-TamasNeural                  Male      General                Friendly, Positive
// # id-ID-ArdiNeural                   Male      General                Friendly, Positive
// # id-ID-GadisNeural                  Female    General                Friendly, Positive
// # is-IS-GudrunNeural                 Female    General                Friendly, Positive
// # is-IS-GunnarNeural                 Male      General                Friendly, Positive
// # it-IT-DiegoNeural                  Male      General                Friendly, Positive
// # it-IT-ElsaNeural                   Female    General                Friendly, Positive
// # it-IT-GiuseppeMultilingualNeural   Male      General                Friendly, Positive
// # it-IT-IsabellaNeural               Female    General                Friendly, Positive
// # iu-Cans-CA-SiqiniqNeural           Female    General                Friendly, Positive
// # iu-Cans-CA-TaqqiqNeural            Male      General                Friendly, Positive
// # iu-Latn-CA-SiqiniqNeural           Female    General                Friendly, Positive
// # iu-Latn-CA-TaqqiqNeural            Male      General                Friendly, Positive
// # ja-JP-KeitaNeural                  Male      General                Friendly, Positive
// # ja-JP-NanamiNeural                 Female    General                Friendly, Positive
// # jv-ID-DimasNeural                  Male      General                Friendly, Positive
// # jv-ID-SitiNeural                   Female    General                Friendly, Positive
// # ka-GE-EkaNeural                    Female    General                Friendly, Positive
// # ka-GE-GiorgiNeural                 Male      General                Friendly, Positive
// # kk-KZ-AigulNeural                  Female    General                Friendly, Positive
// # kk-KZ-DauletNeural                 Male      General                Friendly, Positive
// # km-KH-PisethNeural                 Male      General                Friendly, Positive
// # km-KH-SreymomNeural                Female    General                Friendly, Positive
// # kn-IN-GaganNeural                  Male      General                Friendly, Positive
// # kn-IN-SapnaNeural                  Female    General                Friendly, Positive
// # ko-KR-HyunsuMultilingualNeural     Male      General                Friendly, Positive
// # ko-KR-InJoonNeural                 Male      General                Friendly, Positive
// # ko-KR-SunHiNeural                  Female    General                Friendly, Positive
// # lo-LA-ChanthavongNeural            Male      General                Friendly, Positive
// # lo-LA-KeomanyNeural                Female    General                Friendly, Positive
// # lt-LT-LeonasNeural                 Male      General                Friendly, Positive
// # lt-LT-OnaNeural                    Female    General                Friendly, Positive
// # lv-LV-EveritaNeural                Female    General                Friendly, Positive
// # lv-LV-NilsNeural                   Male      General                Friendly, Positive
// # mk-MK-AleksandarNeural             Male      General                Friendly, Positive
// # mk-MK-MarijaNeural                 Female    General                Friendly, Positive
// # ml-IN-MidhunNeural                 Male      General                Friendly, Positive
// # ml-IN-SobhanaNeural                Female    General                Friendly, Positive
// # mn-MN-BataaNeural                  Male      General                Friendly, Positive
// # mn-MN-YesuiNeural                  Female    General                Friendly, Positive
// # mr-IN-AarohiNeural                 Female    General                Friendly, Positive
// # mr-IN-ManoharNeural                Male      General                Friendly, Positive
// # ms-MY-OsmanNeural                  Male      General                Friendly, Positive
// # ms-MY-YasminNeural                 Female    General                Friendly, Positive
// # mt-MT-GraceNeural                  Female    General                Friendly, Positive
// # mt-MT-JosephNeural                 Male      General                Friendly, Positive
// # my-MM-NilarNeural                  Female    General                Friendly, Positive
// # my-MM-ThihaNeural                  Male      General                Friendly, Positive
// # nb-NO-FinnNeural                   Male      General                Friendly, Positive
// # nb-NO-PernilleNeural               Female    General                Friendly, Positive
// # ne-NP-HemkalaNeural                Female    General                Friendly, Positive
// # ne-NP-SagarNeural                  Male      General                Friendly, Positive
// # nl-BE-ArnaudNeural                 Male      General                Friendly, Positive
// # nl-BE-DenaNeural                   Female    General                Friendly, Positive
// # nl-NL-ColetteNeural                Female    General                Friendly, Positive
// # nl-NL-FennaNeural                  Female    General                Friendly, Positive
// # nl-NL-MaartenNeural                Male      General                Friendly, Positive
// # pl-PL-MarekNeural                  Male      General                Friendly, Positive
// # pl-PL-ZofiaNeural                  Female    General                Friendly, Positive
// # ps-AF-GulNawazNeural               Male      General                Friendly, Positive
// # ps-AF-LatifaNeural                 Female    General                Friendly, Positive
// # pt-BR-AntonioNeural                Male      General                Friendly, Positive
// # pt-BR-FranciscaNeural              Female    General                Friendly, Positive
// # pt-BR-ThalitaMultilingualNeural    Female    General                Friendly, Positive
// # pt-PT-DuarteNeural                 Male      General                Friendly, Positive
// # pt-PT-RaquelNeural                 Female    General                Friendly, Positive
// # ro-RO-AlinaNeural                  Female    General                Friendly, Positive
// # ro-RO-EmilNeural                   Male      General                Friendly, Positive
// # ru-RU-DmitryNeural                 Male      General                Friendly, Positive
// # ru-RU-SvetlanaNeural               Female    General                Friendly, Positive
// # si-LK-SameeraNeural                Male      General                Friendly, Positive
// # si-LK-ThiliniNeural                Female    General                Friendly, Positive
// # sk-SK-LukasNeural                  Male      General                Friendly, Positive
// # sk-SK-ViktoriaNeural               Female    General                Friendly, Positive
// # sl-SI-PetraNeural                  Female    General                Friendly, Positive
// # sl-SI-RokNeural                    Male      General                Friendly, Positive
// # so-SO-MuuseNeural                  Male      General                Friendly, Positive
// # so-SO-UbaxNeural                   Female    General                Friendly, Positive
// # sq-AL-AnilaNeural                  Female    General                Friendly, Positive
// # sq-AL-IlirNeural                   Male      General                Friendly, Positive
// # sr-RS-NicholasNeural               Male      General                Friendly, Positive
// # sr-RS-SophieNeural                 Female    General                Friendly, Positive
// # su-ID-JajangNeural                 Male      General                Friendly, Positive
// # su-ID-TutiNeural                   Female    General                Friendly, Positive
// # sv-SE-MattiasNeural                Male      General                Friendly, Positive
// # sv-SE-SofieNeural                  Female    General                Friendly, Positive
// # sw-KE-RafikiNeural                 Male      General                Friendly, Positive
// # sw-KE-ZuriNeural                   Female    General                Friendly, Positive
// # sw-TZ-DaudiNeural                  Male      General                Friendly, Positive
// # sw-TZ-RehemaNeural                 Female    General                Friendly, Positive
// # ta-IN-PallaviNeural                Female    General                Friendly, Positive
// # ta-IN-ValluvarNeural               Male      General                Friendly, Positive
// # ta-LK-KumarNeural                  Male      General                Friendly, Positive
// # ta-LK-SaranyaNeural                Female    General                Friendly, Positive
// # ta-MY-KaniNeural                   Female    General                Friendly, Positive
// # ta-MY-SuryaNeural                  Male      General                Friendly, Positive
// # ta-SG-AnbuNeural                   Male      General                Friendly, Positive
// # ta-SG-VenbaNeural                  Female    General                Friendly, Positive
// # te-IN-MohanNeural                  Male      General                Friendly, Positive
// # te-IN-ShrutiNeural                 Female    General                Friendly, Positive
// # th-TH-NiwatNeural                  Male      General                Friendly, Positive
// # th-TH-PremwadeeNeural              Female    General                Friendly, Positive
// # tr-TR-AhmetNeural                  Male      General                Friendly, Positive
// # tr-TR-EmelNeural                   Female    General                Friendly, Positive
// # uk-UA-OstapNeural                  Male      General                Friendly, Positive
// # uk-UA-PolinaNeural                 Female    General                Friendly, Positive
// # ur-IN-GulNeural                    Female    General                Friendly, Positive
// # ur-IN-SalmanNeural                 Male      General                Friendly, Positive
// # ur-PK-AsadNeural                   Male      General                Friendly, Positive
// # ur-PK-UzmaNeural                   Female    General                Friendly, Positive
// # uz-UZ-MadinaNeural                 Female    General                Friendly, Positive
// # uz-UZ-SardorNeural                 Male      General                Friendly, Positive
// # vi-VN-HoaiMyNeural                 Female    General                Friendly, Positive
// # vi-VN-NamMinhNeural                Male      General                Friendly, Positive
// # zh-CN-XiaoxiaoNeural               Female    News, Novel            Warm
// # zh-CN-XiaoyiNeural                 Female    Cartoon, Novel         Lively
// # zh-CN-YunjianNeural                Male      Sports, Novel          Passion
// # zh-CN-YunxiNeural                  Male      Novel                  Lively, Sunshine
// # zh-CN-YunxiaNeural                 Male      Cartoon, Novel         Cute
// # zh-CN-YunyangNeural                Male      News                   Professional, Reliable
// # zh-CN-liaoning-XiaobeiNeural       Female    Dialect                Humorous
// # zh-CN-shaanxi-XiaoniNeural         Female    Dialect                Bright
// # zh-HK-HiuGaaiNeural                Female    General                Friendly, Positive
// # zh-HK-HiuMaanNeural                Female    General                Friendly, Positive
// # zh-HK-WanLungNeural                Male      General                Friendly, Positive
// # zh-TW-HsiaoChenNeural              Female    General                Friendly, Positive
// # zh-TW-HsiaoYuNeural                Female    General                Friendly, Positive
// # zh-TW-YunJheNeural                 Male      General                Friendly, Positive
// # zu-ZA-ThandoNeural                 Female    General                Friendly, Positive
// # zu-ZA-ThembaNeural                 Male      General                Friendly, Positive

// #***********************************************************************************************************************************
