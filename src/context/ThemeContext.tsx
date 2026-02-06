import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = 'one-deal-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement
    root.classList.add('theme-transitioning')
    root.classList.toggle('dark', newTheme === 'dark')
    localStorage.setItem(STORAGE_KEY, newTheme)
    // Remove transition class after animation completes
    setTimeout(() => root.classList.remove('theme-transitioning'), 250)
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme, applyTheme])

  const toggleTheme = useCallback(() => {
    setThemeState(t => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
