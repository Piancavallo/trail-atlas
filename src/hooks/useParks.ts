import { useQuery } from '@tanstack/react-query'
import { fetchParks } from '../api/nps'
import { queryKeys } from '../api/queryKeys'
import type { FetchParksParams } from '../types/nps'

export function useParksList(params?: FetchParksParams) {
  return useQuery({
    queryKey: queryKeys.parks.list(params),
    queryFn: () => fetchParks(params),
  })
}
