import { SUPPORTED_CHAINS } from '@/lib/constants'

const CHAIN_COLORS: Record<string, string> = {
  flare: 'bg-[#E42058]/15 text-[#E42058] border-[#E42058]/20',
  songbird: 'bg-[#F5A623]/15 text-[#F5A623] border-[#F5A623]/20',
}

export function NetworkBadge({ chain, size = 'sm' }: { chain: string; size?: 'sm' | 'md' }) {
  const config = SUPPORTED_CHAINS[chain as keyof typeof SUPPORTED_CHAINS]
  const name = config?.name || chain
  const colors = CHAIN_COLORS[chain] || 'bg-secondary text-muted-foreground border-border'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-mono uppercase tracking-wider ${colors} ${
      size === 'sm' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'
    }`}>
      {name}
    </span>
  )
}
