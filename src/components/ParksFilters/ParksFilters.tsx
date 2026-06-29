import { PARK_DESIGNATIONS, PARK_STATE_CODES } from '../../constants/parks'

interface ParksFiltersProps {
  search: string
  stateCode: string
  designation: string
  onSearchChange: (value: string) => void
  onStateChange: (value: string) => void
  onDesignationChange: (value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

const selectClassName =
  'rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

const inputClassName =
  'w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

export function ParksFilters({
  search,
  stateCode,
  designation,
  onSearchChange,
  onStateChange,
  onDesignationChange,
  onClearFilters,
  hasActiveFilters,
}: ParksFiltersProps) {
  return (
    <div className="mt-8 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
          <span className="text-sm font-medium text-foreground">Search parks</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name…"
            className={inputClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">State</span>
          <select
            value={stateCode}
            onChange={(event) => onStateChange(event.target.value)}
            className={selectClassName}
          >
            <option value="">All states</option>
            {PARK_STATE_CODES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">Designation</span>
          <select
            value={designation}
            onChange={(event) => onDesignationChange(event.target.value)}
            className={selectClassName}
          >
            <option value="">All designations</option>
            {PARK_DESIGNATIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="text-sm font-medium text-primary hover:text-primary-hover"
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}
