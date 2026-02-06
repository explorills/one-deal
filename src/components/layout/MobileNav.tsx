import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  X,
  Home,
  Compass,
  BarChart3,
  Image,
  FolderOpen,
  Settings,
  Wallet,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { ROUTES } from '../../lib/constants'
import { Button } from '../ui/Button'
import { Avatar } from '../ui/Avatar'

interface MobileNavProps {
  open: boolean
  onClose: () => void
  walletConnected: boolean
  walletAddress: string
  onConnectWallet: () => void
  onDisconnectWallet: () => void
}

const NAV_LINKS = [
  { to: ROUTES.home, label: 'Home', icon: Home },
  { to: ROUTES.explore, label: 'Explore', icon: Compass },
  { to: ROUTES.rankings, label: 'Rankings', icon: BarChart3 },
  { to: ROUTES.create, label: 'Create NFT', icon: Image },
  { to: ROUTES.createCollection, label: 'Create Collection', icon: FolderOpen },
  { to: ROUTES.settings, label: 'Settings', icon: Settings },
]

export function MobileNav({
  open,
  onClose,
  walletConnected,
  walletAddress,
  onConnectWallet,
  onDisconnectWallet,
}: MobileNavProps) {
  const location = useLocation()
  const previousPathRef = useRef(location.pathname)

  // Close on route change
  useEffect(() => {
    if (previousPathRef.current !== location.pathname) {
      onClose()
    }
    previousPathRef.current = location.pathname
  }, [location.pathname, onClose])

  // Close on escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 transition-opacity duration-200 md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-72 overflow-y-auto md:hidden',
          'bg-white dark:bg-zinc-950',
          'border-l border-zinc-200 dark:border-zinc-800',
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
          <span className="font-bold text-zinc-900 dark:text-white">Menu</span>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wallet section */}
        <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
          {walletConnected ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar size="md" fallback="User" />
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Connected</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onDisconnectWallet}
                className="w-full"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={onConnectWallet}
              className="w-full gap-1.5"
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>

        {/* Nav links */}
        <div className="p-2">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
