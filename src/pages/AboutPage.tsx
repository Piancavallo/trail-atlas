const GITHUB_URL = 'https://github.com/Piancavallo/trail-atlas'

const TECH_STACK = [
  'React + TypeScript',
  'Vite',
  'React Router',
  'TanStack Query',
  'Axios',
  'Tailwind CSS',
  'React Leaflet',
  'ESLint + Prettier',
]

const GOALS = [
  'Make National Park data approachable and enjoyable to explore',
  'Demonstrate modern frontend architecture with real API integration',
  'Support discovery through search, filters, maps, and trip planning',
  'Keep user data local with favorites and itineraries stored in the browser',
]

export function AboutPage() {
  return (
    <section className="container-app section-padding">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">About</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
          Trail Atlas
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Trail Atlas is a portfolio web application for discovering and planning adventures
          across America&apos;s National Parks. Browse hundreds of parks, monuments, and historic
          sites, save favorites, build a trip itinerary, and explore locations on an interactive
          map — all powered by official National Park Service data.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section className="surface-card">
          <h2 className="font-display text-xl font-semibold text-foreground">Project goals</h2>
          <ul className="mt-4 space-y-3">
            {GOALS.map((goal) => (
              <li key={goal} className="flex gap-3 text-sm leading-relaxed text-muted">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {goal}
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-card">
          <h2 className="font-display text-xl font-semibold text-foreground">Technologies</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {TECH_STACK.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="surface-card mt-8 max-w-3xl">
        <h2 className="font-display text-xl font-semibold text-foreground">
          National Park Service API
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Park data, images, activities, fees, and operating hours are provided by the{' '}
          <a
            href="https://www.nps.gov/subjects/developer/"
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            National Park Service Developer API
          </a>
          . Trail Atlas is an independent project and is not affiliated with or endorsed by the
          National Park Service.
        </p>
      </section>

      <section className="mt-8">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          View source on GitHub →
        </a>
      </section>
    </section>
  )
}
