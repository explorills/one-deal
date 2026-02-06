import { BadgeCheck } from 'lucide-react'
import type { Collection } from '../../types'
import { cn, formatCompactNumber } from '../../lib/utils'
import { PriceDisplay } from '../nft/PriceDisplay'

export interface CollectionCardProps {
  collection: Collection
  onClick?: (collection: Collection) => void
  className?: string
}

function CollectionCard({ collection, onClick, className }: CollectionCardProps) {
  return (
    <div
      onClick={() => onClick?.(collection)}
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border',
        'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800',
        'transition-all duration-200 hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-zinc-900/50',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {/* Banner */}
      <div className="relative h-24 overflow-hidden">
        <img
          src={collection.banner}
          alt={collection.name}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      {/* Logo overlapping banner */}
      <div className="relative px-3">
        <img
          src={collection.image}
          alt={collection.name}
          className="absolute -top-6 h-12 w-12 rounded-xl border-2 border-white object-cover dark:border-zinc-900"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 px-3 pb-3 pt-8">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {collection.name}
          </h3>
          {collection.isVerified && (
            <BadgeCheck className="h-4 w-4 shrink-0 text-brand-500" />
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider">Floor</span>
            <PriceDisplay price={collection.stats.floorPrice} size="sm" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider">Volume</span>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {formatCompactNumber(collection.stats.totalVolume)}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider">Items</span>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {formatCompactNumber(collection.stats.items)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export { CollectionCard }
