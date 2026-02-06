import { useState } from 'react'
import { Heart, ShoppingCart, BadgeCheck } from 'lucide-react'
import type { NFT } from '../../types'
import { cn } from '../../lib/utils'
import { Button } from '../ui'
import { PriceDisplay } from './PriceDisplay'
import { CountdownTimer } from './CountdownTimer'

export interface NFTCardProps {
  nft: NFT
  onBuy?: (nft: NFT) => void
  onLike?: (nft: NFT) => void
  onClick?: (nft: NFT) => void
  className?: string
}

function NFTCard({ nft, onBuy, onLike, onClick, className }: NFTCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(nft.likes)

  function handleLike(e: React.MouseEvent) {
    e.stopPropagation()
    setLiked(prev => !prev)
    setLikeCount(prev => (liked ? prev - 1 : prev + 1))
    onLike?.(nft)
  }

  function handleBuy(e: React.MouseEvent) {
    e.stopPropagation()
    onBuy?.(nft)
  }

  return (
    <div
      onClick={() => onClick?.(nft)}
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border',
        'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800',
        'transition-all duration-200 hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-zinc-900/50',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={nft.image}
          alt={nft.name}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />

        {/* Like button */}
        <button
          onClick={handleLike}
          className={cn(
            'absolute right-2 top-2 flex items-center gap-1 rounded-full px-2.5 py-1',
            'bg-black/40 text-white backdrop-blur-sm',
            'transition-colors duration-150 hover:bg-black/60',
          )}
        >
          <Heart className={cn('h-3.5 w-3.5', liked && 'fill-red-500 text-red-500')} />
          <span className="text-xs font-medium">{likeCount}</span>
        </button>

        {/* Countdown overlay if auction */}
        {nft.listingExpiry && (
          <div className="absolute bottom-2 left-2 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm">
            <CountdownTimer endTime={nft.listingExpiry} className="text-white [&_span]:text-white [&_span]:!text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {/* Collection name */}
        <div className="flex items-center gap-1">
          <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {nft.collection.name}
          </span>
          {nft.collection.isVerified && (
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-brand-500" />
          )}
        </div>

        {/* NFT name */}
        <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {nft.name}
        </h3>

        {/* Price + Buy */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <PriceDisplay price={nft.price} currency={nft.currency} size="sm" />
          {nft.isListed && (
            <Button size="sm" onClick={handleBuy} className="gap-1.5">
              <ShoppingCart className="h-3.5 w-3.5" />
              Buy
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export { NFTCard }
