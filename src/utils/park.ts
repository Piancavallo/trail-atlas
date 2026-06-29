import type { Park, ParkImage } from '../types/nps'

export function getParkPrimaryImage(park: Park): ParkImage | undefined {
  return park.images?.[0]
}

export function getParkImageAlt(image: ParkImage, parkName: string): string {
  return image.altText || image.title || parkName
}

export function parseParkStates(states: string): string[] {
  return states
    .split(',')
    .map((state) => state.trim())
    .filter(Boolean)
}

export function formatParkStates(states: string): string {
  return parseParkStates(states).join(', ')
}
