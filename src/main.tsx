import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from './providers/AppProviders'
import { applyThemeToDocument, getStoredTheme } from './utils/theme'
import App from './App.tsx'
import './index.css'
import 'leaflet/dist/leaflet.css'

applyThemeToDocument(getStoredTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
