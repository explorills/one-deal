import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlass, FunnelSimple } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { NFTCard } from '@/components/nft/NFTCard'
import { NFTCardSkeleton } from '@/components/nft/NFTCardSkeleton'
import { Button } from '@/components/ui/Button'
import { nfts, collections } from '@/data/mock'
import { COLLECTION_CATEGORIES, SORT_OPTIONS } from '@/lib/constants'
import type { NFT } from '@/types'

export default function Explore() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('recently-listed')
  const [visibleCount, setVisibleCount] = useState(8)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const filtered = nfts.filter((nft) => {
    if (category !== 'all') {
      const col = collections.find((c) => c.id === nft.collection.id)
      if (!col || col.category !== category) return false
    }
    if (query) {
      const q = query.toLowerCase()
      if (!nft.name.toLowerCase().includes(q) && !nft.collection.name.toLowerCase().includes(q)) return false
    }
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-low') return a.price - b.price
    if (sort === 'price-high') return b.price - a.price
    if (sort === 'most-liked') return b.likes - a.likes
    return 0
  })

  const displayed = sorted.slice(0, visibleCount)
  const hasMore = visibleCount < sorted.length

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setLoading(true)
          setTimeout(() => {
            setVisibleCount((p) => Math.min(p + 4, sorted.length))
            setLoading(false)
          }, 400)
        }
      },
      { rootMargin: '200px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, loading, sorted.length])

  useEffect(() => { setVisibleCount(8) }, [category, query, sort])

  const onNFT = useCallback((nft: NFT) => navigate(`/nft/${nft.id}`), [navigate])

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Explore</h1>
      <p className="text-sm text-muted-foreground mb-6">Browse and discover digital assets</p>

      {/* Search — bottom-line style */}
      <div className="relative mb-6">
        <MagnifyingGlass size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search NFTs and collections..."
          className="w-full bg-transparent border-b border-border pl-7 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Filter chips — horizontal scroll */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {COLLECTION_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              category === cat.value
                ? 'bg-primary text-primary-foreground shadow-[0_0_12px_oklch(0.72_0.17_195/0.3)]'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sort + Count */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs text-muted-foreground font-mono">{sorted.length} items</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-secondary text-foreground text-xs rounded-lg border border-border px-3 py-1.5 focus:outline-none focus:border-primary cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {displayed.map((nft) => (
            <NFTCard key={nft.id} nft={nft} onClick={onNFT} />
          ))}
          {loading && Array.from({ length: 4 }).map((_, i) => <NFTCardSkeleton key={`s-${i}`} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FunnelSimple size={40} className="text-muted-foreground mb-3" />
          <p className="text-sm font-medium mb-1">No items found</p>
          <p className="text-xs text-muted-foreground mb-4">Try adjusting your search or filters</p>
          <Button variant="outline" size="sm" onClick={() => { setQuery(''); setCategory('all') }}>
            Clear filters
          </Button>
        </div>
      )}

      <div ref={sentinelRef} className="h-1" />
    </div>
  )
}
