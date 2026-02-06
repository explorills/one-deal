import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpDown, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react'
import { cn, formatCompactNumber } from '../lib/utils'
import { rankings } from '../data/mock'
import { COLLECTION_CATEGORIES } from '../lib/constants'
import { Button } from '../components/ui'
import { PriceDisplay } from '../components/nft/PriceDisplay'

type TimePeriod = '24h' | '7d' | '30d' | 'all'
type SortField = 'rank' | 'volume' | 'floorPrice' | 'volumeChange' | 'sales'
type SortDir = 'asc' | 'desc'

const TIME_PERIODS: { id: TimePeriod; label: string }[] = [
  { id: '24h', label: '24h' },
  { id: '7d', label: '7d' },
  { id: '30d', label: '30d' },
  { id: 'all', label: 'All Time' },
]

const ITEMS_PER_PAGE = 10

export default function Rankings() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('7d')
  const [category, setCategory] = useState('all')
  const [sortField, setSortField] = useState<SortField>('rank')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(1)

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const filteredRankings =
    category === 'all'
      ? rankings
      : rankings.filter(r => r.collection.category === category)

  const totalPages = Math.max(1, Math.ceil(filteredRankings.length / ITEMS_PER_PAGE))
  const pagedRankings = filteredRankings.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
    }
    return sortDir === 'asc' ? (
      <ChevronUp className="h-3.5 w-3.5 text-brand-500" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-brand-500" />
    )
  }

  const categoryTabs = [{ value: 'all', label: 'All' }, ...COLLECTION_CATEGORIES]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Rankings</h1>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        Top collections ranked by volume, floor price, and activity.
      </p>

      {/* Time period tabs */}
      <div className="mb-4 flex gap-2">
        {TIME_PERIODS.map(tp => (
          <button
            key={tp.id}
            onClick={() => {
              setTimePeriod(tp.id)
              setPage(1)
            }}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150',
              timePeriod === tp.id
                ? 'bg-brand-600 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700',
            )}
          >
            {tp.label}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {categoryTabs.map(cat => (
          <button
            key={cat.value}
            onClick={() => {
              setCategory(cat.value)
              setPage(1)
            }}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150',
              category === cat.value
                ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Rankings table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
              <th
                className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                onClick={() => handleSort('rank')}
              >
                <div className="flex items-center gap-1">
                  #
                  <SortIcon field="rank" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Collection
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                onClick={() => handleSort('floorPrice')}
              >
                <div className="flex items-center justify-end gap-1">
                  Floor Price
                  <SortIcon field="floorPrice" />
                </div>
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                onClick={() => handleSort('volume')}
              >
                <div className="flex items-center justify-end gap-1">
                  Volume
                  <SortIcon field="volume" />
                </div>
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                onClick={() => handleSort('volumeChange')}
              >
                <div className="flex items-center justify-end gap-1">
                  Change
                  <SortIcon field="volumeChange" />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Owners
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Items
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {pagedRankings.map(entry => (
              <tr
                key={entry.collection.id}
                className="transition-colors duration-150 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
              >
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                    {entry.rank}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/collection/${entry.collection.id}`}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={entry.collection.image}
                      alt={entry.collection.name}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {entry.collection.name}
                      </span>
                      {entry.collection.isVerified && (
                        <BadgeCheck className="h-4 w-4 text-brand-500" />
                      )}
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-right">
                  <PriceDisplay price={entry.floorPrice} size="sm" className="justify-end" />
                </td>
                <td className="px-4 py-3 text-right">
                  <PriceDisplay price={entry.volume} size="sm" className="justify-end" />
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      entry.volumeChange >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400',
                    )}
                  >
                    {entry.volumeChange >= 0 ? '+' : ''}
                    {entry.volumeChange.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {formatCompactNumber(entry.collection.stats.owners)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {formatCompactNumber(entry.collection.stats.items)}
                  </span>
                </td>
              </tr>
            ))}
            {pagedRankings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No collections found for this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
