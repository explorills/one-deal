import { type HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

const roundedClasses: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
}

function Skeleton({ className, rounded = 'md', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton-shimmer',
        roundedClasses[rounded],
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton, type SkeletonProps }
