import {
  ShoppingCart,
  Tag,
  Gavel,
  ArrowRightLeft,
  Sparkles,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import type { Activity, ActivityType } from '../../types'
import { cn, formatAddress, timeAgo } from '../../lib/utils'
import { PriceDisplay } from './PriceDisplay'

export interface ActivityRowProps {
  activity: Activity
  className?: string
}

const eventConfig: Record<ActivityType, { icon: LucideIcon; label: string; color: string }> = {
  sale: { icon: ShoppingCart, label: 'Sale', color: 'text-green-500' },
  listing: { icon: Tag, label: 'List', color: 'text-blue-500' },
  bid: { icon: Gavel, label: 'Bid', color: 'text-amber-500' },
  transfer: { icon: ArrowRightLeft, label: 'Transfer', color: 'text-purple-500' },
  mint: { icon: Sparkles, label: 'Mint', color: 'text-brand-500' },
  cancel: { icon: XCircle, label: 'Cancel', color: 'text-red-500' },
}

function ActivityRow({ activity, className }: ActivityRowProps) {
  const config = eventConfig[activity.type]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5',
        'transition-colors duration-150 hover:bg-zinc-50 dark:hover:bg-zinc-800/50',
        className,
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0', config.color)} />

      <img
        src={activity.nft.image}
        alt={activity.nft.name}
        className="h-10 w-10 shrink-0 rounded-md object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {activity.nft.name}
        </span>
        <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{formatAddress(activity.from.address)}</span>
          {activity.to && (
            <>
              <ArrowRightLeft className="h-3 w-3" />
              <span>{formatAddress(activity.to.address)}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-0.5">
        {activity.price != null && (
          <PriceDisplay price={activity.price} currency={activity.currency} size="sm" />
        )}
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {timeAgo(activity.timestamp)}
        </span>
      </div>
    </div>
  )
}

export { ActivityRow }
