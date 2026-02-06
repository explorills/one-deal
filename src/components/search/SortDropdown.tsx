import { ArrowUpDown } from 'lucide-react'
import { Dropdown } from '../ui'

export type SortOption =
  | 'recently-listed'
  | 'price-low-high'
  | 'price-high-low'
  | 'most-favorited'
  | 'ending-soon'

export interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
  className?: string
}

const sortOptions: { id: SortOption; label: string }[] = [
  { id: 'recently-listed', label: 'Recently Listed' },
  { id: 'price-low-high', label: 'Price: Low to High' },
  { id: 'price-high-low', label: 'Price: High to Low' },
  { id: 'most-favorited', label: 'Most Favorited' },
  { id: 'ending-soon', label: 'Ending Soon' },
]

function SortDropdown({ value, onChange, className }: SortDropdownProps) {
  const currentLabel = sortOptions.find(o => o.id === value)?.label ?? 'Sort'

  return (
    <Dropdown
      align="right"
      className={className}
      trigger={
        <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors duration-150 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
          <ArrowUpDown className="h-4 w-4" />
          {currentLabel}
        </button>
      }
      items={sortOptions.map(o => ({ id: o.id, label: o.label }))}
      onSelect={id => onChange(id as SortOption)}
    />
  )
}

export { SortDropdown }
