import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/tmdb': {
        target: 'https://api.themoviedb.org/3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tmdb/, '')
      },
      '/tmdb-images': {
        target: 'https://image.tmdb.org/t/p',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tmdb-images/, '')
      }
    }
  }
})
