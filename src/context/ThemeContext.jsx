import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('mentorai-theme')
    return saved || 'dark'
  })

  useEffect(() => {
    localStorage.setItem('mentorai-theme', theme)
    
    const root = document.documentElement
    
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', systemDark)
      root.classList.toggle('light', !systemDark)
    } else {
      root.classList.toggle('dark', theme === 'dark')
      root.classList.toggle('light', theme === 'light')
    }
  }, [theme])

  // Tizim temasini kuzatish
  useEffect(() => {
    if (theme !== 'system') return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      const root = document.documentElement
      root.classList.toggle('dark', e.matches)
      root.classList.toggle('light', !e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const value = {
    theme,
    setTheme,
    isDark: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
