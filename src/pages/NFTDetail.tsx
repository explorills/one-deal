import { useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Heart,
  Share2,
  Maximize2,
  Minimize2,
  BadgeCheck,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react'
import { Button, Tabs, Badge } from '../components/ui'
import { PriceDisplay } from '../components/nft/PriceDisplay'
import { CountdownTimer } from '../components/nft/CountdownTimer'
import { TraitBadge } from '../components/nft/TraitBadge'
import { BidRow } from '../components/nft/BidRow'
import { ActivityRow } from '../components/nft/ActivityRow'
import { NFTCard } from '../components/nft/NFTCard'
import { UserBadge } from '../components/user/UserBadge'
import { nfts, bids, activities } from '../data/mock'
import { cn, formatAddress } from '../lib/utils'

const detailTabs = [
  { id: 'properties', label: 'Properties' },
  { id: 'details', label: 'Details' },
  { id: 'history', label: 'Price History' },
  { id: 'offers', label: 'Offers' },
  { id: 'activity', label: 'Activity' },
]

export default function NFTDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const nft = nfts.find(n => n.id === id)
  const [activeTab, setActiveTab] = useState('properties')
  const [fullscreen, setFullscreen] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(nft?.likes ?? 0)
  const [copied, setCopied] = useState(false)

  const nftBids = bids.filter(b => b.nftId === id)
  const nftActivities = activities.filter(a => a.nft.id === id)
  const moreFromCollection = nfts.filter(
    n => n.collection.id === nft?.collection.id && n.id !== id,
  )

  const handleNFTClick = useCallback(
    (nft: { id: string }) => navigate(`/nft/${nft.id}`),
    [navigate],
  )

  function handleLike() {
    setLiked(prev => !prev)
    setLikeCount(prev => (liked ? prev - 1 : prev + 1))
  }

  function handleCopyAddress() {
    navigator.clipboard.writeText('0x1a2B3c...contractAddress').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!nft) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">NFT not found</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          The NFT you're looking for doesn't exist.
        </p>
        <Button variant="outline" onClick={() => navigate('/explore')}>
          Back to Explore
        </Button>
      </div>
    )
  }

  const hasAuction = !!nft.listingExpiry

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Main layout — 2 columns on desktop */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        {/* Left — Image viewer */}
        <div className="flex-1 lg:max-w-lg xl:max-w-xl">
          <div
            className={cn(
              'group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800',
              fullscreen && 'fixed inset-0 z-50 rounded-none border-0',
            )}
          >
            <img
              src={nft.image}
              alt={nft.name}
              className={cn(
                'w-full object-cover',
                fullscreen ? 'h-full' : 'aspect-square',
              )}
            />
            <button
              onClick={() => setFullscreen(f => !f)}
              className="absolute right-3 top-3 rounded-lg bg-black/40 p-2 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-black/60"
            >
              {fullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Right — Info */}
        <div className="flex flex-1 flex-col gap-5">
          {/* Collection link */}
          <Link
            to={`/collection/${nft.collection.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
          >
            {nft.collection.name}
            {nft.collection.isVerified && (
              <BadgeCheck className="h-4 w-4 text-brand-500" />
            )}
          </Link>

          {/* Name */}
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            {nft.name}
          </h1>

          {/* Owner + actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span>Owned by</span>
              <UserBadge user={nft.owner} onClick={() => navigate(`/profile/${nft.owner.address}`)} />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleLike}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-150',
                  'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800',
                  liked && 'border-red-300 text-red-500 dark:border-red-800',
                )}
              >
                <Heart className={cn('h-4 w-4', liked && 'fill-red-500 text-red-500')} />
                {likeCount}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href).catch(() => {})
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors duration-150 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>

          {/* Price section */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
            {hasAuction && (
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="warning">Auction</Badge>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Ends in</span>
                <CountdownTimer endTime={nft.listingExpiry!} />
              </div>
            )}

            <div className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">Current Price</div>
            <PriceDisplay price={nft.price} currency={nft.currency} size="lg" />

            {nft.lastSale != null && (
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Last sale: {nft.lastSale} {nft.currency}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              {nft.isListed && (
                <Button size="lg" className="flex-1 sm:flex-none">
                  Buy Now
                </Button>
              )}
              <Button size="lg" variant="outline" className="flex-1 sm:flex-none">
                {hasAuction ? 'Place Bid' : 'Make Offer'}
              </Button>
            </div>

            {nft.highestBid != null && (
              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                Highest bid:{' '}
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {nft.highestBid} WETH
                </span>
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {nft.description}
          </p>
        </div>
      </div>

      {/* Tabs section */}
      <div>
        <Tabs tabs={detailTabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="mt-4">
          {/* Properties */}
          {activeTab === 'properties' && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {nft.traits.map(trait => (
                <TraitBadge key={trait.traitType} trait={trait} />
              ))}
            </div>
          )}

          {/* Details */}
          {activeTab === 'details' && (
            <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              {[
                { label: 'Contract Address', value: '0x1a2B...eF01', action: true },
                { label: 'Token ID', value: nft.tokenId },
                { label: 'Token Standard', value: 'ERC-721' },
                { label: 'Chain', value: 'Ethereum' },
                { label: 'Creator', value: nft.creator.displayName || formatAddress(nft.creator.address) },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={cn(
                    'flex items-center justify-between px-4 py-3',
                    i < arr.length - 1 && 'border-b border-zinc-100 dark:border-zinc-800',
                  )}
                >
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{row.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {row.value}
                    </span>
                    {row.action && (
                      <button
                        onClick={handleCopyAddress}
                        className="text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Price History (placeholder chart) */}
          {activeTab === 'history' && (
            <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Price History
              </h3>
              {/* Simple placeholder chart with bars */}
              <div className="flex h-40 items-end gap-2">
                {nft.priceHistory.map((entry, i) => {
                  const maxPrice = Math.max(...nft.priceHistory.map(e => e.price))
                  const height = (entry.price / maxPrice) * 100
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                        {entry.price}
                      </span>
                      <div
                        className="w-full rounded-t-md bg-brand-500/80 transition-all duration-300 dark:bg-brand-400/80"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      />
                      <span className="text-[10px] text-zinc-400">
                        {new Date(entry.date).toLocaleDateString(undefined, {
                          month: 'short',
                          year: '2-digit',
                        })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Offers */}
          {activeTab === 'offers' && (
            <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              {nftBids.length > 0 ? (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {nftBids.map(bid => (
                    <BidRow key={bid.id} bid={bid} />
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No offers yet
                </div>
              )}
            </div>
          )}

          {/* Activity */}
          {activeTab === 'activity' && (
            <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              {nftActivities.length > 0 ? (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {nftActivities.map(act => (
                    <ActivityRow key={act.id} activity={act} />
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No activity yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* More from collection */}
      {moreFromCollection.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              More from this collection
            </h2>
            <Link
              to={`/collection/${nft.collection.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              View collection
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
            {moreFromCollection.map(n => (
              <NFTCard
                key={n.id}
                nft={n}
                onClick={handleNFTClick}
                className="w-64 shrink-0 sm:w-72"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
