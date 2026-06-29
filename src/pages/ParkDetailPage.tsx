import { Link, useParams } from 'react-router-dom'
import { FavoriteButton } from '../components/FavoriteButton/FavoriteButton'
import { ParkCardFallbackImage } from '../components/ParkCard/ParkCardFallbackImage'
import { ParkCardSkeleton } from '../components/ParkCard/ParkCardSkeleton'
import { ParkImage } from '../components/ParkImage/ParkImage'
import { useParksList } from '../hooks/useParks'
import type { EntranceFee, OperatingHours } from '../types/nps'
import { getErrorMessage } from '../utils/errors'
import { formatParkStates, getParkImageAlt } from '../utils/park'

const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

function formatWeekday(day: string): string {
  return day.charAt(0).toUpperCase() + day.slice(1)
}

function ParkFeesSection({ fees }: { fees: EntranceFee[] }) {
  return (
    <section className="surface-card mt-10 max-w-4xl">
      <h2 className="font-display text-xl font-semibold text-foreground">Entrance fees</h2>
      <ul className="mt-4 space-y-4">
        {fees.map((fee) => (
          <li key={`${fee.title}-${fee.cost}`} className="border-b border-border pb-4 last:border-0 last:pb-0">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-medium text-foreground">{fee.title}</h3>
              <p className="text-sm font-semibold text-primary">
                {fee.cost === '0.00' ? 'Free' : `$${fee.cost}`}
              </p>
            </div>
            {fee.description && <p className="mt-2 text-sm leading-relaxed text-muted">{fee.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}

function ParkHoursSection({ hours }: { hours: OperatingHours[] }) {
  return (
    <section className="surface-card mt-10 max-w-4xl">
      <h2 className="font-display text-xl font-semibold text-foreground">Operating hours</h2>
      <div className="mt-4 space-y-6">
        {hours.map((entry) => (
          <div key={entry.name}>
            <h3 className="font-medium text-foreground">{entry.name}</h3>
            {entry.description && (
              <p className="mt-1 text-sm text-muted">{entry.description}</p>
            )}
            <dl className="mt-3 grid gap-2 sm:grid-cols-2">
              {WEEKDAYS.map((day) => (
                <div
                  key={`${entry.name}-${day}`}
                  className="flex justify-between gap-4 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                >
                  <dt className="font-medium text-foreground">{formatWeekday(day)}</dt>
                  <dd className="text-muted">{entry.standardHours[day] ?? 'Closed'}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ParkDetailPage() {
  const { code } = useParams<{ code: string }>()

  const { data, isLoading, isError, error, refetch, isFetching } = useParksList({
    parkCode: code,
    fields: 'images,activities,entranceFees,operatingHours',
  })

  const park = data?.data[0]

  if (isLoading) {
    return (
      <section className="container-app section-padding">
        <div className="max-w-4xl">
          <div className="mb-6 h-4 w-32 animate-pulse rounded bg-border" />
          <ParkCardSkeleton />
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="container-app section-padding">
        <Link to="/parks" className="link text-sm">
          ← Back to parks
        </Link>
        <div className="surface-card mt-6 max-w-lg" role="alert">
          <p className="font-medium text-foreground">Unable to load park</p>
          <p className="mt-2 text-sm text-muted">
            {getErrorMessage(error, 'Failed to load park details.')}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {isFetching ? 'Retrying…' : 'Try again'}
          </button>
        </div>
      </section>
    )
  }

  if (!park) {
    return (
      <section className="container-app section-padding">
        <Link to="/parks" className="link text-sm">
          ← Back to parks
        </Link>
        <div className="surface-card mt-6 max-w-lg text-center">
          <p className="font-medium text-foreground">Park not found</p>
          <p className="mt-2 text-sm text-muted">
            We couldn&apos;t find a park with code &ldquo;{code}&rdquo;.
          </p>
        </div>
      </section>
    )
  }

  const images = park.images ?? []
  const activities = park.activities ?? []
  const entranceFees = park.entranceFees ?? []
  const operatingHours = park.operatingHours ?? []

  return (
    <article className="container-app section-padding">
      <Link to="/parks" className="link text-sm">
        ← Back to parks
      </Link>

      <header className="mt-6 flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            {park.designation}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            {park.fullName}
          </h1>
          <p className="mt-3 text-muted">{formatParkStates(park.states)}</p>
        </div>
        <FavoriteButton parkCode={park.parkCode} parkName={park.fullName} />
      </header>

      <section className="mt-10 max-w-5xl" aria-label="Park photos">
        {images.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {images.map((image, index) => (
              <li
                key={`${image.url}-${index}`}
                className={`overflow-hidden rounded-2xl border border-border bg-card ${
                  index === 0 ? 'sm:col-span-2' : ''
                }`}
              >
                <ParkImage
                  src={image.url}
                  alt={getParkImageAlt(image, park.fullName)}
                  parkName={park.fullName}
                  priority={index === 0}
                  className={`w-full object-cover ${
                    index === 0 ? 'aspect-2/1 max-h-[28rem]' : 'aspect-video'
                  }`}
                />
                {(image.caption || image.credit) && (
                  <p className="px-4 py-3 text-xs leading-relaxed text-muted">
                    {image.caption}
                    {image.caption && image.credit ? ' · ' : ''}
                    {image.credit}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border">
            <ParkCardFallbackImage parkName={park.fullName} />
          </div>
        )}
      </section>

      <section className="surface-card mt-10 max-w-3xl">
        <h2 className="font-display text-xl font-semibold text-foreground">About</h2>
        <p className="mt-4 leading-relaxed text-muted">{park.description}</p>
      </section>

      {activities.length > 0 && (
        <section className="surface-card mt-10 max-w-4xl">
          <h2 className="font-display text-xl font-semibold text-foreground">Activities</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {activities.map((activity) => (
              <li
                key={activity.id}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
              >
                {activity.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {entranceFees.length > 0 && <ParkFeesSection fees={entranceFees} />}

      {operatingHours.length > 0 && <ParkHoursSection hours={operatingHours} />}

      {park.url && (
        <p className="mt-10">
          <a href={park.url} target="_blank" rel="noreferrer" className="link text-sm">
            Visit on NPS.gov →
          </a>
        </p>
      )}
    </article>
  )
}
