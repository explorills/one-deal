import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Wallet, Search, ShoppingBag } from 'lucide-react'
import { Button } from '../components/ui'
import { NFTCard } from '../components/nft/NFTCard'
import { CountdownTimer } from '../components/nft/CountdownTimer'
import { CollectionCard } from '../components/collection/CollectionCard'
import { UserCard } from '../components/user/UserCard'
import { nfts, collections, users } from '../data/mock'
import { formatCompactNumber } from '../lib/utils'
import { useNavigate } from 'react-router-dom'

// --- Animated counter hook ---
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const start = performance.now()
    let raf: number
    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out
      const eased = 1 - (1 - progress) ** 3
      setCount(Math.floor(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, target, duration])

  return { count, ref }
}

function StatBox({ label, value, suffix = '' }: { label: string; value: number; suffix?: string }) {
  const { count, ref } = useCountUp(value)
  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <span className="text-2xl font-bold text-zinc-900 tabular-nums dark:text-zinc-100 sm:text-3xl">
        {formatCompactNumber(count)}{suffix}
      </span>
      <span className="text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">{label}</span>
    </div>
  )
}

// --- Section header ---
function SectionHeader({ title, href, linkText = 'View all' }: { title: string; href?: string; linkText?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between sm:mb-6">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">{title}</h2>
      {href && (
        <Link
          to={href}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition-colors duration-150 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          {linkText}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()

  const handleNFTClick = useCallback(
    (nft: { id: string }) => navigate(`/nft/${nft.id}`),
    [navigate],
  )
  const handleCollectionClick = useCallback(
    (col: { id: string }) => navigate(`/collection/${col.id}`),
    [navigate],
  )
  const handleUserClick = useCallback(
    (user: { address: string }) => navigate(`/profile/${user.address}`),
    [navigate],
  )

  const featuredNFTs = nfts.slice(0, 6)
  const trendingCollections = collections
  const topSellers = users.slice().sort((a, b) => b.stats.totalVolume - a.stats.totalVolume)
  const notableDrops = nfts.filter(n => n.listingExpiry).slice(0, 3)

  return (
    <div className="flex flex-col gap-12 pb-16 sm:gap-16">
      {/* ===== Hero ===== */}
      <section className="relative -mx-4 -mt-6 overflow-hidden px-4 py-16 sm:-mx-6 sm:px-6 sm:py-24 lg:py-32">
        {/* Animated gradient background */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(59,130,246,0.10) 50%, rgba(124,58,237,0.08) 100%)',
            animation: 'heroGradient 8s ease-in-out infinite alternate',
          }}
        />
        <style>{`
          @keyframes heroGradient {
            0% { filter: hue-rotate(0deg) brightness(1); }
            100% { filter: hue-rotate(30deg) brightness(1.05); }
          }
        `}</style>

        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl lg:text-6xl">
            Discover, Collect &amp; Sell{' '}
            <span className="bg-gradient-to-r from-brand-500 to-blue-500 bg-clip-text text-transparent">
              Extraordinary NFTs
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
            The premier marketplace for unique digital assets. Explore, trade, and create on ONE&nbsp;Deal.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={() => navigate('/explore')}>
              <Search className="h-5 w-5" />
              Explore
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/create')}>
              Create
            </Button>
          </div>
        </div>
      </section>

      {/* ===== Stats Bar ===== */}
      <section className="grid grid-cols-2 gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-4 sm:gap-8">
        <StatBox label="Total NFTs" value={24500} />
        <StatBox label="Collections" value={1200} />
        <StatBox label="Users" value={52000} />
        <StatBox label="Volume" value={38400} suffix=" ETH" />
      </section>

      {/* ===== Trending Collections ===== */}
      <section>
        <SectionHeader title="Trending Collections" href="/explore" />
        <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
          {trendingCollections.map(col => (
            <CollectionCard
              key={col.id}
              collection={col}
              onClick={handleCollectionClick}
              className="w-64 shrink-0 sm:w-72"
            />
          ))}
        </div>
      </section>

      {/* ===== Top Sellers ===== */}
      <section>
        <SectionHeader title="Top Sellers" href="/rankings" />
        <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
          {topSellers.map((user, i) => (
            <div key={user.address} className="relative shrink-0">
              <span className="absolute -left-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <UserCard user={user} onClick={handleUserClick} className="w-44 sm:w-48" />
            </div>
          ))}
        </div>
      </section>

      {/* ===== Featured NFTs ===== */}
      <section>
        <SectionHeader title="Featured NFTs" href="/explore" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredNFTs.map(nft => (
            <NFTCard key={nft.id} nft={nft} onClick={handleNFTClick} />
          ))}
        </div>
      </section>

      {/* ===== Notable Drops ===== */}
      <section>
        <SectionHeader title="Notable Drops" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {notableDrops.map(nft => (
            <div
              key={nft.id}
              onClick={() => handleNFTClick(nft)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all duration-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{nft.name}</span>
                  {nft.listingExpiry && (
                    <CountdownTimer
                      endTime={nft.listingExpiry}
                      className="[&_span]:text-white [&_div]:text-white"
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{nft.collection.name}</span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {nft.price} {nft.currency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== How it Works ===== */}
      <section>
        <SectionHeader title="How it Works" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Wallet, title: 'Connect Wallet', desc: 'Link your crypto wallet to get started in seconds.' },
            { icon: Search, title: 'Browse & Discover', desc: 'Explore a vast collection of unique digital assets.' },
            { icon: ShoppingBag, title: 'Buy & Sell', desc: 'Trade NFTs securely with instant settlement.' },
          ].map((step, i) => (
            <div
              key={step.title}
              className="flex flex-col items-center gap-3 rounded-xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40">
                <step.icon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              </div>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400">STEP {i + 1}</span>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{step.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA Banner ===== */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-blue-600 px-6 py-12 text-center sm:py-16">
        <div className="relative z-10">
          <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
            Start your NFT journey today
          </h2>
          <p className="mx-auto mb-6 max-w-md text-sm text-white/80 sm:text-base">
            Join thousands of creators and collectors on the most trusted NFT marketplace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-white text-brand-700 hover:bg-white/90 dark:bg-white dark:text-brand-700 dark:hover:bg-white/90"
              onClick={() => navigate('/explore')}
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
