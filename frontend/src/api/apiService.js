

// File: frontend/src/api/apiService.js

import axios from 'axios';

// const API_BASE = 'http://localhost:8000';

export const uploadAudio = async (file, tgtLang, voice) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('tgt_lang', tgtLang);
  formData.append('voice', voice);

  return axios.post(`/translate/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const checkStatus = async (taskId) => {
  return axios.get(`/status/${taskId}`);
};

export const downloadAudio = async (taskId) => {
  return axios.get(`/download/${taskId}`, {
    responseType: 'blob',
  });
};

// const API_BASE = 'https://tafsiri.creativedisturbance.org/api-llm';

// export const uploadAudio = async (file, tgtLang, voice) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('tgt_lang', tgtLang);

//   formData.append('voice', voice);
//   console.log("Target Language:", tgtLang);


//   return axios.post(`${API_BASE}/translate/`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
// };

// export const checkStatus = async (taskId) => {
//   return axios.get(`${API_BASE}/status/${taskId}`);
// };

// export const downloadAudio = async (taskId) => {
//   return axios.get(`${API_BASE}/download/${taskId}`, {
//     responseType: 'blob',
//   });
// };