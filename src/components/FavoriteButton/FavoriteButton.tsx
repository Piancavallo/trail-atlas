import { useFavorites } from '../../hooks/useFavorites'

interface FavoriteButtonProps {
  parkCode: string
  parkName: string
  className?: string
}

export function FavoriteButton({ parkCode, parkName, className = '' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(parkCode)

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleFavorite(parkCode)
      }}
      className={`inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card/95 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-primary hover:text-primary ${className}`}
      aria-label={
        favorited ? `Remove ${parkName} from favorites` : `Add ${parkName} to favorites`
      }
      aria-pressed={favorited}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill={favorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
    </button>
  )
}
