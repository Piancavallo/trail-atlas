import type { FetchParksParams } from '../types/nps'

export const queryKeys = {
  parks: {
    all: ['parks'] as const,
    lists: () => [...queryKeys.parks.all, 'list'] as const,
    list: (params?: FetchParksParams) =>
      [...queryKeys.parks.lists(), params ?? {}] as const,
  },
} as const
