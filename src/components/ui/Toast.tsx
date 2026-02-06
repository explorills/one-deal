import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  exiting?: boolean
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const iconMap: Record<ToastType, ReactNode> = {
  success: (
    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
  ),
}

const bgClasses: Record<ToastType, string> = {
  success: 'border-green-200 dark:border-green-800/50',
  error: 'border-red-200 dark:border-red-800/50',
  info: 'border-blue-200 dark:border-blue-800/50',
}

let toastCounter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, exiting: true } : t)))
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 200)
  }, [])

  const toast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = `toast-${++toastCounter}`
      setToasts(prev => [...prev, { id, type, message }])
      const timer = setTimeout(() => removeToast(id), 4000)
      timersRef.current.set(id, timer)
    },
    [removeToast],
  )

  const dismiss = useCallback(
    (id: string) => {
      const timer = timersRef.current.get(id)
      if (timer) {
        clearTimeout(timer)
        timersRef.current.delete(id)
      }
      removeToast(id)
    },
    [removeToast],
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={cn(
              'flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg',
              'bg-white dark:bg-zinc-900',
              bgClasses[t.type],
              t.exiting ? 'toast-exit' : 'toast-enter',
            )}
          >
            {iconMap[t.type]}
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {t.message}
            </p>
            <button
              onClick={() => dismiss(t.id)}
              className="ml-2 rounded p-0.5 text-zinc-400 transition-colors duration-150 hover:text-zinc-600 dark:hover:text-zinc-200"
              aria-label="Dismiss"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
