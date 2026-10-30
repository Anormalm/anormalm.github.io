import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const searchParams = new URLSearchParams(window.location.search)
const redirectedPath = searchParams.get('redirect')
if (redirectedPath && redirectedPath.startsWith('/')) {
  const destination = new URL(redirectedPath, window.location.origin)
  if (destination.origin === window.location.origin) {
    window.history.replaceState(null, '', destination)
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
