// File: frontend/src/api/apiService.js

import axios from 'axios'; // Import the axios HTTP client library

// const API_BASE = 'http://172.20.0.2:8000'; // (Optional) Base URL for the API, currently commented out

// Function to upload an audio file for translation
export const uploadAudio = async (file, tgtLang, voice) => {
  const formData = new FormData(); // Create a new FormData object to hold the file and parameters
  formData.append('file', file); // Add the audio file to the form data
  formData.append('tgt_lang', tgtLang); // Add the target language to the form data
  formData.append('voice', voice); // Add the selected voice to the form data

  // Send a POST request to the '/translate/' endpoint with the form data
  return axios.post('/translate/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Set the content type for file upload
    },
  });
};

// Function to check the status of a translation task by its task ID
export const checkStatus = async (taskId) => {
  // Send a GET request to the '/status/{taskId}' endpoint
  return axios.get(`/status/${taskId}`);
};

// Function to download the translated audio file by its task ID
export const downloadAudio = async (taskId) => {
  // Send a GET request to the '/download/{taskId}' endpoint
  // Set the response type to 'blob' to handle binary data (audio file)
  return axios.get(`/download/${taskId}`, {
    responseType: 'blob',
  });
};
