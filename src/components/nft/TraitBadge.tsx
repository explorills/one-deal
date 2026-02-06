import type { Trait } from '../../types'
import { cn } from '../../lib/utils'

export interface TraitBadgeProps {
  trait: Trait
  className?: string
}

function TraitBadge({ trait, className }: TraitBadgeProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-0.5 rounded-lg border px-3 py-2',
        'border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-950/30',
        'transition-colors duration-150',
        className,
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
        {trait.traitType}
      </span>
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {trait.value}
      </span>
      <span className="text-xs text-zinc-500 dark:text-zinc-400">
        {trait.rarity}% have this
      </span>
    </div>
  )
}

export { TraitBadge }
