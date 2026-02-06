import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface Tab {
  id: string
  label: string
  icon?: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
}

function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        'flex gap-1 border-b border-zinc-200 dark:border-zinc-800',
        className,
      )}
      role="tablist"
    >
      {tabs.map(tab => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-150',
              'focus-ring rounded-t-md',
              isActive
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200',
            )}
          >
            {tab.icon}
            {tab.label}
            {isActive && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-600 dark:bg-brand-400" />
            )}
          </button>
        )
      })}
    </div>
  )
}

export { Tabs, type TabsProps, type Tab }
