import { useParams, Link } from 'react-router-dom'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Copy, Check } from '@phosphor-icons/react'
import { NFTCard } from '@/components/nft/NFTCard'
import { users, nfts, activities } from '@/data/mock'
import { formatCompact, formatAddress, timeAgo } from '@/lib/utils'
import type { NFT } from '@/types'

const TABS = ['Owned', 'Created', 'Activity'] as const

export default function Profile() {
  const { address } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState<typeof TABS[number]>('Owned')
  const [copied, setCopied] = useState(false)

  const user = users.find((u) => u.address === address)
  const onNFT = useCallback((nft: NFT) => navigate(`/nft/${nft.id}`), [navigate])

  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-muted-foreground">User not found</p>
        <Link to="/" className="text-primary text-sm mt-2 inline-block">Home</Link>
      </div>
    )
  }

  const owned = nfts.filter((n) => n.owner.address === user.address)
  const created = nfts.filter((n) => n.creator.address === user.address)
  const userActivity = activities.filter((a) => a.from.address === user.address || a.to?.address === user.address)

  const copyAddress = () => {
    navigator.clipboard.writeText(user.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div>
      {/* Banner */}
      <div className="h-32 sm:h-44 bg-secondary overflow-hidden">
        {user.banner && <img src={user.banner} alt="" className="h-full w-full object-cover" />}
      </div>

      <div className="container mx-auto px-4 sm:px-6 -mt-10 relative z-10 pb-16">
        {/* Avatar + Info */}
        <div className="flex items-end gap-4 mb-6">
          <img src={user.avatar} alt={user.displayName} className="w-20 h-20 rounded-xl border-4 border-background object-cover" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{user.displayName}</h1>
              {user.isVerified && <ShieldCheck size={18} weight="fill" className="text-primary" />}
            </div>
            <button onClick={copyAddress} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono mt-0.5">
              {formatAddress(user.address)}
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            </button>
          </div>
        </div>

        {user.bio && <p className="text-sm text-muted-foreground mb-6 max-w-lg">{user.bio}</p>}

        {/* Stats inline */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar border-y border-border py-3 mb-8">
          {[
            { label: 'Volume', value: `${formatCompact(user.stats.totalVolume)} ETH` },
            { label: 'Sales', value: formatCompact(user.stats.totalSales) },
            { label: 'Owned', value: formatCompact(user.stats.nftsOwned) },
            { label: 'Created', value: formatCompact(user.stats.nftsCreated) },
            { label: 'Followers', value: formatCompact(user.stats.followers) },
          ].map((s) => (
            <div key={s.label} className="shrink-0">
              <p className="font-mono text-sm font-bold tabular-nums">{s.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs — micro dots on mobile, text on desktop */}
        <div className="flex items-center gap-1 mb-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                tab === t
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'Owned' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {owned.map((nft) => <NFTCard key={nft.id} nft={nft} onClick={onNFT} />)}
            {owned.length === 0 && <p className="col-span-full text-sm text-muted-foreground text-center py-12">No items</p>}
          </div>
        )}
        {tab === 'Created' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {created.map((nft) => <NFTCard key={nft.id} nft={nft} onClick={onNFT} />)}
            {created.length === 0 && <p className="col-span-full text-sm text-muted-foreground text-center py-12">No items</p>}
          </div>
        )}
        {tab === 'Activity' && (
          <div className="border border-border rounded-xl overflow-hidden">
            {userActivity.map((act) => (
              <div key={act.id} className="flex items-center justify-between px-3 py-2.5 border-b border-border last:border-b-0 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <img src={act.nft.image} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{act.nft.name}</p>
                    <span className="font-mono text-[10px] text-muted-foreground uppercase">{act.type}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {act.price && <p className="font-mono tabular-nums">{act.price} {act.currency}</p>}
                  <p className="text-[10px] text-muted-foreground font-mono">{timeAgo(act.timestamp)}</p>
                </div>
              </div>
            ))}
            {userActivity.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No activity</p>}
          </div>
        )}
      </div>
    </div>
  )
}
