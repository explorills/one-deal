import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MagnifyingGlass, Lightning, Cube } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { CollectionCard } from '@/components/nft/CollectionCard'
import { NFTCard } from '@/components/nft/NFTCard'
import { NetworkBadge } from '@/components/ui/NetworkBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { fetchStats, fetchCollections, fetchListings } from '@/lib/api'
import type { ApiStats, ApiCollection, ApiListing } from '@/lib/api'
import { SUPPORTED_CHAINS } from '@/lib/constants'
import { formatAddress, timeAgo } from '@/lib/utils'
import { formatEther } from 'viem'

const ease = [0.22, 1, 0.36, 1] as const
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    if (animated.current || value === 0) return
    animated.current = true
    const duration = 1200
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(step)
      else setDisplay(value)
    }
    requestAnimationFrame(step)
  }, [value])

  const formatted = display >= 1_000_000
    ? `${(display / 1_000_000).toFixed(1)}M`
    : display >= 1_000
      ? `${(display / 1_000).toFixed(1)}K`
      : display.toString()

  return <span ref={ref}>{formatted}{suffix}</span>
}

export default function Home() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<ApiStats | null>(null)
  const [collections, setCollections] = useState<ApiCollection[]>([])
  const [recentListings, setRecentListings] = useState<ApiListing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      fetchStats().then(setStats),
      fetchCollections().then(setCollections),
      fetchListings(undefined, 8).then(setRecentListings),
    ]).finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col">
      {/* ===== HERO ===== */}
      <section className="relative flex items-center justify-center px-4 sm:px-6 py-20 sm:py-32 lg:py-40 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl text-center">
          <motion.p variants={fadeUp} className="text-xs sm:text-sm font-mono text-primary tracking-[0.3em] uppercase mb-4">
            Flare &middot; Songbird Marketplace
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
            The premier NFT marketplace for Flare and Songbird networks.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={() => navigate('/explore')}>
              <MagnifyingGlass size={18} weight="bold" />
              Explore
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== LIVE STATS ===== */}
      <section className="border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 shrink-0">
                <Skeleton className="w-14 h-5" />
                <Skeleton className="w-16 h-3" />
              </div>
            ))
          ) : (
            <>
              <StatItem label="Collections" value={<AnimatedCounter value={stats?.collections || 0} />} />
              <StatItem label="NFTs" value={<AnimatedCounter value={stats?.totalNFTs || 0} />} />
              <StatItem label="Listed" value={<AnimatedCounter value={stats?.activeListings || 0} />} />
              <StatItem label="Sales" value={<AnimatedCounter value={stats?.totalSales || 0} />} />
            </>
          )}
        </div>
      </section>

      {/* ===== COLLECTIONS CAROUSEL ===== */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-bold">Collections</h2>
            <Link to="/explore" className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 sm:px-6 pb-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shrink-0 w-56 sm:w-64">
                <Skeleton className="aspect-[4/3] rounded-xl" />
              </div>
            ))
          ) : collections.length > 0 ? (
            collections.map((col, i) => (
              <CollectionCard key={`${col.chain}-${col.address}`} collection={col} index={i} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground py-8">No collections yet</p>
          )}
        </div>
      </section>

      {/* ===== RECENT LISTINGS ===== */}
      {recentListings.length > 0 && (
        <section className="py-10 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg sm:text-xl font-bold">Recently Listed</h2>
              <Link to="/explore" className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {recentListings.map((listing, i) => (
                <NFTCard key={`${listing.chain}-${listing.address}-${listing.token_id}`} listing={listing} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== RECENT ACTIVITY FEED ===== */}
      {recentListings.length > 0 && (
        <section className="py-10 sm:py-16 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-lg sm:text-xl font-bold mb-5">Recent Activity</h2>
            <div className="border border-border rounded-xl overflow-hidden">
              {recentListings.slice(0, 6).map((listing) => {
                const chainConfig = SUPPORTED_CHAINS[listing.chain as keyof typeof SUPPORTED_CHAINS]
                const symbol = chainConfig?.symbol || listing.chain.toUpperCase()
                let price = '0'
                try { price = parseFloat(formatEther(BigInt(listing.price))).toFixed(3) } catch {}
                return (
                  <div
                    key={`act-${listing.chain}-${listing.address}-${listing.token_id}`}
                    onClick={() => navigate(`/nft/${listing.chain}/${listing.address}/${listing.token_id}`)}
                    className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-secondary overflow-hidden shrink-0">
                        {listing.image_url && (
                          <img src={listing.image_url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{listing.name || `#${listing.token_id}`}</p>
                        <p className="text-[11px] text-muted-foreground font-mono truncate">{listing.collection_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        listed
                      </span>
                      <span className="text-sm font-mono tabular-nums">{price} {symbol}</span>
                      <NetworkBadge chain={listing.chain} />
                      <span className="text-[10px] text-muted-foreground font-mono hidden sm:inline">{timeAgo(listing.listed_at)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-10 sm:py-16 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-lg sm:text-xl font-bold mb-8 text-center">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
            {[
              { icon: Lightning, step: '01', title: 'Connect', desc: 'Link your wallet via ONE ID to get started.' },
              { icon: MagnifyingGlass, step: '02', title: 'Discover', desc: 'Browse collections across Flare and Songbird.' },
              { icon: Cube, step: '03', title: 'Trade', desc: 'Buy, sell, and transfer with instant settlement.' },
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
            Join creators and collectors on the Flare and Songbird NFT marketplace.
          </p>
          <Button size="lg" onClick={() => navigate('/explore')}>
            Get Started <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="font-mono text-sm sm:text-base font-bold tabular-nums text-foreground">{value}</span>
      <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
  )
}
