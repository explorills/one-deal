import { BadgeCheck } from 'lucide-react'
import type { UserSummary } from '../../types'
import { cn, formatAddress } from '../../lib/utils'
import { Avatar } from '../ui'

export interface UserBadgeProps {
  user: UserSummary
  onClick?: (user: UserSummary) => void
  className?: string
}

function UserBadge({ user, onClick, className }: UserBadgeProps) {
  return (
    <button
      onClick={() => onClick?.(user)}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full py-0.5 pl-0.5 pr-2.5',
        'transition-colors duration-150 hover:bg-zinc-100 dark:hover:bg-zinc-800',
        className,
      )}
    >
      <Avatar src={user.avatar} alt={user.displayName} size="sm" className="h-5 w-5" />
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {user.displayName || formatAddress(user.address)}
      </span>
      {user.isVerified && (
        <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-brand-500" />
      )}
    </button>
  )
}

export { UserBadge }
