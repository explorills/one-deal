import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck } from '@phosphor-icons/react'
import { rankings } from '@/data/mock'
import { formatCompact } from '@/lib/utils'

export default function Rankings() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Rankings</h1>
      <p className="text-sm text-muted-foreground mb-8">Top collections by volume</p>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[3rem_1fr_6rem_6rem_6rem_5rem] items-center px-4 py-3 border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
          <span>#</span>
          <span>Collection</span>
          <span className="text-right">Volume</span>
          <span className="text-right">Floor</span>
          <span className="text-right">Sales</span>
          <span className="text-right">7d</span>
        </div>

        {rankings.map((entry, i) => (
          <motion.div
            key={entry.collection.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <Link
              to={`/collection/${entry.collection.id}`}
              className="grid grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[3rem_1fr_6rem_6rem_6rem_5rem] items-center px-4 py-3 border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors"
            >
              <span className="font-mono text-sm text-muted-foreground tabular-nums">{entry.rank}</span>
              <div className="flex items-center gap-3 min-w-0">
                <img src={entry.collection.image} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium truncate">{entry.collection.name}</span>
                    {entry.collection.isVerified && <ShieldCheck size={14} weight="fill" className="text-primary shrink-0" />}
                  </div>
                  <span className="text-[10px] text-muted-foreground sm:hidden font-mono">
                    {formatCompact(entry.volume)} ETH
                  </span>
                </div>
              </div>
              <span className="hidden sm:block text-right font-mono text-sm tabular-nums">{formatCompact(entry.volume)} ETH</span>
              <span className="hidden sm:block text-right font-mono text-sm tabular-nums">{entry.floorPrice} ETH</span>
              <span className="hidden sm:block text-right font-mono text-sm tabular-nums">{formatCompact(entry.sales)}</span>
              <span className={`text-right font-mono text-sm tabular-nums ${entry.volumeChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {entry.volumeChange >= 0 ? '+' : ''}{entry.volumeChange.toFixed(1)}%
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
