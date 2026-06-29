import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import type { Park } from '../../types/nps'
import { getMappableParks, type ParkCoordinates } from '../../utils/coordinates'
import { getParkImageAlt, getParkPrimaryImage } from '../../utils/park'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

const DEFAULT_CENTER: ParkCoordinates = { lat: 39.8283, lng: -98.5795 }
const DEFAULT_ZOOM = 4

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
})

interface ParkMapProps {
  parks: Park[]
}

function FitMapBounds({ positions }: { positions: ParkCoordinates[] }) {
  const map = useMap()

  useEffect(() => {
    if (positions.length === 0) {
      map.setView([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], DEFAULT_ZOOM)
      return
    }

    if (positions.length === 1) {
      map.setView([positions[0].lat, positions[0].lng], 9)
      return
    }

    const bounds = L.latLngBounds(positions.map(({ lat, lng }) => [lat, lng]))
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 10 })
  }, [map, positions])

  return null
}

export function ParkMap({ parks }: ParkMapProps) {
  const { mappableParks, skippedCount } = useMemo(() => getMappableParks(parks), [parks])
  const positions = useMemo(
    () => mappableParks.map(({ coordinates }) => coordinates),
    [mappableParks],
  )

  return (
    <div className="flex h-full min-h-[28rem] flex-col">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-border">
        <MapContainer
          center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
          zoom={DEFAULT_ZOOM}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitMapBounds positions={positions} />
          {mappableParks.map(({ park, coordinates }) => {
            const primaryImage = getParkPrimaryImage(park)

            return (
              <Marker
                key={park.parkCode}
                position={[coordinates.lat, coordinates.lng]}
              >
                <Popup>
                  <div className="min-w-[12rem] max-w-[14rem] space-y-3">
                    <p className="font-display text-sm font-semibold text-foreground">
                      {park.fullName}
                    </p>
                    {primaryImage && (
                      <img
                        src={primaryImage.url}
                        alt={getParkImageAlt(primaryImage, park.fullName)}
                        className="aspect-video w-full rounded-lg object-cover"
                        loading="lazy"
                      />
                    )}
                    <Link
                      to={`/parks/${park.parkCode}`}
                      className="inline-flex rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-hover"
                    >
                      View Park
                    </Link>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>

      {mappableParks.length === 0 && (
        <p className="mt-3 text-sm text-muted">
          No parks on this page have valid coordinates to display on the map.
        </p>
      )}

      {skippedCount > 0 && mappableParks.length > 0 && (
        <p className="mt-3 text-sm text-muted">
          {skippedCount} {skippedCount === 1 ? 'park' : 'parks'} on this page{' '}
          {skippedCount === 1 ? 'was' : 'were'} hidden because coordinates are missing or invalid.
        </p>
      )}
    </div>
  )
}
