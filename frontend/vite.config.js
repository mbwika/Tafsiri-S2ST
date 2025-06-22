// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Export Vite configuration for the React frontend
export default defineConfig({
  // Plugins used: React for JSX/TSX support, Tailwind CSS for styling
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Optional: server proxy settings for API requests during development
  // server: {
  //   proxy: {
  //     // '/api': 'http://localhost:5000'
  //   }
  // }
})
