import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { ParkCard } from '../components/ParkCard/ParkCard'
import { ParkCardSkeleton } from '../components/ParkCard/ParkCardSkeleton'
import { useFavorites } from '../hooks/useFavorites'
import { useParksList } from '../hooks/useParks'
import { getErrorMessage } from '../utils/errors'
import { orderParksByCodes } from '../utils/park'

export function FavoritesPage() {
  const { favorites } = useFavorites()

  const { data, isLoading, isError, error, refetch, isFetching } = useParksList(
    {
      parkCode: favorites.join(','),
      limit: Math.max(favorites.length, 1),
      fields: 'images',
    },
    { enabled: favorites.length > 0 },
  )

  const favoriteParks = useMemo(
    () => orderParksByCodes(data?.data ?? [], favorites),
    [data?.data, favorites],
  )

  if (favorites.length === 0) {
    return (
      <section className="container-app section-padding">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Your Favorites
        </h1>
        <div className="surface-card mt-8 max-w-xl text-center">
          <p className="font-medium text-foreground">No favorites yet</p>
          <p className="mt-2 text-sm text-muted">
            Tap the heart on any park card or detail page to save parks here.
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
      <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
        Your Favorites
      </h1>
      <p className="mt-3 text-muted">
        {favorites.length} {favorites.length === 1 ? 'park' : 'parks'} saved.
      </p>

      {isLoading && (
        <ul
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          aria-busy="true"
          aria-label="Loading favorites"
        >
          {favorites.map((code) => (
            <li key={code}>
              <ParkCardSkeleton />
            </li>
          ))}
        </ul>
      )}

      {isError && (
        <div className="surface-card mt-8 max-w-lg" role="alert">
          <p className="font-medium text-foreground">Unable to load favorites</p>
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
        <ul
          className={`mt-8 grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
            isFetching ? 'opacity-70' : 'opacity-100'
          }`}
        >
          {favoriteParks.map((park) => (
            <li key={park.parkCode} className="h-full">
              <ParkCard park={park} />
            </li>
          ))}
        </ul>
      )}

      {favorites.length > favoriteParks.length && !isLoading && !isError && (
        <p className="mt-4 text-sm text-muted">
          Some saved parks could not be loaded and may no longer be available.
        </p>
      )}
    </section>
  )
}
