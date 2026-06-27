import { Outlet } from 'react-router-dom'
import { Navbar } from '../Navbar/Navbar'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-foreground">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-card py-8">
        <div className="container-app flex flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Trail Atlas</p>
          <p>
            Park data from the{' '}
            <a
              href="https://www.nps.gov/subjects/developer/"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              National Park Service API
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
