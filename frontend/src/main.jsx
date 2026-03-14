import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AddSiteModalProvider } from './context/AddSiteModalContext.jsx'

createRoot(document.getElementById('root')).render(
    <AddSiteModalProvider>
      <App />
    </AddSiteModalProvider>
)
