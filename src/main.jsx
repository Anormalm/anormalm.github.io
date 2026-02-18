import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const searchParams = new URLSearchParams(window.location.search)
const redirectedPath = searchParams.get('redirect')
if (redirectedPath) {
  window.history.replaceState(null, '', redirectedPath)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
