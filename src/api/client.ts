import axios, { type AxiosError } from 'axios'
import { assertNpsApiKey, env, NPS_API_BASE_URL } from '../config/env'

export interface NpsApiError {
  message: string
  status?: number
  code?: string
}

export const npsClient = axios.create({
  baseURL: NPS_API_BASE_URL,
  timeout: 15_000,
})

npsClient.interceptors.request.use((config) => {
  assertNpsApiKey()
  config.headers.set('X-Api-Key', env.npsApiKey)
  return config
})

npsClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    throw parseNpsError(error)
  },
)

export function parseNpsError(error: unknown): NpsApiError {
  if (!axios.isAxiosError(error)) {
    return { message: 'An unexpected error occurred.' }
  }

  const status = error.response?.status

  if (status === 401 || status === 403) {
    return {
      message: 'Invalid or missing NPS API key. Check your VITE_NPS_API_KEY in .env.',
      status,
      code: 'UNAUTHORIZED',
    }
  }

  if (status === 429) {
    return {
      message: 'NPS API rate limit exceeded. Please wait and try again.',
      status,
      code: 'RATE_LIMIT',
    }
  }

  if (status && status >= 500) {
    return {
      message: 'NPS API is temporarily unavailable. Please try again later.',
      status,
      code: 'SERVER_ERROR',
    }
  }

  if (error.code === 'ECONNABORTED') {
    return { message: 'Request timed out. Please try again.', code: 'TIMEOUT' }
  }

  if (!error.response) {
    return {
      message: 'Network error. Check your connection and try again.',
      code: 'NETWORK',
    }
  }

  return {
    message: error.message || 'Failed to fetch data from the NPS API.',
    status,
    code: 'REQUEST_FAILED',
  }
}
