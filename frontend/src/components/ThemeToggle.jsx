import { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    // Default to light theme if no preference saved
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // Apply theme to document and save to localStorage
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="theme-toggle-container">
      <button 
        onClick={toggleTheme}
        className="theme-toggle-button"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <span className="theme-icon">
          {theme === 'light' ? '🌙' : '☀️'}
        </span>
        <span className="theme-text">
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle;