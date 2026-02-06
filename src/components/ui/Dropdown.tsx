import { useState, useRef, useEffect, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface DropdownItem {
  id: string
  label: string
  icon?: ReactNode
  danger?: boolean
  disabled?: boolean
}

interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  onSelect: (itemId: string) => void
  align?: 'left' | 'right'
  className?: string
}

function Dropdown({ trigger, items, onSelect, align = 'left', className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <div onClick={() => setOpen(o => !o)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1 min-w-[160px] rounded-lg border py-1 shadow-lg',
            'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800',
            'transition-opacity duration-150 ease-in-out',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {items.map(item => (
            <button
              key={item.id}
              disabled={item.disabled}
              onClick={() => {
                onSelect(item.id)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors duration-150',
                item.disabled && 'pointer-events-none opacity-50',
                item.danger
                  ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                  : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export { Dropdown, type DropdownProps, type DropdownItem }
