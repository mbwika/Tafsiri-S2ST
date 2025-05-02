<<<<<<< HEAD


// File: src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import App from './App.jsx';
import Register from './components/Login/Register.jsx'; 
import './styles/theme.css';
=======
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
>>>>>>> b745fb3fe51a0964ad4ca0c1d98c7cc49d29e4a8
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/app" element={<App />} />
        
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

