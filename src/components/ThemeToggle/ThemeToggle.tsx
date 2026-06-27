import { useTheme } from '../../hooks/useTheme'

const labels: Record<string, string> = {
  light: 'Switch to dark mode',
  dark: 'Switch to system theme',
  system: 'Switch to light mode',
}

export function ThemeToggle() {
  const { theme, resolvedTheme, cycleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="btn-icon"
      aria-label={labels[theme]}
      title={`Theme: ${theme} (${resolvedTheme})`}
    >
      {resolvedTheme === 'dark' ? (
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path
            strokeLinecap="round"
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          />
        </svg>
      )}
    </button>
  )
}
