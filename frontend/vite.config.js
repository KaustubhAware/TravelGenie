import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          charts: ["chart.js", "react-chartjs-2"],
          pdf: ["jspdf"],
          canvas: ["html2canvas"],
          maps: ["leaflet", "react-leaflet"],
          icons: ["react-icons"],
        },
      },
    },
  },
})
