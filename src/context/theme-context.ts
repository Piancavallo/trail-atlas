import { createContext } from 'react'
import { type Theme } from '../types/theme'

export interface ThemeContextValue {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  cycleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
