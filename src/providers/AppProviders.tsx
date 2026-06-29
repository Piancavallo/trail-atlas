import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { type ReactNode } from 'react'
import { queryClient } from '../config/queryClient'
import { FavoritesProvider } from '../context/FavoritesProvider'
import { TripProvider } from '../context/TripProvider'
import { ThemeProvider } from '../context/ThemeProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FavoritesProvider>
          <TripProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </TripProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
