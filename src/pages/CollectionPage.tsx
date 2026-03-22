import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from '@phosphor-icons/react'
import { NFTCard } from '@/components/nft/NFTCard'
import { NetworkBadge } from '@/components/ui/NetworkBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { fetchCollection, fetchCollectionNfts } from '@/lib/api'
import type { ApiCollection, ApiNft } from '@/lib/api'
import { SUPPORTED_CHAINS } from '@/lib/constants'
import { formatAddress } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'token_id', label: 'Token ID' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'recent', label: 'Recently Listed' },
  { value: 'name-az', label: 'Name: A to Z' },
  { value: 'name-za', label: 'Name: Z to A' },
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

  // Fetch NFTs
  useEffect(() => {
    if (!chain || !address) return
    setNftsLoading(true)
    setOffset(0)
    fetchCollectionNfts(chain, address, sort, 50, 0)
      .then((data) => {
        setNfts(data.nfts)
        setTotal(data.total)
      })
      .catch(() => setNfts([]))
      .finally(() => setNftsLoading(false))
  }, [chain, address, sort])

  const loadMore = () => {
    if (!chain || !address) return
    const newOffset = offset + 50
    setOffset(newOffset)
    fetchCollectionNfts(chain, address, sort, 50, newOffset)
      .then((data) => setNfts((prev) => [...prev, ...data.nfts]))
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
      {/* Banner area */}
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

        {collection.description && (
          <p className="text-sm text-muted-foreground mb-6 max-w-2xl">{collection.description}</p>
        )}

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
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* NFTs grid */}
        {nftsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-16">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : nfts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-8">
              {nfts.map((nft, i) => (
                <NFTCard key={`${nft.chain}-${nft.address}-${nft.token_id}`} nft={nft} index={i} />
              ))}
            </div>
            {nfts.length < total && (
              <div className="text-center pb-16">
                <button
                  onClick={loadMore}
                  className="text-sm text-primary hover:underline font-medium cursor-pointer"
                >
                  Load more ({total - nfts.length} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-12">No NFTs indexed yet for this collection</p>
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
