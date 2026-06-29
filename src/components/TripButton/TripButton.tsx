import { useTrip } from '../../hooks/useTrip'

interface TripButtonProps {
  parkCode: string
  parkName: string
  variant?: 'compact' | 'default'
  className?: string
}

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20'

export function TripButton({
  parkCode,
  parkName,
  variant = 'default',
  className = '',
}: TripButtonProps) {
  const { isInTrip, toggleTrip } = useTrip()
  const inTrip = isInTrip(parkCode)

  const label = inTrip ? 'Remove from Trip' : 'Add to Trip'

  const variantClass =
    variant === 'compact'
      ? `${baseClass} w-full px-3 py-2 text-xs ${
          inTrip
            ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/15'
            : 'border-border bg-card text-foreground hover:border-primary hover:text-primary'
        }`
      : `${baseClass} px-4 py-2 text-sm ${
          inTrip
            ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/15'
            : 'border-border bg-card text-foreground hover:border-primary hover:text-primary'
        }`

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleTrip(parkCode)
      }}
      className={`${variantClass} ${className}`}
      aria-label={`${label}: ${parkName}`}
      aria-pressed={inTrip}
    >
      <svg
        viewBox="0 0 24 24"
        className={variant === 'compact' ? 'size-4' : 'size-5'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden="true"
      >
        {inTrip ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
        )}
      </svg>
      {label}
    </button>
  )
}
