import { motion } from 'framer-motion'
import { Heart } from '@phosphor-icons/react'
import type { NFT } from '@/types'
import { formatPrice } from '@/lib/utils'

interface NFTCardProps {
  nft: NFT
  onClick?: (nft: NFT) => void
}

export function NFTCard({ nft, onClick }: NFTCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick?.(nft)}
      className="group cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
        <img
          src={nft.image}
          alt={nft.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Price overlay — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 pt-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] text-white/60 font-mono">{nft.collection.name}</p>
              <p className="text-sm font-semibold text-white leading-tight">{nft.name}</p>
            </div>
            <span className="text-sm font-bold text-primary font-mono tabular-nums">
              {formatPrice(nft.price, nft.currency)}
            </span>
          </div>
        </div>
        {/* Likes — top right */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-2 py-1 text-[11px] text-white/80">
          <Heart size={12} weight="fill" className="text-primary" />
          {nft.likes}
        </div>
        {/* Hover glow */}
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/5 transition-all duration-300 group-hover:ring-primary/30 group-hover:shadow-[inset_0_0_30px_oklch(0.72_0.17_195/0.1)]" />
      </div>
    </motion.div>
  )
}
