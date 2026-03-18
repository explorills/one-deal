import { useParams, Link } from 'react-router-dom'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck } from '@phosphor-icons/react'
import { NFTCard } from '@/components/nft/NFTCard'
import { collections, nfts } from '@/data/mock'
import { formatCompact } from '@/lib/utils'
import type { NFT } from '@/types'

export default function CollectionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const col = collections.find((c) => c.id === id)
  const colNfts = nfts.filter((n) => n.collection.id === id)

  const onNFT = useCallback((nft: NFT) => navigate(`/nft/${nft.id}`), [navigate])

  if (!col) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-muted-foreground">Collection not found</p>
        <Link to="/explore" className="text-primary text-sm mt-2 inline-block">Back to Explore</Link>
      </div>
    )
  }

  const stats = [
    { label: 'Floor', value: `${col.stats.floorPrice} ETH` },
    { label: 'Volume', value: `${formatCompact(col.stats.totalVolume)} ETH` },
    { label: 'Items', value: formatCompact(col.stats.items) },
    { label: 'Owners', value: formatCompact(col.stats.owners) },
    { label: 'Listed', value: `${col.stats.listedPercentage}%` },
  ]

  return (
    <div>
      {/* Banner */}
      <div className="relative h-40 sm:h-56 bg-secondary overflow-hidden">
        <img src={col.banner} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft size={16} /> Back
        </Link>

        {/* Collection info */}
        <div className="flex items-center gap-4 mb-6">
          <img src={col.image} alt={col.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-background object-cover" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">{col.name}</h1>
              {col.isVerified && <ShieldCheck size={18} weight="fill" className="text-primary" />}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">by {col.creator.displayName}</p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar border-y border-border py-3 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="shrink-0">
              <p className="font-mono text-sm font-bold tabular-nums">{s.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
          <div className="shrink-0">
            <p className={`font-mono text-sm font-bold tabular-nums ${col.stats.sevenDayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {col.stats.sevenDayChange >= 0 ? '+' : ''}{col.stats.sevenDayChange}%
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">7d</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-8 max-w-2xl">{col.description}</p>

        {/* NFTs grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-16">
          {colNfts.map((nft) => (
            <NFTCard key={nft.id} nft={nft} onClick={onNFT} />
          ))}
        </div>
      </div>
    </div>
  )
}
