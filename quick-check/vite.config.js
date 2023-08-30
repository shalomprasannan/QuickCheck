import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcss from 'postcss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), postcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9097',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/file': {
        target: 'http://localhost:9097',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
