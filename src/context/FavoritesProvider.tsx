import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { FavoritesContext, type FavoritesContextValue } from './favorites-context'
import { FAVORITES_STORAGE_KEY } from '../types/favorites'

function readStoredFavorites(): string[] {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((code): code is string => typeof code === 'string' && code.length > 0)
  } catch {
    return []
  }
}

function writeStoredFavorites(favorites: string[]): void {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => readStoredFavorites())

  useEffect(() => {
    writeStoredFavorites(favorites)
  }, [favorites])

  const isFavorite = useCallback(
    (parkCode: string) => favorites.includes(parkCode),
    [favorites],
  )

  const addFavorite = useCallback((parkCode: string) => {
    setFavorites((current) => (current.includes(parkCode) ? current : [...current, parkCode]))
  }, [])

  const removeFavorite = useCallback((parkCode: string) => {
    setFavorites((current) => current.filter((code) => code !== parkCode))
  }, [])

  const toggleFavorite = useCallback((parkCode: string) => {
    setFavorites((current) =>
      current.includes(parkCode)
        ? current.filter((code) => code !== parkCode)
        : [...current, parkCode],
    )
  }, [])

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      isFavorite,
      toggleFavorite,
      addFavorite,
      removeFavorite,
    }),
    [favorites, isFavorite, toggleFavorite, addFavorite, removeFavorite],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
