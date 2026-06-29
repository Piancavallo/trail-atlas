import type { Park } from '../types/nps'
import { parseParkStates } from './park'

/** Best-effort single-park entrance fee estimate (vehicle/standard pass). */
export function estimateParkEntranceFee(park: Park): number | null {
  const fees = park.entranceFees ?? []
  if (fees.length === 0) return null

  const parsed = fees
    .map((fee) => Number.parseFloat(fee.cost))
    .filter((cost) => Number.isFinite(cost) && cost >= 0)

  if (parsed.length === 0) return null

  const vehicleFee = fees.find((fee) =>
    /vehicle|entrance|pass/i.test(fee.title),
  )
  if (vehicleFee) {
    const cost = Number.parseFloat(vehicleFee.cost)
    if (Number.isFinite(cost) && cost >= 0) return cost
  }

  return Math.max(...parsed)
}

export function estimateTripEntranceFees(parks: Park[]): number | null {
  let total = 0
  let hasAny = false

  for (const park of parks) {
    const fee = estimateParkEntranceFee(park)
    if (fee !== null) {
      total += fee
      hasAny = true
    }
  }

  return hasAny ? total : null
}

export function getTripStates(parks: Park[]): string[] {
  const states = new Set<string>()
  for (const park of parks) {
    for (const state of parseParkStates(park.states)) {
      states.add(state)
    }
  }
  return Array.from(states).sort()
}

export function orderParksByTrip(parks: Park[], tripOrder: string[]): Park[] {
  const byCode = new Map(parks.map((park) => [park.parkCode, park]))
  return tripOrder
    .map((code) => byCode.get(code))
    .filter((park): park is Park => park !== undefined)
}
