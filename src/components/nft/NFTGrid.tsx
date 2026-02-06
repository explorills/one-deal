import { useState, type ReactNode } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { cn } from '../../lib/utils'

export type GridView = 'grid' | 'list'

export interface NFTGridProps {
  children: ReactNode
  defaultView?: GridView
  className?: string
}

function NFTGrid({ children, defaultView = 'grid', className }: NFTGridProps) {
  const [view, setView] = useState<GridView>(defaultView)

  return (
    <div className={className}>
      {/* View toggle */}
      <div className="mb-4 flex items-center justify-end gap-1">
        <button
          onClick={() => setView('grid')}
          className={cn(
            'rounded-md p-2 transition-colors duration-150',
            view === 'grid'
              ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400'
              : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300',
          )}
          aria-label="Grid view"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button
          onClick={() => setView('list')}
          className={cn(
            'rounded-md p-2 transition-colors duration-150',
            view === 'list'
              ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400'
              : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300',
          )}
          aria-label="List view"
        >
          <List className="h-4 w-4" />
        </button>
      </div>

      {/* Grid / List layout */}
      <div
        className={cn(
          view === 'grid'
            ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'flex flex-col gap-3',
        )}
      >
        {children}
      </div>
    </div>
  )
}

export { NFTGrid }
