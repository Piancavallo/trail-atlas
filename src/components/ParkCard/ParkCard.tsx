import { Link } from 'react-router-dom'
import { FavoriteButton } from '../FavoriteButton/FavoriteButton'
import { TripButton } from '../TripButton/TripButton'
import { ParkImage } from '../ParkImage/ParkImage'
import type { Park } from '../../types/nps'
import { truncateText } from '../../utils/text'
import { formatParkStates, getParkImageAlt, getParkPrimaryImage } from '../../utils/park'
import { ParkCardFallbackImage } from './ParkCardFallbackImage'

interface ParkCardProps {
  park: Park
}

export function ParkCard({ park }: ParkCardProps) {
  const primaryImage = getParkPrimaryImage(park)

  return (
    <article className="group surface-card relative flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton parkCode={park.parkCode} parkName={park.fullName} />
      </div>

      <Link to={`/parks/${park.parkCode}`} className="flex flex-1 flex-col">
        <div className="overflow-hidden">
          {primaryImage ? (
            <ParkImage
              src={primaryImage.url}
              alt={getParkImageAlt(primaryImage, park.fullName)}
              parkName={park.fullName}
              className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <ParkCardFallbackImage parkName={park.fullName} />
          )}
        </div>

        <div className="flex flex-1 flex-col p-4 md:p-5">
          <h2 className="pr-10 font-display text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
            {park.fullName}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {formatParkStates(park.states)} · {park.designation}
          </p>
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
            {truncateText(park.description, 150)}
          </p>
        </div>
      </Link>

      <div className="border-t border-border px-4 py-3 md:px-5">
        <TripButton parkCode={park.parkCode} parkName={park.fullName} variant="compact" />
      </div>
    </article>
  )
}
