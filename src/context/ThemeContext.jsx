/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react'

/**
 * ThemeContext
 * Manages light / dark mode.
 * Persists user preference in localStorage.
 * Applies data-theme="dark" attribute on <html> for CSS variable switching.
 */
export const ThemeContext = createContext(null)

const THEME_KEY = 'abs_theme'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored) return stored
    // Respect OS preference if no stored value
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Apply data-theme attribute to <html> element
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  const value = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
