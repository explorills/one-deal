import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, iconLeft, iconRight, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
              {iconLeft}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'h-10 w-full rounded-lg border bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400',
              'transition-colors duration-150 ease-in-out',
              'focus-ring',
              'dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500',
              error
                ? 'border-error dark:border-error'
                : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600',
              iconLeft && 'pl-10',
              iconRight && 'pr-10',
              className,
            )}
            {...props}
          />
          {iconRight && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
              {iconRight}
            </span>
          )}
        </div>
        {error && (
          <p className="text-sm text-error">{error}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
export { Input, type InputProps }
