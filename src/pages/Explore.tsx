import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MagnifyingGlass, FunnelSimple } from '@phosphor-icons/react'
import { NetworkBadge } from '@/components/ui/NetworkBadge'
import { getOptimizedImageUrl, searchCollections, fetchStats } from '@/lib/api'
import { Skeleton } from '@/components/ui/Skeleton'
import { fetchRecentlyActive, fetchCollections, precacheCollectionNfts } from '@/lib/api'
import type { ApiCollection } from '@/lib/api'

const BATCH_SIZE = 24
const SEARCH_MIN_CHARS = 3

const CHAIN_FILTERS = [
  { value: 'all', label: 'All Networks' },
  { value: 'flare', label: 'Flare' },
  { value: 'songbird', label: 'Songbird' },
]

export default function Explore() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialChain = searchParams.get('chain') || 'all'

  const [query, setQuery] = useState('')
  const [chainFilter, setChainFilter] = useState(initialChain)
  const [collections, setCollections] = useState<ApiCollection[]>([])
  const [allCollections, setAllCollections] = useState<ApiCollection[]>([])
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>()

  // Fetch total collection count from stats
  useEffect(() => {
    fetchStats().then((s) => {
      const stats = s.stats
      if (chainFilter === 'all') {
        setTotalCount(Object.values(stats).reduce((sum, s) => sum + s.collections, 0))
      } else if (stats[chainFilter]) {
        setTotalCount(stats[chainFilter].collections)
      }
    }).catch(() => {})
  }, [chainFilter])

  // Initial load: recently active collections
  useEffect(() => {
    setLoading(true)
    setVisibleCount(BATCH_SIZE)

    if (chainFilter === 'all') {
      Promise.all([
        fetchRecentlyActive('flare', 12),
        fetchRecentlyActive('songbird', 12),
      ]).then(([flare, songbird]) => {
        const combined = interleave(flare, songbird)
        setCollections(combined)
        setAllCollections(combined)
      }).catch(() => {
        setCollections([])
        setAllCollections([])
      }).finally(() => setLoading(false))
    } else {
      fetchRecentlyActive(chainFilter, BATCH_SIZE)
        .then((cols) => {
          setCollections(cols)
          setAllCollections(cols)
        })
        .catch(() => {
          setCollections([])
          setAllCollections([])
        })
        .finally(() => setLoading(false))
    }
  }, [chainFilter])

  // Pre-cache first 24 NFTs of visible collections
  useEffect(() => {
    if (loading) return
    collections.slice(0, visibleCount).forEach((col) => {
      precacheCollectionNfts(col.chain, col.address, 24)
    })
  }, [loading, collections, visibleCount])

  // Search handler — debounced, live search after 3+ chars
  const handleSearch = useCallback((value: string) => {
    setQuery(value)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)

    if (value.length < SEARCH_MIN_CHARS) {
      setSearching(false)
      setCollections(allCollections)
      setVisibleCount(BATCH_SIZE)
      return
    }

    setSearching(true)
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await searchCollections(value)
        setCollections(results.slice(0, BATCH_SIZE))
        setVisibleCount(BATCH_SIZE)
      } catch {
        setCollections([])
      } finally {
        setSearching(false)
      }
    }, 300)
  }, [allCollections])

  // Load more: fetch additional collections from full list
  const loadMore = useCallback(async () => {
    if (query.length >= SEARCH_MIN_CHARS) return // no load more during search

    // If we only have recently-active (initial 24), fetch full list now
    if (allCollections.length <= BATCH_SIZE) {
      const chain = chainFilter === 'all' ? undefined : chainFilter
      try {
        const full = await fetchCollections(chain)
        setAllCollections(full)
        setCollections(full)
        setVisibleCount(visibleCount + BATCH_SIZE)
      } catch { /* ignore */ }
    } else {
      setVisibleCount((prev) => prev + BATCH_SIZE)
    }

    // Pre-cache the NEXT batch after this one loads
    const nextStart = visibleCount + BATCH_SIZE
    const nextBatch = (allCollections.length > BATCH_SIZE ? allCollections : collections).slice(nextStart, nextStart + BATCH_SIZE)
    nextBatch.forEach((col) => {
      precacheCollectionNfts(col.chain, col.address, 24)
    })
  }, [chainFilter, query, allCollections, collections, visibleCount])

  const visible = collections.slice(0, visibleCount)
  const hasMore = query.length < SEARCH_MIN_CHARS && (collections.length > visibleCount || allCollections.length <= BATCH_SIZE)

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
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search collections (3+ characters)..."
          className="w-full bg-transparent border-b border-border pl-7 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Network filter chips */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {CHAIN_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setChainFilter(f.value); setQuery('') }}
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
          {loading || searching ? '...' : `${visible.length} of ${totalCount ?? collections.length} collection${(totalCount ?? collections.length) !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Collections grid — chain loading animation */}
      {loading || searching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-4 space-y-3">
              <Skeleton className="w-14 h-14 rounded-lg" />
              <Skeleton className="w-32 h-5" />
              <div className="flex gap-4">
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-16 h-4" />
              </div>
            </div>
          ))}
        </div>
      ) : visible.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((col, i) => (
              <ExploreCard key={`${col.chain}-${col.address}`} col={col} index={i % BATCH_SIZE} onNavigate={navigate} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center py-8">
              <button
                onClick={loadMore}
                className="px-6 py-2.5 rounded-lg bg-secondary text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FunnelSimple size={40} className="text-muted-foreground mb-3" />
          <p className="text-sm font-medium mb-1">No collections found</p>
          <p className="text-xs text-muted-foreground">
            {query ? 'Try adjusting your search' : 'Collections will appear here'}
          </p>
        </div>
      )}
    </div>
  )
}

/** Interleave two arrays: [a1, b1, a2, b2, ...] */
function interleave<T>(a: T[], b: T[]): T[] {
  const result: T[] = []
  const max = Math.max(a.length, b.length)
  for (let i = 0; i < max; i++) {
    if (i < a.length) result.push(a[i])
    if (i < b.length) result.push(b[i])
  }
  return result
}

const DOMINO_DELAY = 80

/** Explore grid card with domino reveal (image preloads, reveals in sequence) */
function ExploreCard({ col, index, onNavigate }: { col: ApiCollection; index: number; onNavigate: (path: string) => void }) {
  const [visible, setVisible] = useState(false)
  const [imageReady, setImageReady] = useState(false)
  const mountTime = useRef(Date.now())

  useEffect(() => {
    if (!imageReady) return
    const minTime = mountTime.current + index * DOMINO_DELAY
    const remaining = minTime - Date.now()
    if (remaining <= 0) setVisible(true)
    else { const t = setTimeout(() => setVisible(true), remaining); return () => clearTimeout(t) }
  }, [imageReady, index])

  useEffect(() => {
    if (!col.image_url) { setImageReady(true); return }
    const img = new Image()
    img.onload = () => setImageReady(true)
    img.onerror = () => setImageReady(true)
    img.src = getOptimizedImageUrl(col.image_url, 200)
  }, [col.image_url])

  return (
    <div
      onClick={() => onNavigate(`/collection/${col.chain}/${col.address}`)}
      className="group rounded-xl border border-border p-4 hover:border-primary/30 transition-all cursor-pointer hover:shadow-[0_0_20px_oklch(0.72_0.17_195/0.08)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
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
      <div className="flex items-center gap-4 text-[11px]">
        <div>
          <span className="font-mono font-bold tabular-nums text-foreground">{col.nfts_cached}</span>
          <span className="text-muted-foreground ml-1">items</span>
        </div>
        <div>
          <span className="font-mono font-bold tabular-nums text-foreground">{col.holder_count}</span>
          <span className="text-muted-foreground ml-1">holders</span>
        </div>
        <div className="ml-auto">
          <span className="font-mono text-muted-foreground">{col.address.slice(0, 6)}...{col.address.slice(-4)}</span>
        </div>
      </div>
    </div>
  )
}
