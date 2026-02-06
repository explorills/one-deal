import { cn } from '../../lib/utils'

type PriceSize = 'sm' | 'md' | 'lg'

export interface PriceDisplayProps {
  price: number
  currency?: string
  usdEquivalent?: number
  size?: PriceSize
  className?: string
}

const sizeClasses: Record<PriceSize, { wrapper: string; icon: string; price: string; usd: string }> = {
  sm: { wrapper: 'gap-1', icon: 'h-3.5 w-3.5', price: 'text-sm font-medium', usd: 'text-xs' },
  md: { wrapper: 'gap-1.5', icon: 'h-4 w-4', price: 'text-base font-semibold', usd: 'text-sm' },
  lg: { wrapper: 'gap-2', icon: 'h-5 w-5', price: 'text-xl font-bold', usd: 'text-base' },
}

function EthIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.998 1.5l-7.5 12 7.5 4.5 7.5-4.5-7.5-12zm0 18.5l-7.5-4.5 7.5 10.5 7.5-10.5-7.5 4.5z" />
    </svg>
  )
}

function PriceDisplay({ price, currency = 'ETH', usdEquivalent, size = 'md', className }: PriceDisplayProps) {
  const s = sizeClasses[size]

  return (
    <div className={cn('flex items-center', s.wrapper, className)}>
      {currency === 'ETH' || currency === 'WETH' ? (
        <EthIcon className={cn(s.icon, 'text-zinc-900 dark:text-zinc-100')} />
      ) : null}
      <span className={cn(s.price, 'text-zinc-900 dark:text-zinc-100')}>
        {price.toLocaleString(undefined, { maximumFractionDigits: 4 })}
      </span>
      {currency !== 'ETH' && currency !== 'WETH' && (
        <span className={cn(s.price, 'text-zinc-900 dark:text-zinc-100')}>{currency}</span>
      )}
      {usdEquivalent != null && (
        <span className={cn(s.usd, 'text-zinc-500 dark:text-zinc-400')}>
          (${usdEquivalent.toLocaleString(undefined, { maximumFractionDigits: 2 })})
        </span>
      )}
    </div>
  )
}

export { PriceDisplay }
