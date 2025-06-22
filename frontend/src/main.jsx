// File: src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import App from './App.jsx';
import Register from './components/Login/Register.jsx'; 
import './styles/theme.css';
import './index.css'

// Entry point: render the React app into the root DOM element
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Set up client-side routing for the app */}
    <BrowserRouter>
      <Routes>
        {/* Route for login page */}
        <Route path="/" element={<Login />} />
        {/* Route for registration page */}
        <Route path="/register" element={<Register />} />
        {/* Route for main translation app */}
        <Route path="/app" element={<App />} />
        
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

