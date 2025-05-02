import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
<<<<<<< HEAD
  // server: {
  //   proxy: {
  //     '/api': 'http://localhost:5000'
  //   }
  // }
=======
>>>>>>> b745fb3fe51a0964ad4ca0c1d98c7cc49d29e4a8
})
