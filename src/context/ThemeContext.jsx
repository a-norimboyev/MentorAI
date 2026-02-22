import { createContext, useContext, useState, useEffect, useMemo } from 'react'

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

  // System preference state
  const [systemDark, setSystemDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    localStorage.setItem('mentorai-theme', theme)
    
    const root = document.documentElement
    
    // Theme transition animation
    root.classList.add('theme-transition')
    
    if (theme === 'system') {
      root.classList.toggle('dark', systemDark)
      root.classList.toggle('light', !systemDark)
    } else {
      root.classList.toggle('dark', theme === 'dark')
      root.classList.toggle('light', theme === 'light')
    }
    
    // Transition klassni o'chirish (performance uchun)
    const timer = setTimeout(() => root.classList.remove('theme-transition'), 400)
    return () => clearTimeout(timer)
  }, [theme, systemDark])

  // Tizim temasini kuzatish
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      setSystemDark(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const isDark = useMemo(() => 
    theme === 'dark' || (theme === 'system' && systemDark),
    [theme, systemDark]
  )

  const value = useMemo(() => ({
    theme,
    setTheme,
    isDark
  }), [theme, isDark])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
