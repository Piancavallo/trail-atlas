import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ParkCard } from '../components/ParkCard/ParkCard'
import { ParkCardSkeleton } from '../components/ParkCard/ParkCardSkeleton'
import { FEATURED_PARK_CODES } from '../constants/parks'
import { useFavorites } from '../hooks/useFavorites'
import { useParksList } from '../hooks/useParks'
import { useTrip } from '../hooks/useTrip'
import { orderParksByCodes } from '../utils/park'

const inputClassName =
  'w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

export function HomePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const { favorites } = useFavorites()
  const { trip } = useTrip()

  const { data: statsData } = useParksList({ limit: 1 })
  const totalParks = statsData ? Number.parseInt(statsData.total, 10) : null

  const { data: featuredData, isLoading: featuredLoading } = useParksList({
    parkCode: FEATURED_PARK_CODES.join(','),
    limit: FEATURED_PARK_CODES.length,
    fields: 'images',
  })

  const featuredParks = orderParksByCodes(
    featuredData?.data ?? [],
    [...FEATURED_PARK_CODES],
  )

  const { data: favoritesData, isLoading: favoritesLoading } = useParksList(
    {
      parkCode: favorites.join(','),
      limit: Math.max(favorites.length, 1),
      fields: 'images',
    },
    { enabled: favorites.length > 0 },
  )

  const favoriteParks = orderParksByCodes(favoritesData?.data ?? [], favorites).slice(
    0,
    4,
  )

  const handleSearch = (event: FormEvent) => {
    event.preventDefault()
    const query = searchQuery.trim()
    navigate(query ? `/parks?q=${encodeURIComponent(query)}` : '/parks')
  }

  return (
    <>
      <section className="border-b border-border bg-linear-to-br from-primary/10 via-surface to-accent/10">
        <div className="container-app section-padding">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              National Parks Explorer
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
              Discover America&apos;s Wild Places
            </h1>
            <p className="mt-4 text-lg text-muted">
              Explore parks, save favorites, plan trips, and browse an interactive map — all
              powered by National Park Service data.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="home-search" className="sr-only">
                Search parks
              </label>
              <input
                id="home-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by park name…"
                className={inputClassName}
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                Explore parks
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="container-app section-padding">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="surface-card text-center">
            <p className="text-sm text-muted">Parks &amp; sites</p>
            <p className="mt-1 font-display text-3xl font-semibold text-foreground">
              {totalParks ?? '—'}
            </p>
          </div>
          <div className="surface-card text-center">
            <p className="text-sm text-muted">Your favorites</p>
            <p className="mt-1 font-display text-3xl font-semibold text-foreground">
              {favorites.length}
            </p>
          </div>
          <div className="surface-card text-center">
            <p className="text-sm text-muted">Trip stops</p>
            <p className="mt-1 font-display text-3xl font-semibold text-foreground">
              {trip.length}
            </p>
          </div>
        </div>
      </section>

      <section className="container-app pb-12 md:pb-16 lg:pb-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Featured parks
            </h2>
            <p className="mt-2 text-muted">Iconic destinations to inspire your next adventure.</p>
          </div>
          <Link to="/parks" className="link hidden text-sm sm:inline">
            View all →
          </Link>
        </div>

        {featuredLoading ? (
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {FEATURED_PARK_CODES.map((code) => (
              <li key={code}>
                <ParkCardSkeleton />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredParks.map((park) => (
              <li key={park.parkCode} className="h-full">
                <ParkCard park={park} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {favorites.length > 0 && (
        <section className="border-t border-border bg-card/50">
          <div className="container-app section-padding">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                  Your favorites
                </h2>
                <p className="mt-2 text-muted">Parks you&apos;ve saved for later.</p>
              </div>
              <Link to="/favorites" className="link text-sm">
                View all →
              </Link>
            </div>

            {favoritesLoading ? (
              <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favorites.slice(0, 4).map((code) => (
                  <li key={code}>
                    <ParkCardSkeleton />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favoriteParks.map((park) => (
                  <li key={park.parkCode} className="h-full">
                    <ParkCard park={park} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </>
  )
}
