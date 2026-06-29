import type { FetchParksParams, NpsPaginatedResponse, Park } from '../types/nps'
import { npsClient } from './client'

export { npsClient, parseNpsError } from './client'
export type { NpsApiError } from './client'

export async function fetchParks(
  params?: FetchParksParams,
): Promise<NpsPaginatedResponse<Park>> {
  const { data } = await npsClient.get<NpsPaginatedResponse<Park>>('/parks', {
    params,
  })
  return data
}
