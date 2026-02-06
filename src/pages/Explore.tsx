import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button, Tabs } from '../components/ui'
import { NFTCard } from '../components/nft/NFTCard'
import { NFTCardSkeleton } from '../components/nft/NFTCardSkeleton'
import { NFTGrid } from '../components/nft/NFTGrid'
import { SearchBar } from '../components/search/SearchBar'
import { FilterPanel, type FilterState } from '../components/search/FilterPanel'
import { SortDropdown, type SortOption } from '../components/search/SortDropdown'
import { nfts, collections } from '../data/mock'
import type { NFT } from '../types'

const categoryTabs = [
  { id: 'all', label: 'All' },
  { id: 'art', label: 'Art' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'music', label: 'Music' },
  { id: 'photography', label: 'Photography' },
  { id: 'sports', label: 'Sports' },
  { id: 'virtual-worlds', label: 'Virtual Worlds' },
]

const defaultFilters: FilterState = {
  status: [],
  priceMin: '',
  priceMax: '',
  chains: [],
}

export default function Explore() {
  const navigate = useNavigate()

  const [category, setCategory] = useState('all')
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [sort, setSort] = useState<SortOption>('recently-listed')
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(8)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Filter & sort logic
  const filtered = nfts.filter(nft => {
    // category
    if (category !== 'all') {
      const col = collections.find(c => c.id === nft.collection.id)
      if (!col || col.category !== category) return false
    }
    // search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (
        !nft.name.toLowerCase().includes(q) &&
        !nft.collection.name.toLowerCase().includes(q)
      )
        return false
    }
    // price range
    if (filters.priceMin && nft.price < Number(filters.priceMin)) return false
    if (filters.priceMax && nft.price > Number(filters.priceMax)) return false
    // status
    if (filters.status.includes('buy-now') && !nft.isListed) return false
    if (filters.status.includes('on-auction') && !nft.listingExpiry) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'price-low-high':
        return a.price - b.price
      case 'price-high-low':
        return b.price - a.price
      case 'most-favorited':
        return b.likes - a.likes
      default:
        return 0
    }
  })

  const displayed = sorted.slice(0, visibleCount)
  const hasMore = visibleCount < sorted.length

  // Infinite scroll
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setLoading(true)
          // Simulate loading delay
          setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + 4, sorted.length))
            setLoading(false)
          }, 600)
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loading, sorted.length])

  // Reset visible count on filter changes
  useEffect(() => {
    setVisibleCount(8)
  }, [category, searchQuery, filters, sort])

  const handleNFTClick = useCallback(
    (nft: NFT) => navigate(`/nft/${nft.id}`),
    [navigate],
  )

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="mb-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Explore NFTs
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Browse and discover extraordinary digital assets
        </p>
      </div>

      {/* Search + Category tabs */}
      <div className="flex flex-col gap-4">
        <SearchBar
          onSearch={(q) => setSearchQuery(q)}
          placeholder="Search NFTs and collections..."
        />
        <Tabs tabs={categoryTabs} activeTab={category} onChange={setCategory} />
      </div>

      {/* Main layout */}
      <div className="flex gap-6">
        {/* Sidebar — desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            collections={collections.map(c => ({ id: c.id, name: c.name }))}
          />
        </aside>

        {/* Mobile filter drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="relative z-10 flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto bg-white dark:bg-zinc-900"
              style={{ animation: 'slideInLeft 200ms ease-out' }}
            >
              <style>{`
                @keyframes slideInLeft {
                  from { transform: translateX(-100%); }
                  to { transform: translateX(0); }
                }
              `}</style>
              <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Filters</h3>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                <FilterPanel
                  filters={filters}
                  onChange={setFilters}
                  collections={collections.map(c => ({ id: c.id, name: c.name }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Content area */}
        <div className="flex-1">
          {/* Top bar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setDrawerOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {sorted.length} {sorted.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          {/* Grid */}
          {sorted.length > 0 ? (
            <NFTGrid>
              {displayed.map(nft => (
                <NFTCard key={nft.id} nft={nft} onClick={handleNFTClick} />
              ))}
              {loading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <NFTCardSkeleton key={`skel-${i}`} />
                ))}
            </NFTGrid>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                <SlidersHorizontal className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                No items found
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters(defaultFilters)
                  setCategory('all')
                  setSearchQuery('')
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}

          {/* Sentinel for infinite scroll */}
          <div ref={sentinelRef} className="h-1" />
        </div>
      </div>
    </div>
  )
}
