import type { Park } from '../types/nps'

export interface ParkCoordinates {
  lat: number
  lng: number
}

function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !(lat === 0 && lng === 0)
  )
}

/** Parse NPS latitude/longitude fields into usable map coordinates. */
export function parseParkCoordinates(park: Park): ParkCoordinates | null {
  const lat = Number.parseFloat(park.latitude)
  const lng = Number.parseFloat(park.longitude)

  if (isValidCoordinate(lat, lng)) {
    return { lat, lng }
  }

  const latLongMatch = park.latLong?.match(
    /lat:\s*(-?\d+(?:\.\d+)?),\s*long:\s*(-?\d+(?:\.\d+)?)/i,
  )

  if (latLongMatch) {
    const parsedLat = Number.parseFloat(latLongMatch[1])
    const parsedLng = Number.parseFloat(latLongMatch[2])

    if (isValidCoordinate(parsedLat, parsedLng)) {
      return { lat: parsedLat, lng: parsedLng }
    }
  }

  return null
}

export interface MappablePark {
  park: Park
  coordinates: ParkCoordinates
}

export function getMappableParks(parks: Park[]): {
  mappableParks: MappablePark[]
  skippedCount: number
} {
  const mappableParks: MappablePark[] = []
  let skippedCount = 0

  for (const park of parks) {
    const coordinates = parseParkCoordinates(park)
    if (coordinates) {
      mappableParks.push({ park, coordinates })
    } else {
      skippedCount += 1
    }
  }

  return { mappableParks, skippedCount }
}
