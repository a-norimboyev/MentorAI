import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Temani boshlash
const savedTheme = localStorage.getItem('mentorai-theme') || 'dark'
if (savedTheme === 'system') {
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.add(systemDark ? 'dark' : 'light')
} else {
  document.documentElement.classList.add(savedTheme)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
