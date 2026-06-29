import type { NpsApiError } from '../api/nps'

export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as NpsApiError).message)
  }
  return fallback
}
