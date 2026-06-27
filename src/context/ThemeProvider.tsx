import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type ThemeContextValue } from './theme-context'
import { type Theme } from '../types/theme'
import {
  applyThemeToDocument,
  getStoredTheme,
  getSystemTheme,
  setStoredTheme,
} from '../utils/theme'

const themeOrder: Theme[] = ['light', 'dark', 'system']

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme())
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>(() =>
    getSystemTheme(),
  )

  const resolvedTheme = useMemo(
    () => (theme === 'system' ? systemPreference : theme),
    [theme, systemPreference],
  )

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    setStoredTheme(next)
  }, [])

  const cycleTheme = useCallback(() => {
    const currentIndex = themeOrder.indexOf(theme)
    const next = themeOrder[(currentIndex + 1) % themeOrder.length]
    setTheme(next)
  }, [setTheme, theme])

  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme, systemPreference])

  useEffect(() => {
    if (theme !== 'system') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemPreference(getSystemTheme())

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [theme])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, cycleTheme }),
    [theme, resolvedTheme, setTheme, cycleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
