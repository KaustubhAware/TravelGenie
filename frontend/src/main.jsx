import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import "./index.css";
import "leaflet/dist/leaflet.css";
import "./lib/chartConfig";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
