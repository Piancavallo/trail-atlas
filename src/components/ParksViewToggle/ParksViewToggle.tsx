export type ParksViewMode = 'grid' | 'map'

interface ParksViewToggleProps {
  view: ParksViewMode
  onViewChange: (view: ParksViewMode) => void
}

const buttonBase =
  'rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20'

export function ParksViewToggle({ view, onViewChange }: ParksViewToggleProps) {
  return (
    <div
      className="inline-flex rounded-xl border border-border bg-card p-1"
      role="group"
      aria-label="Parks view mode"
    >
      <button
        type="button"
        onClick={() => onViewChange('grid')}
        aria-pressed={view === 'grid'}
        className={`${buttonBase} ${
          view === 'grid'
            ? 'bg-primary text-white'
            : 'text-muted hover:text-foreground'
        }`}
      >
        Grid
      </button>
      <button
        type="button"
        onClick={() => onViewChange('map')}
        aria-pressed={view === 'map'}
        className={`${buttonBase} ${
          view === 'map'
            ? 'bg-primary text-white'
            : 'text-muted hover:text-foreground'
        }`}
      >
        Map
      </button>
    </div>
  )
}
