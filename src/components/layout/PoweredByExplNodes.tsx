import { useState } from 'react'

const STYLES = {
  fontFamily: "'Roboto Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
  sizes: {
    sm: { fontSize: '10px', paddingX: '8px', paddingY: '4px', borderRadius: '4px' },
    md: { fontSize: '12px', paddingX: '12px', paddingY: '6px', borderRadius: '6px' },
  },
} as const

export function PoweredByExplNodes({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const [hovered, setHovered] = useState(false)
  const s = STYLES.sizes[size]

  return (
    <a
      href="https://node.expl.one"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        fontFamily: STYLES.fontFamily,
        fontSize: s.fontSize,
        fontWeight: 400,
        color: '#ffffff',
        textDecoration: 'none',
        padding: `${s.paddingY} ${s.paddingX}`,
        backgroundColor: hovered ? 'oklch(0.18 0.04 252 / 0.8)' : 'oklch(0.18 0.04 252)',
        border: '1px solid var(--primary)',
        borderRadius: s.borderRadius,
        boxShadow: hovered
          ? '0 4px 8px rgba(0,0,0,0.4), 0 0 12px oklch(0.72 0.17 195 / 0.6), inset 0 1px 0 rgba(255,255,255,0.15)'
          : '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        transform: hovered ? 'translateY(-1px) scale(1.1)' : 'translateY(0) scale(1)',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      // Powered by EXPL Nodes
    </a>
  )
}
