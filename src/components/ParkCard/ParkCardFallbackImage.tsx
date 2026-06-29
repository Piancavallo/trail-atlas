export function ParkCardFallbackImage({ parkName }: { parkName: string }) {
  return (
    <div
      className="flex aspect-video w-full items-center justify-center bg-linear-to-br from-primary/20 to-accent/20"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 64 64"
        className="size-16 text-primary/40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 44 L32 18 L52 44 Z" strokeLinejoin="round" />
        <path d="M20 44 L32 28 L44 44 Z" strokeLinejoin="round" opacity="0.5" />
        <circle cx="46" cy="20" r="4" fill="currentColor" stroke="none" opacity="0.6" />
      </svg>
      <span className="sr-only">No image available for {parkName}</span>
    </div>
  )
}
