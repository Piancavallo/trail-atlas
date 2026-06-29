import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { TripContext, type TripContextValue } from './trip-context'
import { TRIP_STORAGE_KEY } from '../types/trip'

function readStoredTrip(): string[] {
  try {
    const stored = localStorage.getItem(TRIP_STORAGE_KEY)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    const seen = new Set<string>()
    return parsed.filter((code): code is string => {
      if (typeof code !== 'string' || code.length === 0 || seen.has(code)) return false
      seen.add(code)
      return true
    })
  } catch {
    return []
  }
}

function writeStoredTrip(trip: string[]): void {
  localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(trip))
}

function swapAt(trip: string[], index: number, targetIndex: number): string[] {
  if (targetIndex < 0 || targetIndex >= trip.length) return trip
  const next = [...trip]
  ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
  return next
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [trip, setTrip] = useState<string[]>(() => readStoredTrip())

  useEffect(() => {
    writeStoredTrip(trip)
  }, [trip])

  const isInTrip = useCallback((parkCode: string) => trip.includes(parkCode), [trip])

  const addToTrip = useCallback((parkCode: string) => {
    setTrip((current) => (current.includes(parkCode) ? current : [...current, parkCode]))
  }, [])

  const removeFromTrip = useCallback((parkCode: string) => {
    setTrip((current) => current.filter((code) => code !== parkCode))
  }, [])

  const toggleTrip = useCallback((parkCode: string) => {
    setTrip((current) =>
      current.includes(parkCode)
        ? current.filter((code) => code !== parkCode)
        : [...current, parkCode],
    )
  }, [])

  const moveUp = useCallback((parkCode: string) => {
    setTrip((current) => {
      const index = current.indexOf(parkCode)
      if (index <= 0) return current
      return swapAt(current, index, index - 1)
    })
  }, [])

  const moveDown = useCallback((parkCode: string) => {
    setTrip((current) => {
      const index = current.indexOf(parkCode)
      if (index === -1 || index >= current.length - 1) return current
      return swapAt(current, index, index + 1)
    })
  }, [])

  const clearTrip = useCallback(() => {
    setTrip([])
  }, [])

  const value = useMemo<TripContextValue>(
    () => ({
      trip,
      isInTrip,
      addToTrip,
      removeFromTrip,
      toggleTrip,
      moveUp,
      moveDown,
      clearTrip,
    }),
    [trip, isInTrip, addToTrip, removeFromTrip, toggleTrip, moveUp, moveDown, clearTrip],
  )

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}
