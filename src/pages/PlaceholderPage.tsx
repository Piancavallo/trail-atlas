export function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="container-app section-padding">
      <div className="surface-card max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Phase 1
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-muted">
          Foundation scaffold is in place. Page content and API integration arrive in
          the next phase.
        </p>
      </div>
    </section>
  )
}
