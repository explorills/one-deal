import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '../../lib/utils'

function pathToLabel(segment: string): string {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function Breadcrumbs({ className }: { className?: string }) {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)

  // Don't render on the home page
  if (pathSegments.length === 0) return null

  const crumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/')
    const isLast = index === pathSegments.length - 1
    const label = pathToLabel(segment)

    return { path, label, isLast }
  })

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'flex items-center gap-1.5 text-sm',
        className,
      )}
    >
      <Link
        to="/"
        className="flex items-center text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {crumbs.map(({ path, label, isLast }) => (
        <span key={path} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600" />
          {isLast ? (
            <span className="font-medium text-zinc-700 dark:text-zinc-200">
              {label}
            </span>
          ) : (
            <Link
              to={path}
              className="text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              {label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
