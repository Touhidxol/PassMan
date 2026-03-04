import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AddWindowProvider } from './context/AddWindowContext.jsx'

createRoot(document.getElementById('root')).render(
    <AddWindowProvider>
      <App />
    </AddWindowProvider>
)
