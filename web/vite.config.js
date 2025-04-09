import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // <-- permite acceso desde red local
    port: 5173,           // <-- el puerto por defecto o el que quieras
    strictPort: true,     // <-- evita que lo cambie automáticamente
  }
})
