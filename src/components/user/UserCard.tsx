import { BadgeCheck } from 'lucide-react'
import type { User } from '../../types'
import { cn, formatCompactNumber } from '../../lib/utils'
import { Avatar } from '../ui'

export interface UserCardProps {
  user: User
  onClick?: (user: User) => void
  className?: string
}

function UserCard({ user, onClick, className }: UserCardProps) {
  return (
    <div
      onClick={() => onClick?.(user)}
      className={cn(
        'flex flex-col items-center gap-3 rounded-xl border p-4',
        'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800',
        'transition-all duration-200 hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-zinc-900/50',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      <Avatar src={user.avatar} alt={user.displayName} size="lg" />

      <div className="flex items-center gap-1.5">
        <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {user.displayName}
        </span>
        {user.isVerified && (
          <BadgeCheck className="h-4 w-4 shrink-0 text-brand-500" />
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatCompactNumber(user.stats.totalVolume)}
          </span>
          <span>Volume</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatCompactNumber(user.stats.nftsOwned)}
          </span>
          <span>Items</span>
        </div>
      </div>
    </div>
  )
}

export { UserCard }
