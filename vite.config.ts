import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
    allowedHosts: ['.ngrok-free.app'],
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Địa chỉ của backend
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
