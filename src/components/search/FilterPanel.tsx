import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Input, Button } from '../ui'

export interface FilterState {
  status: string[]
  priceMin: string
  priceMax: string
  chains: string[]
}

export interface FilterPanelProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  collections?: { id: string; name: string }[]
  className?: string
}

const statusOptions = [
  { id: 'buy-now', label: 'Buy Now' },
  { id: 'on-auction', label: 'On Auction' },
  { id: 'new', label: 'New' },
]

const chainOptions = [
  { id: 'ethereum', label: 'Ethereum' },
  { id: 'polygon', label: 'Polygon' },
  { id: 'arbitrum', label: 'Arbitrum' },
  { id: 'optimism', label: 'Optimism' },
]

interface SectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function Section({ title, defaultOpen = true, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-zinc-100 py-3 last:border-0 dark:border-zinc-800">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between text-sm font-medium text-zinc-900 dark:text-zinc-100"
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <div className="mt-2 flex flex-col gap-2">{children}</div>}
    </div>
  )
}

function FilterPanel({ filters, onChange, collections, className }: FilterPanelProps) {
  function toggleStatus(id: string) {
    const next = filters.status.includes(id)
      ? filters.status.filter(s => s !== id)
      : [...filters.status, id]
    onChange({ ...filters, status: next })
  }

  function toggleChain(id: string) {
    const next = filters.chains.includes(id)
      ? filters.chains.filter(c => c !== id)
      : [...filters.chains, id]
    onChange({ ...filters, chains: next })
  }

  function clearAll() {
    onChange({ status: [], priceMin: '', priceMax: '', chains: [] })
  }

  const hasFilters = filters.status.length > 0 || filters.priceMin || filters.priceMax || filters.chains.length > 0

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border p-4',
        'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800',
        className,
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Filters</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear all
          </Button>
        )}
      </div>

      {/* Status */}
      <Section title="Status">
        {statusOptions.map(opt => (
          <label key={opt.id} className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={filters.status.includes(opt.id)}
              onChange={() => toggleStatus(opt.id)}
              className="h-4 w-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500 dark:border-zinc-600"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">{opt.label}</span>
          </label>
        ))}
      </Section>

      {/* Price Range */}
      <Section title="Price">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.priceMin}
            onChange={e => onChange({ ...filters, priceMin: e.target.value })}
            className="h-8 text-xs"
          />
          <span className="text-xs text-zinc-400">to</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={e => onChange({ ...filters, priceMax: e.target.value })}
            className="h-8 text-xs"
          />
        </div>
      </Section>

      {/* Chains */}
      <Section title="Chain" defaultOpen={false}>
        {chainOptions.map(opt => (
          <label key={opt.id} className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={filters.chains.includes(opt.id)}
              onChange={() => toggleChain(opt.id)}
              className="h-4 w-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500 dark:border-zinc-600"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">{opt.label}</span>
          </label>
        ))}
      </Section>

      {/* Collections */}
      {collections && collections.length > 0 && (
        <Section title="Collections" defaultOpen={false}>
          {collections.map(col => (
            <label key={col.id} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500 dark:border-zinc-600"
              />
              <span className="truncate text-sm text-zinc-700 dark:text-zinc-300">{col.name}</span>
            </label>
          ))}
        </Section>
      )}
    </div>
  )
}

export { FilterPanel }
