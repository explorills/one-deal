import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { NetworkBadge } from '@/components/ui/NetworkBadge'
import type { ApiCollection } from '@/lib/api'

interface CollectionCardProps {
  collection: ApiCollection
  index?: number
}

export function CollectionCard({ collection, index = 0 }: CollectionCardProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigate(`/collection/${collection.chain}/${collection.address}`)}
      className="relative shrink-0 w-56 sm:w-64 cursor-pointer group"
    >
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary">
        {collection.image_url ? (
          <img
            src={collection.image_url}
            alt={collection.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-3xl font-bold text-muted-foreground/30">{collection.symbol || '?'}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute top-2.5 right-2.5">
          <NetworkBadge chain={collection.chain} />
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-sm font-semibold text-white leading-tight truncate">{collection.name || collection.symbol}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[11px] text-white/70 font-mono">{collection.total_supply} items</span>
            <span className="text-[11px] text-white/70 font-mono">{collection.type}</span>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/5 transition-all duration-300 group-hover:ring-primary/30" />
    </motion.div>
  )
}
