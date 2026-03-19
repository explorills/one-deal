import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Eye, ArrowLeft, ArrowSquareOut, ShieldCheck } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { nfts, activities } from '@/data/mock'
import { formatPrice, formatAddress, formatCompact, timeAgo } from '@/lib/utils'

export default function NFTDetail() {
  const { id } = useParams()
  const nft = nfts.find((n) => n.id === id)

  if (!nft) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-muted-foreground">NFT not found</p>
        <Link to="/explore" className="text-primary text-sm mt-2 inline-block">Back to Explore</Link>
      </div>
    )
  }

  const nftActivities = activities.filter((a) => a.nft.id === nft.id)

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft size={16} /> Back
      </Link>

      {/* Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary">
            <img src={nft.image} alt={nft.name} className="h-full w-full object-cover" />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 text-[11px] text-white/80">
                <Heart size={12} weight="fill" className="text-primary" /> {formatCompact(nft.likes)}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 text-[11px] text-white/80">
                <Eye size={12} /> {formatCompact(nft.views)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Data */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-5"
        >
          <div>
            <Link to={`/collection/${nft.collection.id}`} className="text-xs text-primary font-medium hover:underline">
              {nft.collection.name}
              {nft.collection.isVerified && <ShieldCheck size={12} weight="fill" className="inline ml-1 text-primary" />}
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">{nft.name}</h1>
          </div>

          {/* Price block */}
          <div className="rounded-xl border border-border p-4 sm:p-5 bg-card">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Current Price</p>
            <p className="text-3xl sm:text-4xl font-bold font-mono tabular-nums text-primary">
              {nft.price} <span className="text-lg text-foreground">{nft.currency}</span>
            </p>
            {nft.lastSale && (
              <p className="text-[11px] text-muted-foreground mt-1 font-mono">Last sale: {nft.lastSale} {nft.currency}</p>
            )}
            <div className="flex gap-2 mt-4">
              <Button className="flex-1">Buy Now</Button>
            </div>
          </div>

          {/* Owner/Creator */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Owner</p>
              <div className="flex items-center gap-2">
                <img src={nft.owner.avatar} alt="" className="w-6 h-6 rounded-full" />
                <span className="text-xs font-medium truncate">{nft.owner.displayName}</span>
              </div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Creator</p>
              <div className="flex items-center gap-2">
                <img src={nft.creator.avatar} alt="" className="w-6 h-6 rounded-full" />
                <span className="text-xs font-medium truncate">{nft.creator.displayName}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Description</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{nft.description}</p>
          </div>

          {/* Traits */}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Traits</p>
            <div className="flex flex-wrap gap-2">
              {nft.traits.map((t) => (
                <div key={t.traitType} className="rounded-lg border border-border px-3 py-2 bg-card">
                  <p className="text-[10px] text-primary font-mono uppercase">{t.traitType}</p>
                  <p className="text-xs font-medium">{t.value}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{t.rarity}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          {nftActivities.length > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Activity</p>
              <div className="border border-border rounded-lg overflow-hidden">
                {nftActivities.map((act) => (
                  <div key={act.id} className="flex items-center justify-between px-3 py-2.5 border-b border-border last:border-b-0 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded ${
                        act.type === 'sale' ? 'bg-green-500/10 text-green-400' :
                        act.type === 'listing' ? 'bg-primary/10 text-primary' :
                        'bg-secondary text-muted-foreground'
                      }`}>
                        {act.type}
                      </span>
                      <span className="text-muted-foreground">{act.from.displayName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {act.price && <span className="font-mono tabular-nums">{act.price} {act.currency}</span>}
                      <span className="text-muted-foreground font-mono text-[10px]">{timeAgo(act.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
