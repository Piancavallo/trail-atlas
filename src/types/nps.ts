export interface ParkImage {
  url: string
  title: string
  altText: string
  caption: string
  credit: string
}

export interface ParkActivity {
  id: string
  name: string
}

export interface EntranceFee {
  cost: string
  description: string
  title: string
}

export interface OperatingHours {
  name: string
  description: string
  standardHours: Record<string, string>
}

export interface Park {
  id: string
  url: string
  fullName: string
  parkCode: string
  description: string
  latitude: string
  longitude: string
  latLong: string
  states: string
  designation: string
  images?: ParkImage[]
  activities?: ParkActivity[]
  entranceFees?: EntranceFee[]
  operatingHours?: OperatingHours[]
}

/** NPS list endpoints return pagination fields as strings. */
export interface NpsPaginatedResponse<T> {
  total: string
  limit: string
  start: string
  data: T[]
}

export interface FetchParksParams {
  limit?: number
  start?: number
  stateCode?: string
  parkCode?: string
  q?: string
  sort?: string
  /** Comma-separated NPS fields, e.g. "images,activities" */
  fields?: string
}
