import type { Bid } from '../../types'
import { cn, formatAddress, timeAgo } from '../../lib/utils'
import { Avatar } from '../ui'
import { PriceDisplay } from './PriceDisplay'

export interface BidRowProps {
  bid: Bid
  className?: string
}

function BidRow({ bid, className }: BidRowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5',
        'transition-colors duration-150 hover:bg-zinc-50 dark:hover:bg-zinc-800/50',
        className,
      )}
    >
      <Avatar src={bid.bidder.avatar} alt={bid.bidder.displayName} size="sm" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {bid.bidder.displayName || formatAddress(bid.bidder.address)}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {timeAgo(bid.createdAt)}
        </span>
      </div>
      <PriceDisplay price={bid.amount} currency={bid.currency} size="sm" />
    </div>
  )
}

export { BidRow }
