export function ParkCardSkeleton() {
  return (
    <div className="surface-card animate-pulse overflow-hidden p-0" aria-hidden="true">
      <div className="aspect-video bg-border" />
      <div className="space-y-3 p-4 md:p-5">
        <div className="h-5 w-3/4 rounded bg-border" />
        <div className="h-4 w-1/2 rounded bg-border" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-border" />
          <div className="h-3 w-full rounded bg-border" />
          <div className="h-3 w-2/3 rounded bg-border" />
        </div>
      </div>
    </div>
  )
}
