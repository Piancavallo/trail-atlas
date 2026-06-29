import { createContext } from 'react'

export interface FavoritesContextValue {
  favorites: string[]
  isFavorite: (parkCode: string) => boolean
  toggleFavorite: (parkCode: string) => void
  addFavorite: (parkCode: string) => void
  removeFavorite: (parkCode: string) => void
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null)
