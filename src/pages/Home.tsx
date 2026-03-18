import { useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MagnifyingGlass, Lightning, Cube } from '@phosphor-icons/react'
import { NFTCard } from '@/components/nft/NFTCard'
import { Button } from '@/components/ui/Button'
import { nfts, collections } from '@/data/mock'
import { formatCompact } from '@/lib/utils'
import type { NFT } from '@/types'

const ease = [0.22, 1, 0.36, 1] as const
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }

const STATS = [
  { label: 'NFTs', value: '24.5K' },
  { label: 'Collections', value: '1.2K' },
  { label: 'Users', value: '52K' },
  { label: 'Volume', value: '38.4K ETH' },
]

export default function Home() {
  const navigate = useNavigate()
  const onNFT = useCallback((nft: NFT) => navigate(`/nft/${nft.id}`), [navigate])

  return (
    <div className="flex flex-col">
      {/* ===== HERO — negative space, oversized type ===== */}
      <section className="relative flex items-center justify-center px-4 sm:px-6 py-20 sm:py-32 lg:py-40 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl text-center">
          <motion.p variants={fadeUp} className="text-xs sm:text-sm font-mono text-primary tracking-[0.3em] uppercase mb-4">
            EVM Compatible Marketplace
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[0.95]"
          >
            Discover, trade
            <br />
            <span className="text-primary">extraordinary</span> NFTs
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-5 text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            The premier marketplace for unique digital assets on ONE Deal.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={() => navigate('/explore')}>
              <MagnifyingGlass size={18} weight="bold" />
              Explore
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/create')}>
              Create
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== STATS — single horizontal mono line ===== */}
      <section className="border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-sm sm:text-base font-bold tabular-nums text-foreground">{s.value}</span>
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TRENDING — horizontal scroll edge-bleed ===== */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-bold">Trending Collections</h2>
            <Link to="/explore" className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 sm:px-6 pb-2">
          {collections.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              onClick={() => navigate(`/collection/${col.id}`)}
              className="relative shrink-0 w-56 sm:w-64 cursor-pointer group"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary">
                <img src={col.image} alt={col.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-sm font-semibold text-white leading-tight">{col.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-white/70 font-mono">Floor: {col.stats.floorPrice} ETH</span>
                    <span className={`text-[11px] font-mono ${col.stats.sevenDayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {col.stats.sevenDayChange >= 0 ? '+' : ''}{col.stats.sevenDayChange}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/5 transition-all duration-300 group-hover:ring-primary/30" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FEATURED NFTs — grid ===== */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-bold">Featured</h2>
            <Link to="/explore" className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {nfts.slice(0, 8).map((nft) => (
              <NFTCard key={nft.id} nft={nft} onClick={onNFT} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS — 3 minimal blocks ===== */}
      <section className="py-10 sm:py-16 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-lg sm:text-xl font-bold mb-8 text-center">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
            {[
              { icon: Lightning, step: '01', title: 'Connect', desc: 'Link your wallet via ONE ID to get started.' },
              { icon: MagnifyingGlass, step: '02', title: 'Discover', desc: 'Browse collections and find unique assets.' },
              { icon: Cube, step: '03', title: 'Trade', desc: 'Buy, sell, and auction with instant settlement.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                  <item.icon size={22} weight="duotone" className="text-primary" />
                </div>
                <p className="font-mono text-[10px] text-primary tracking-[0.2em] mb-1">{item.step}</p>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Start your journey
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
            Join creators and collectors on the most trusted EVM marketplace.
          </p>
          <Button size="lg" onClick={() => navigate('/explore')}>
            Get Started <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </div>
  )
}
