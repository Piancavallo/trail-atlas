import { NavLink } from 'react-router-dom'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import logo from '../../assets/logo.svg'

const navItems = [
  { to: '/', label: 'Home', end: true as const },
  { to: '/parks', label: 'Explore' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/plan', label: 'Plan' },
  { to: '/about', label: 'About' },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <NavLink
          to="/"
          className="flex items-center gap-2.5 font-display text-lg font-semibold text-foreground"
        >
          <img src={logo} alt="" className="size-8" aria-hidden="true" />
          <span>Trail Atlas</span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
