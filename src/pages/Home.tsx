import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MagnifyingGlass } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { CollectionCard } from '@/components/nft/CollectionCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { fetchRecentlyActive, precacheCollectionNfts } from '@/lib/api'
import type { ApiCollection } from '@/lib/api'

const ease = [0.22, 1, 0.36, 1] as const
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }

export default function Home() {
  const navigate = useNavigate()
  const [flareCollections, setFlareCollections] = useState<ApiCollection[]>([])
  const [songbirdCollections, setSongbirdCollections] = useState<ApiCollection[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch only 12 per chain — nothing else
  useEffect(() => {
    Promise.all([
      fetchRecentlyActive('flare', 12).then(setFlareCollections),
      fetchRecentlyActive('songbird', 12).then(setSongbirdCollections),
    ]).finally(() => setLoading(false))
  }, [])

  // Pre-cache first 24 NFTs of each visible collection (background, after load)
  useEffect(() => {
    if (loading) return
    ;[...flareCollections, ...songbirdCollections].forEach((col) => {
      precacheCollectionNfts(col.chain, col.address, 24)
    })
  }, [loading, flareCollections, songbirdCollections])

  return (
    <div className="flex flex-col">
      {/* ===== HERO ===== */}
      <section className="relative flex items-center justify-center px-4 sm:px-6 py-16 sm:py-24 overflow-hidden">
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

      {/* ===== RECENTLY ACTIVE ===== */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold">Recently Active</h2>
          <p className="text-sm text-muted-foreground mt-1">Collections with the most recent activity</p>
        </div>

        {/* Flare Network Carousel */}
        <ChainCarousel
          label="Flare Network"
          chain="flare"
          collections={flareCollections}
          loading={loading}
        />

        {/* Songbird Network Carousel */}
        <div className="mt-10">
          <ChainCarousel
            label="Songbird Network"
            chain="songbird"
            collections={songbirdCollections}
            loading={loading}
          />
        </div>
      </section>
    </div>
  )
}

function ChainCarousel({
  label,
  chain,
  collections,
  loading,
}: {
  label: string
  chain: string
  collections: ApiCollection[]
  loading: boolean
}) {
  return (
    <div>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{label}</h3>
          <Link
            to={`/explore?chain=${chain}`}
            className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 sm:px-6 pb-2">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shrink-0 w-56 sm:w-64">
              <Skeleton className="aspect-[4/3] rounded-xl" />
            </div>
          ))
        ) : collections.length > 0 ? (
          collections.map((col, i) => (
            <CollectionCard key={`${col.chain}-${col.address}`} collection={col} index={i} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground py-8">No collections found</p>
        )}
      </div>
    </div>
  )
}
