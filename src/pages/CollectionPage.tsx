import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from '@phosphor-icons/react'
import { NFTCard } from '@/components/nft/NFTCard'
import { NetworkBadge } from '@/components/ui/NetworkBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { fetchCollection, fetchCollectionNfts, precacheNextBatch } from '@/lib/api'
import type { ApiCollection, ApiNft } from '@/lib/api'
import { SUPPORTED_CHAINS } from '@/lib/constants'
import { formatAddress } from '@/lib/utils'

const BATCH_SIZE = 24

const SORT_OPTIONS = [
  { value: 'recent-active', label: 'Recently Active' },
  { value: 'least-active', label: 'Least Active' },
  { value: 'token_id', label: 'Token ID: Low to High' },
  { value: 'token-id-desc', label: 'Token ID: High to Low' },
  { value: 'floor-asc', label: 'Floor: Low to High', disabled: true },
  { value: 'floor-desc', label: 'Floor: High to Low', disabled: true },
  { value: 'recently-listed', label: 'Recently Listed', disabled: true },
  { value: 'oldest-listed', label: 'Oldest Listed', disabled: true },
]

export default function CollectionPage() {
  const { chain, address } = useParams()
  const [collection, setCollection] = useState<ApiCollection | null>(null)
  const [activeListings, setActiveListings] = useState(0)
  const [nfts, setNfts] = useState<ApiNft[]>([])
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('token_id')
  const [loading, setLoading] = useState(true)
  const [nftsLoading, setNftsLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [offset, setOffset] = useState(0)

  const chainConfig = SUPPORTED_CHAINS[chain as keyof typeof SUPPORTED_CHAINS]

  // Fetch collection info
  useEffect(() => {
    if (!chain || !address) return
    setLoading(true)
    fetchCollection(chain, address)
      .then((data) => {
        setCollection(data.collection)
        setActiveListings(data.activeListings || 0)
      })
      .catch(() => setCollection(null))
      .finally(() => setLoading(false))
  }, [chain, address])

  // Fetch NFTs (resets on sort change)
  useEffect(() => {
    if (!chain || !address) return
    setNftsLoading(true)
    setOffset(0)
    fetchCollectionNfts(chain, address, sort, BATCH_SIZE, 0)
      .then((data) => {
        setNfts(data.nfts)
        setTotal(data.total)
      })
      .catch(() => setNfts([]))
      .finally(() => setNftsLoading(false))
  }, [chain, address, sort])

  // Pre-cache: next batch + other sort views (first 24 of each)
  useEffect(() => {
    if (nftsLoading || !chain || !address) return

    // Pre-cache next batch for current sort
    precacheNextBatch(chain, address, sort, BATCH_SIZE, BATCH_SIZE)

    // Pre-cache first 24 of other sort views
    for (const opt of SORT_OPTIONS) {
      if (opt.disabled || opt.value === sort) continue
      precacheNextBatch(chain, address, opt.value, BATCH_SIZE, 0)
    }
  }, [nftsLoading, chain, address, sort])

  const loadMore = async () => {
    if (!chain || !address || loadingMore) return
    setLoadingMore(true)
    const newOffset = offset + BATCH_SIZE
    try {
      const data = await fetchCollectionNfts(chain, address, sort, BATCH_SIZE, newOffset)
      setNfts((prev) => [...prev, ...data.nfts])
      setOffset(newOffset)

      // Pre-cache the NEXT next batch
      precacheNextBatch(chain, address, sort, BATCH_SIZE, newOffset + BATCH_SIZE)
    } catch { /* ignore */ }
    setLoadingMore(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <Skeleton className="w-24 h-5 mb-6" />
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-20 h-20 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-muted-foreground">Collection not found</p>
        <Link to="/explore" className="text-primary text-sm mt-2 inline-block">Back to Explore</Link>
      </div>
    )
  }

  return (
    <div>
      {/* Banner */}
      <div className="relative h-32 sm:h-44 bg-secondary overflow-hidden">
        {collection.image_url && (
          <img src={collection.image_url} alt="" className="h-full w-full object-cover opacity-30 blur-sm scale-110" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft size={16} /> Back
        </Link>

        {/* Collection info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-background bg-secondary overflow-hidden shrink-0">
            {collection.image_url ? (
              <img src={collection.image_url} alt={collection.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground/30">
                {collection.symbol?.[0] || '?'}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{collection.name || collection.symbol}</h1>
              <NetworkBadge chain={collection.chain} size="md" />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground font-mono">{formatAddress(collection.address)}</span>
              <span className="text-xs text-muted-foreground">&middot;</span>
              <span className="text-xs text-muted-foreground">{collection.type}</span>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar border-y border-border py-3 mb-6">
          <StatBox label="Items" value={collection.nfts_cached.toString()} />
          <StatBox label="Holders" value={collection.holder_count.toString()} />
          <StatBox label="Listed" value={activeListings.toString()} />
          {chainConfig && (
            <StatBox
              label="Explorer"
              value={
                <a
                  href={`${chainConfig.explorer}/address/${collection.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline cursor-pointer"
                >
                  View
                </a>
              }
            />
          )}
        </div>

        {/* Sort + NFT count */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs text-muted-foreground font-mono">
            {nftsLoading ? '...' : `${total} NFTs`}
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-secondary text-foreground text-xs rounded-lg border border-border px-3 py-1.5 focus:outline-none focus:border-primary cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}{o.disabled ? ' (soon)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* NFTs grid — chain loading animation */}
        {nftsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-16">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : nfts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-8">
              <AnimatePresence mode="popLayout">
                {nfts.map((nft, i) => (
                  <NFTCard
                    key={`${nft.chain}-${nft.address}-${nft.token_id}`}
                    nft={nft}
                    index={i % BATCH_SIZE}
                  />
                ))}
              </AnimatePresence>
            </div>
            {nfts.length < total && (
              <div className="text-center pb-16">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 rounded-lg bg-secondary text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : `Load More (${total - nfts.length} remaining)`}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-12">No NFTs found for this collection</p>
        )}
      </div>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="shrink-0">
      <p className="font-mono text-sm font-bold tabular-nums">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  )
}
