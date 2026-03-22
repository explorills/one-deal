import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlass, FunnelSimple } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { NetworkBadge } from '@/components/ui/NetworkBadge'
import { getOptimizedImageUrl } from '@/lib/api'
import { Skeleton } from '@/components/ui/Skeleton'
import { fetchCollections } from '@/lib/api'
import type { ApiCollection } from '@/lib/api'

const CHAIN_FILTERS = [
  { value: 'all', label: 'All Networks' },
  { value: 'flare', label: 'Flare' },
  { value: 'songbird', label: 'Songbird' },
]

export default function Explore() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [chainFilter, setChainFilter] = useState('all')
  const [collections, setCollections] = useState<ApiCollection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const chain = chainFilter === 'all' ? undefined : chainFilter
    const search = query.trim() || undefined
    fetchCollections(chain, search)
      .then(setCollections)
      .catch(() => setCollections([]))
      .finally(() => setLoading(false))
  }, [chainFilter, query])

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Explore</h1>
      <p className="text-sm text-muted-foreground mb-6">Browse collections across Flare and Songbird</p>

      {/* Search */}
      <div className="relative mb-6">
        <MagnifyingGlass size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search collections..."
          className="w-full bg-transparent border-b border-border pl-7 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Network filter chips */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {CHAIN_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setChainFilter(f.value)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              chainFilter === f.value
                ? 'bg-primary text-primary-foreground shadow-[0_0_12px_oklch(0.72_0.17_195/0.3)]'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs text-muted-foreground font-mono">
          {loading ? '...' : `${collections.length} collection${collections.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Collections grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-4 space-y-3">
              <Skeleton className="w-14 h-14 rounded-lg" />
              <Skeleton className="w-32 h-5" />
              <Skeleton className="w-full h-3" />
              <div className="flex gap-4">
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-16 h-4" />
              </div>
            </div>
          ))}
        </div>
      ) : collections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col, i) => (
            <motion.div
              key={`${col.chain}-${col.address}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigate(`/collection/${col.chain}/${col.address}`)}
              className="group rounded-xl border border-border p-4 hover:border-primary/30 transition-all cursor-pointer hover:shadow-[0_0_20px_oklch(0.72_0.17_195/0.08)]"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-14 h-14 rounded-lg bg-secondary overflow-hidden shrink-0">
                  {col.image_url ? (
                    <img src={getOptimizedImageUrl(col.image_url, 200)} alt={col.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-muted-foreground/30">
                      {col.symbol?.[0] || '?'}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm truncate">{col.name || col.symbol || 'Unknown'}</h3>
                    <NetworkBadge chain={col.chain} />
                  </div>
                  <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{col.symbol} &middot; {col.type}</p>
                </div>
              </div>

              {col.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{col.description}</p>
              )}

              <div className="flex items-center gap-4 text-[11px]">
                <div>
                  <span className="font-mono font-bold tabular-nums text-foreground">{col.total_supply}</span>
                  <span className="text-muted-foreground ml-1">items</span>
                </div>
                <div>
                  <span className="font-mono font-bold tabular-nums text-foreground">{col.owner_count}</span>
                  <span className="text-muted-foreground ml-1">owners</span>
                </div>
                <div className="ml-auto">
                  <span className="font-mono text-muted-foreground">{col.address.slice(0, 6)}...{col.address.slice(-4)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FunnelSimple size={40} className="text-muted-foreground mb-3" />
          <p className="text-sm font-medium mb-1">No collections found</p>
          <p className="text-xs text-muted-foreground">
            {query ? 'Try adjusting your search' : 'Collections will appear here once approved'}
          </p>
        </div>
      )}
    </div>
  )
}
