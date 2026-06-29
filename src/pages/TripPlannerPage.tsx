import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { ParkCardFallbackImage } from '../components/ParkCard/ParkCardFallbackImage'
import { ParkCardSkeleton } from '../components/ParkCard/ParkCardSkeleton'
import { ParkImage } from '../components/ParkImage/ParkImage'
import { useParksList } from '../hooks/useParks'
import { useTrip } from '../hooks/useTrip'
import { getErrorMessage } from '../utils/errors'
import {
  estimateTripEntranceFees,
  getTripStates,
  orderParksByTrip,
} from '../utils/trip'
import { formatParkStates, getParkImageAlt, getParkPrimaryImage } from '../utils/park'

function ClearTripDialog({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-trip-title"
    >
      <div className="surface-card w-full max-w-md">
        <h2 id="clear-trip-title" className="font-display text-xl font-semibold text-foreground">
          Clear entire trip?
        </h2>
        <p className="mt-3 text-sm text-muted">
          This removes all parks from your itinerary. This action cannot be undone.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Clear trip
          </button>
        </div>
      </div>
    </div>
  )
}

export function TripPlannerPage() {
  const { trip, removeFromTrip, moveUp, moveDown, clearTrip } = useTrip()
  const [showClearDialog, setShowClearDialog] = useState(false)

  const parkCodeParam = trip.length > 0 ? trip.join(',') : undefined

  const { data, isLoading, isError, error, refetch, isFetching } = useParksList(
    {
      parkCode: parkCodeParam,
      limit: Math.max(trip.length, 1),
      fields: 'images,entranceFees',
    },
    { enabled: trip.length > 0 },
  )

  const orderedParks = useMemo(
    () => orderParksByTrip(data?.data ?? [], trip),
    [data?.data, trip],
  )

  const tripStates = useMemo(() => getTripStates(orderedParks), [orderedParks])
  const estimatedFees = useMemo(() => estimateTripEntranceFees(orderedParks), [orderedParks])

  const handleClearTrip = () => {
    clearTrip()
    setShowClearDialog(false)
  }

  if (trip.length === 0) {
    return (
      <section className="container-app section-padding">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Trip Planner
        </h1>
        <div className="surface-card mt-8 max-w-xl text-center transition-opacity duration-300">
          <p className="font-medium text-foreground">Your trip is empty</p>
          <p className="mt-2 text-sm text-muted">
            Add parks from Explore or a park detail page to start building your itinerary.
          </p>
          <Link
            to="/parks"
            className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Explore parks
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="container-app section-padding">
      <ClearTripDialog
        open={showClearDialog}
        onConfirm={handleClearTrip}
        onCancel={() => setShowClearDialog(false)}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Trip Planner
          </h1>
          <p className="mt-3 text-muted">Your custom National Parks itinerary.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowClearDialog(true)}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-red-400 hover:text-red-600 dark:hover:text-red-400"
        >
          Clear trip
        </button>
      </div>

      <aside className="surface-card mt-8 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-muted">Total parks</p>
          <p className="mt-1 font-display text-2xl font-semibold text-foreground">{trip.length}</p>
        </div>
        <div>
          <p className="text-sm text-muted">States</p>
          <p className="mt-1 font-display text-2xl font-semibold text-foreground">
            {tripStates.length > 0 ? tripStates.join(', ') : '—'}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted">Est. entrance fees</p>
          <p className="mt-1 font-display text-2xl font-semibold text-foreground">
            {estimatedFees !== null ? `$${estimatedFees.toFixed(2)}` : 'Unavailable'}
          </p>
          {estimatedFees !== null && (
            <p className="mt-1 text-xs text-muted">Based on available NPS fee data</p>
          )}
        </div>
      </aside>

      {isLoading && (
        <div className="mt-8 space-y-4" aria-busy="true" aria-label="Loading trip">
          {trip.map((code) => (
            <ParkCardSkeleton key={code} />
          ))}
        </div>
      )}

      {isError && (
        <div className="surface-card mt-8 max-w-lg" role="alert">
          <p className="font-medium text-foreground">Unable to load trip parks</p>
          <p className="mt-2 text-sm text-muted">{getErrorMessage(error)}</p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {isFetching ? 'Retrying…' : 'Try again'}
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <ol
          className={`mt-8 space-y-4 transition-opacity duration-300 ${
            isFetching ? 'opacity-70' : 'opacity-100'
          }`}
        >
          {orderedParks.map((park, index) => {
            const primaryImage = getParkPrimaryImage(park)

            return (
              <li
                key={park.parkCode}
                className="surface-card flex flex-col gap-4 overflow-hidden p-0 transition-all duration-300 sm:flex-row"
              >
                <div className="sm:w-48 md:w-56 shrink-0 overflow-hidden">
                  {primaryImage ? (
                    <ParkImage
                      src={primaryImage.url}
                      alt={getParkImageAlt(primaryImage, park.fullName)}
                      parkName={park.fullName}
                      className="aspect-video w-full object-cover sm:aspect-square sm:h-full"
                    />
                  ) : (
                    <ParkCardFallbackImage parkName={park.fullName} />
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between gap-4 p-4 md:p-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-primary">
                      Stop {index + 1}
                    </p>
                    <Link
                      to={`/parks/${park.parkCode}`}
                      className="mt-1 font-display text-lg font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      {park.fullName}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
                      {formatParkStates(park.states)} · {park.designation}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveUp(park.parkCode)}
                      disabled={index === 0}
                      className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Move ${park.fullName} up`}
                    >
                      Move up
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(park.parkCode)}
                      disabled={index === orderedParks.length - 1}
                      className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Move ${park.fullName} down`}
                    >
                      Move down
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromTrip(park.parkCode)}
                      className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-red-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      )}

      {trip.length > orderedParks.length && !isLoading && !isError && (
        <p className="mt-4 text-sm text-muted">
          Some parks could not be loaded and may have been removed from the NPS catalog.
        </p>
      )}
    </section>
  )
}
