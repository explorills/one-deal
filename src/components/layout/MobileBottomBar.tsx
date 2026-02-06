import { Link, useLocation } from 'react-router-dom'
import { Home, Compass, PlusCircle, BarChart3, User } from 'lucide-react'
import { cn } from '../../lib/utils'
import { ROUTES } from '../../lib/constants'

const TABS = [
  { to: ROUTES.home, label: 'Home', icon: Home },
  { to: ROUTES.explore, label: 'Explore', icon: Compass },
  { to: ROUTES.create, label: 'Create', icon: PlusCircle, highlight: true },
  { to: ROUTES.rankings, label: 'Rankings', icon: BarChart3 },
  { to: '/profile/me', label: 'Profile', icon: User },
]

export function MobileBottomBar() {
  const location = useLocation()

  return (
    <nav
      className={cn(
        'fixed right-0 bottom-0 left-0 z-40 md:hidden',
        'flex h-16 items-center justify-around',
        'border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950',
      )}
      aria-label="Bottom navigation"
    >
      {TABS.map(({ to, label, icon: Icon, highlight }) => {
        const active = location.pathname === to
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-medium transition-colors',
              active
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-zinc-400 dark:text-zinc-500',
              highlight && !active && 'text-brand-600 dark:text-brand-400',
            )}
            aria-label={label}
          >
            <Icon
              className={cn(
                'h-5 w-5',
                highlight && !active && 'text-brand-600 dark:text-brand-400',
              )}
            />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
