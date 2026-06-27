export const NPS_API_BASE_URL = 'https://developer.nps.gov/api/v1'

export const env = {
  npsApiKey: import.meta.env.VITE_NPS_API_KEY ?? '',
  npsApiBaseUrl: NPS_API_BASE_URL,
} as const

/** Call before making NPS API requests (Phase 2+). */
export function assertNpsApiKey(): void {
  if (!env.npsApiKey) {
    throw new Error(
      'VITE_NPS_API_KEY is not set. Copy .env.example to .env and add your NPS API key.',
    )
  }
}
