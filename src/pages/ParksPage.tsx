import { useEffect, useMemo, useState } from 'react'
import { Pagination } from '../components/Pagination/Pagination'
import { ParkCard } from '../components/ParkCard/ParkCard'
import { ParkCardSkeleton } from '../components/ParkCard/ParkCardSkeleton'
import { ParkMap } from '../components/ParkMap/ParkMap'
import { ParksFilters } from '../components/ParksFilters/ParksFilters'
import { ParksViewToggle, type ParksViewMode } from '../components/ParksViewToggle/ParksViewToggle'
import { PARKS_PAGE_SIZE } from '../constants/parks'
import { useFilterPagination } from '../hooks/useFilterPagination'
import { useParksList } from '../hooks/useParks'
import { getErrorMessage } from '../utils/errors'

const SKELETON_COUNT = PARKS_PAGE_SIZE

function buildApiQuery(search: string, designation: string): string | undefined {
  const parts = [search.trim(), designation].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : undefined
}

export function ParksPage() {
  const [view, setView] = useState<ParksViewMode>('grid')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [stateCode, setStateCode] = useState('')
  const [designation, setDesignation] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  const filterKey = `${debouncedSearch}|${stateCode}|${designation}`
  const { page, setPage, resetPagination } = useFilterPagination(filterKey)

  const apiQuery = useMemo(
    () => buildApiQuery(debouncedSearch, designation),
    [debouncedSearch, designation],
  )

  const start = (page - 1) * PARKS_PAGE_SIZE + 1

  const { data, isLoading, isError, error, refetch, isFetching } = useParksList({
    limit: PARKS_PAGE_SIZE,
    start,
    fields: 'images',
    q: apiQuery,
    stateCode: stateCode || undefined,
  })

  const parks = useMemo(() => data?.data ?? [], [data?.data])

  const visibleParks = useMemo(() => {
    if (!designation) return parks
    return parks.filter((park) => park.designation === designation)
  }, [parks, designation])

  const total = data ? Number.parseInt(data.total, 10) : 0
  const totalPages = Math.max(1, Math.ceil(total / PARKS_PAGE_SIZE))
  const rangeStart = total === 0 ? 0 : start
  const rangeEnd = total === 0 ? 0 : Math.min(start + parks.length - 1, total)

  const hasActiveFilters = Boolean(search || stateCode || designation)

  const clearFilters = () => {
    setSearch('')
    setDebouncedSearch('')
    setStateCode('')
    setDesignation('')
    resetPagination()
  }

  return (
    <section className="container-app section-padding">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Explore Parks
          </h1>
          <p className="mt-3 text-muted">
            Browse America&apos;s national parks, monuments, and historic sites.
          </p>
        </div>
        <ParksViewToggle view={view} onViewChange={setView} />
      </div>

      <ParksFilters
        search={search}
        stateCode={stateCode}
        designation={designation}
        onSearchChange={setSearch}
        onStateChange={setStateCode}
        onDesignationChange={setDesignation}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {isLoading && view === 'grid' && (
        <div
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          aria-busy="true"
          aria-label="Loading parks"
        >
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <ParkCardSkeleton key={index} />
          ))}
        </div>
      )}

      {isLoading && view === 'map' && (
        <div
          className="surface-card mt-8 flex h-[32rem] animate-pulse items-center justify-center lg:h-[36rem]"
          aria-busy="true"
          aria-label="Loading map"
        >
          <p className="text-sm text-muted">Loading map…</p>
        </div>
      )}

      {isError && (
        <div className="surface-card mt-8 max-w-lg" role="alert">
          <p className="font-medium text-foreground">Unable to load parks</p>
          <p className="mt-2 text-sm text-muted">
            {getErrorMessage(error, 'Failed to load parks.')}
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
      )}

      {!isLoading && !isError && visibleParks.length === 0 && (
        <div className="surface-card mt-8 max-w-xl text-center">
          <p className="font-medium text-foreground">No parks match your filters</p>
          <p className="mt-2 text-sm text-muted">
            {hasActiveFilters
              ? 'Try a broader search, remove the state or designation filter, or check the next page if you are browsing a specific designation.'
              : 'No parks were returned for this page. Try going back a page or refreshing.'}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {!isLoading && !isError && visibleParks.length > 0 && (
        <>
          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              {total > 0
                ? `Showing ${rangeStart}–${rangeEnd} of ${total} parks`
                : `Showing ${visibleParks.length} parks`}
            </p>
            {isFetching && (
              <p className="text-sm text-primary" aria-live="polite">
                Updating results…
              </p>
            )}
          </div>

          {view === 'grid' ? (
            <ul
              className={`mt-4 grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
                isFetching ? 'opacity-70' : 'opacity-100'
              }`}
            >
              {visibleParks.map((park) => (
                <li key={park.parkCode} className="h-full">
                  <ParkCard park={park} />
                </li>
              ))}
            </ul>
          ) : (
            <div
              className={`surface-card mt-4 h-[32rem] p-3 transition-opacity lg:h-[36rem] lg:p-4 ${
                isFetching ? 'opacity-70' : 'opacity-100'
              }`}
            >
              <ParkMap parks={visibleParks} />
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            disabled={isFetching}
          />
        </>
      )}
    </section>
  )
}
