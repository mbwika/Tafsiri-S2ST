// const VoiceSelector = ({ selectedVoice, setSelectedVoice, voices }) => {
//     return (
//       <div>
//         <label className="block text-gray-700 font-medium">Select Voice:</label>
//         <select
//           className="w-full p-2 border rounded-md"
//           value={selectedVoice}
//           onChange={(e) => setSelectedVoice(e.target.value)}
//         >
//           <option value="">-- Choose Voice --</option>
//           {voices.map((voice) => (
//             <option key={voice.id} value={voice.id}>
//               {voice.name}
//             </option>
//           ))}
//         </select>
//       </div>
//     );
//   };

// const VoiceSelector = ({ selectedVoice, setSelectedVoice, voices }) => {
//   return (
//     <select
//       value={selectedVoice}
//       onChange={(e) => setSelectedVoice(e.target.value)}
//     >
//       {voices.map(([language, voiceOptions]) => (
//         <optgroup key={language} label={language}>
//           {voiceOptions.map((voice) => (
//             <option key={voice} value={voice}>
//               {voice}
//             </option>
//           ))}
//         </optgroup>
//       ))}
//     </select>
//   );
// };
  
//   export default VoiceSelector;
  