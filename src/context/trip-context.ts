import { createContext } from 'react'

export interface TripContextValue {
  trip: string[]
  isInTrip: (parkCode: string) => boolean
  addToTrip: (parkCode: string) => void
  removeFromTrip: (parkCode: string) => void
  toggleTrip: (parkCode: string) => void
  moveUp: (parkCode: string) => void
  moveDown: (parkCode: string) => void
  clearTrip: () => void
}

export const TripContext = createContext<TripContextValue | null>(null)
