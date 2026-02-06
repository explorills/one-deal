import { useState, useRef, useEffect } from 'react'
import { Search, X, Clock } from 'lucide-react'
import { cn } from '../../lib/utils'

export type SearchCategory = 'all' | 'nfts' | 'collections' | 'users'

export interface SearchBarProps {
  onSearch?: (query: string, category: SearchCategory) => void
  placeholder?: string
  className?: string
}

const categories: { id: SearchCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'nfts', label: 'NFTs' },
  { id: 'collections', label: 'Collections' },
  { id: 'users', label: 'Users' },
]

function SearchBar({ onSearch, placeholder = 'Search NFTs, collections, and users...', className }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<SearchCategory>('all')
  const [open, setOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('one-deal-recent-searches') || '[]')
    } catch {
      return []
    }
  })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSubmit(q: string = query) {
    const trimmed = q.trim()
    if (!trimmed) return
    onSearch?.(trimmed, category)
    setOpen(false)

    const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 5)
    setRecentSearches(updated)
    try {
      localStorage.setItem('one-deal-recent-searches', JSON.stringify(updated))
    } catch { /* ignore */ }
  }

  function clearRecent() {
    setRecentSearches([])
    try {
      localStorage.removeItem('one-deal-recent-searches')
    } catch { /* ignore */ }
  }

  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      {/* Input row */}
      <div
        className={cn(
          'flex items-center gap-2 rounded-xl border px-3',
          'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800',
          'transition-colors duration-150',
          open && 'border-brand-500 ring-2 ring-brand-500/20 dark:border-brand-500',
        )}
      >
        <Search className="h-4 w-4 shrink-0 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder={placeholder}
          className="h-10 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-zinc-400 transition-colors duration-150 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className={cn(
            'absolute inset-x-0 top-full z-50 mt-1 overflow-hidden rounded-xl border shadow-lg',
            'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800',
          )}
        >
          {/* Category filter */}
          <div className="flex gap-1 border-b border-zinc-100 px-3 py-2 dark:border-zinc-800">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150',
                  category === cat.id
                    ? 'bg-brand-600 text-white'
                    : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800',
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="px-3 py-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Recent</span>
                <button
                  onClick={clearRecent}
                  className="text-xs text-zinc-400 transition-colors duration-150 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map(search => (
                <button
                  key={search}
                  onClick={() => {
                    setQuery(search)
                    handleSubmit(search)
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-700 transition-colors duration-150 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  {search}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export { SearchBar }
