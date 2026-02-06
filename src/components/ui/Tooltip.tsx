import { type ReactNode, type HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  content: string
  position?: TooltipPosition
  children: ReactNode
}

const positionClasses: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

function Tooltip({ content, position = 'top', children, className, ...props }: TooltipProps) {
  return (
    <div className={cn('group relative inline-flex', className)} {...props}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-50 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium',
          'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900',
          'opacity-0 transition-opacity duration-150 ease-in-out group-hover:opacity-100',
          positionClasses[position],
        )}
      >
        {content}
      </span>
    </div>
  )
}

export { Tooltip, type TooltipProps, type TooltipPosition }
