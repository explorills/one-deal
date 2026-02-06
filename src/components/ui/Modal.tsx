import { useEffect, useCallback, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  size?: ModalSize
  children: ReactNode
  className?: string
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

function Modal({ open, onClose, title, size = 'md', children, className }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = ''
      }
    }
  }, [open, handleEscape])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="backdrop-enter fixed inset-0 bg-black/60 dark:bg-black/70"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={cn(
          'modal-enter relative z-10 w-full rounded-xl border shadow-2xl',
          'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800',
          'max-h-[85vh] overflow-y-auto',
          sizeClasses[size],
          className,
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-zinc-400 transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-600 focus-ring dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              aria-label="Close"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export { Modal, type ModalProps, type ModalSize }
