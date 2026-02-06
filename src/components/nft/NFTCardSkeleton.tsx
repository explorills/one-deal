import { cn } from '../../lib/utils'
import { Skeleton } from '../ui'

export interface NFTCardSkeletonProps {
  className?: string
}

function NFTCardSkeleton({ className }: NFTCardSkeletonProps) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border',
        'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800',
        className,
      )}
    >
      {/* Image placeholder */}
      <Skeleton className="aspect-square w-full" rounded="none" />

      {/* Content */}
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-3 w-24" rounded="full" />
        <Skeleton className="h-4 w-36" rounded="full" />
        <div className="mt-1 flex items-center justify-between">
          <Skeleton className="h-4 w-20" rounded="full" />
          <Skeleton className="h-8 w-16" rounded="lg" />
        </div>
      </div>
    </div>
  )
}

export { NFTCardSkeleton }
