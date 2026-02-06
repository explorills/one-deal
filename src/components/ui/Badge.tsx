import { type HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'outline'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  success:
    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  warning:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  error:
    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  outline:
    'border border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400',
}

function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-150',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge, type BadgeProps, type BadgeVariant }
