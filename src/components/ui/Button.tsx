import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500 dark:active:bg-brand-700',
  secondary:
    'bg-zinc-200 text-zinc-900 hover:bg-zinc-300 active:bg-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:active:bg-zinc-600',
  outline:
    'border border-zinc-300 text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700',
  ghost:
    'text-zinc-600 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:active:bg-zinc-700',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-md',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-lg',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors duration-150 ease-in-out focus-ring select-none',
          variantClasses[variant],
          sizeClasses[size],
          (disabled || loading) && 'pointer-events-none opacity-50',
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize }
