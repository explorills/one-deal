import { TrendingUp, TrendingDown } from 'lucide-react'
import type { CollectionStats as CollectionStatsType } from '../../types'
import { cn, formatCompactNumber } from '../../lib/utils'

export interface CollectionStatsProps {
  stats: CollectionStatsType
  className?: string
}

interface StatItem {
  label: string
  value: string
  change?: number
}

function CollectionStatsComponent({ stats, className }: CollectionStatsProps) {
  const items: StatItem[] = [
    { label: 'Floor Price', value: `${stats.floorPrice} ETH` },
    { label: 'Total Volume', value: `${formatCompactNumber(stats.totalVolume)} ETH` },
    { label: 'Owners', value: formatCompactNumber(stats.owners) },
    { label: 'Items', value: formatCompactNumber(stats.items) },
    { label: 'Listed', value: `${stats.listedPercentage}%` },
    { label: '7d Change', value: `${stats.sevenDayChange > 0 ? '+' : ''}${stats.sevenDayChange}%`, change: stats.sevenDayChange },
  ]

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-4 rounded-xl border px-4 py-3 sm:gap-6',
        'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800',
        className,
      )}
    >
      {items.map(item => (
        <div key={item.label} className="flex flex-col">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{item.label}</span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {item.value}
            </span>
            {item.change != null && (
              item.change >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              )
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export { CollectionStatsComponent as CollectionStats }
