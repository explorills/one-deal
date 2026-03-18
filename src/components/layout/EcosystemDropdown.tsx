import { useState, useRef, useEffect } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { ECOSYSTEM_LINKS } from '@/lib/constants'

export function EcosystemDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary border border-border rounded-lg transition-all duration-200 cursor-pointer"
      >
        ONE ecosystem
        <CaretDown size={14} weight="bold" className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex sm:hidden items-center justify-center w-9 h-9 border border-primary/50 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-200 cursor-pointer"
      >
        <CaretDown size={16} weight="bold" className={`text-primary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 py-1.5 bg-card border border-border rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_20px_oklch(0.72_0.17_195/0.1)] backdrop-blur-xl overflow-hidden z-50">
          {ECOSYSTEM_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-primary/10 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
