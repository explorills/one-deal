import { BadgeCheck } from 'lucide-react'
import type { Collection } from '../../types'
import { cn, formatAddress } from '../../lib/utils'
import { Avatar } from '../ui'

export interface CollectionBannerProps {
  collection: Collection
  className?: string
}

function CollectionBanner({ collection, className }: CollectionBannerProps) {
  return (
    <div className={cn('relative w-full', className)}>
      {/* Banner image */}
      <div className="relative h-48 w-full overflow-hidden sm:h-64 md:h-72">
        <img
          src={collection.banner}
          alt={collection.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Overlay content */}
      <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-4 sm:p-6">
        <img
          src={collection.image}
          alt={collection.name}
          className="h-16 w-16 rounded-xl border-2 border-white object-cover shadow-lg sm:h-20 sm:w-20 dark:border-zinc-900"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-xl font-bold text-white sm:text-2xl">
              {collection.name}
            </h1>
            {collection.isVerified && (
              <BadgeCheck className="h-5 w-5 shrink-0 text-brand-400" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <span>by</span>
            <Avatar src={collection.creator.avatar} alt={collection.creator.displayName} size="sm" className="h-5 w-5" />
            <span className="font-medium text-white">
              {collection.creator.displayName || formatAddress(collection.creator.address)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export { CollectionBanner }
