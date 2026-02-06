import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  Menu,
  Sun,
  Moon,
  Bell,
  Wallet,
  Plus,
  Image,
  FolderOpen,
  X,
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'
import { ROUTES } from '../../lib/constants'
import { Button } from '../ui/Button'
import { Avatar } from '../ui/Avatar'
import { Dropdown } from '../ui/Dropdown'
import { MobileNav } from './MobileNav'

const MOCK_WALLET = {
  connected: false,
  address: '0x1234567890abcdef1234567890abcdef12345678',
}

export function Header() {
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [walletConnected, setWalletConnected] = useState(MOCK_WALLET.connected)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const handleCreateSelect = useCallback(
    (id: string) => {
      if (id === 'nft') navigate(ROUTES.create)
      if (id === 'collection') navigate(ROUTES.createCollection)
    },
    [navigate],
  )

  return (
    <>
      <header
        className={cn(
          'fixed top-0 right-0 left-0 z-40 h-14 md:h-16',
          'flex items-center px-4 md:px-6',
          'transition-[background-color,box-shadow,backdrop-filter] duration-200',
          scrolled
            ? 'bg-white/80 shadow-sm backdrop-blur-lg dark:bg-zinc-950/80'
            : 'bg-white dark:bg-zinc-950',
        )}
      >
        {/* Left: Logo */}
        <Link
          to={ROUTES.home}
          className={cn(
            'mr-4 flex shrink-0 items-center gap-2 font-bold text-lg',
            'text-zinc-900 dark:text-white',
            searchExpanded && 'hidden md:flex',
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-extrabold text-white">
            O
          </div>
          <span className="hidden sm:inline">ONE Deal</span>
        </Link>

        {/* Center: Search */}
        <div
          className={cn(
            'relative flex-1 transition-all duration-200',
            searchExpanded ? 'flex' : 'hidden md:flex',
            'max-w-xl mx-auto',
          )}
        >
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search NFTs, collections, creators..."
              className={cn(
                'h-9 md:h-10 w-full rounded-full border pl-10 pr-4 text-sm',
                'bg-zinc-100 border-zinc-200 text-zinc-900 placeholder:text-zinc-400',
                'dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500',
                'transition-colors duration-150 focus-ring',
              )}
            />
          </div>
          {/* Mobile close search */}
          <button
            onClick={() => setSearchExpanded(false)}
            className="ml-2 flex shrink-0 items-center md:hidden text-zinc-500 dark:text-zinc-400"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Right: Desktop Nav */}
        <nav
          className={cn(
            'ml-4 items-center gap-1',
            'hidden md:flex',
          )}
        >
          <Link
            to={ROUTES.explore}
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            Explore
          </Link>
          <Link
            to={ROUTES.rankings}
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            Rankings
          </Link>
          <Dropdown
            trigger={
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Create
              </Button>
            }
            items={[
              { id: 'nft', label: 'NFT', icon: <Image className="h-4 w-4" /> },
              { id: 'collection', label: 'Collection', icon: <FolderOpen className="h-4 w-4" /> },
            ]}
            onSelect={handleCreateSelect}
            align="right"
          />
        </nav>

        {/* Right: Actions */}
        <div className={cn('ml-2 flex items-center gap-1', searchExpanded && 'hidden md:flex')}>
          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchExpanded(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-600" />
          </button>

          {/* Wallet */}
          <div className="hidden md:block">
            {walletConnected ? (
              <button
                onClick={() => setWalletConnected(false)}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
              >
                <Avatar size="sm" fallback="U" className="h-6 w-6 text-[10px]" />
                <span className="text-zinc-900 dark:text-zinc-100">
                  {MOCK_WALLET.address.slice(0, 6)}...{MOCK_WALLET.address.slice(-4)}
                </span>
              </button>
            ) : (
              <Button
                size="sm"
                onClick={() => setWalletConnected(true)}
                className="gap-1.5"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      <MobileNav
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        walletConnected={walletConnected}
        walletAddress={MOCK_WALLET.address}
        onConnectWallet={() => setWalletConnected(true)}
        onDisconnectWallet={() => setWalletConnected(false)}
      />
    </>
  )
}
