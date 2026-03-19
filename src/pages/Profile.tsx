import { useParams, Link } from 'react-router-dom'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Copy, Check, PaperPlaneTilt, ArrowDown, X, ArrowSquareOut } from '@phosphor-icons/react'
import { useOneId } from '@explorills/one-id-auth'
import { NFTCard } from '@/components/nft/NFTCard'
import { Button } from '@/components/ui/Button'
import { users, nfts, activities } from '@/data/mock'
import { formatCompact, formatAddress, timeAgo } from '@/lib/utils'
import type { NFT } from '@/types'

const TABS = ['Owned', 'Activity'] as const

function SendModal({ nft, onClose }: { nft: NFT; onClose: () => void }) {
  const [recipient, setRecipient] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = () => {
    if (!recipient.trim()) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      onClose()
    }, 1500)
  }

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md bg-background border border-border rounded-xl shadow-[0_0_40px_oklch(0.72_0.17_195/0.1)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold">Send NFT</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
            <img src={nft.image} alt={nft.name} className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <p className="text-sm font-medium">{nft.name}</p>
              <p className="text-[11px] text-muted-foreground">{nft.collection.name}</p>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-muted-foreground uppercase tracking-wider block mb-1.5">Recipient address</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSend}
            disabled={!recipient.trim() || sending}
          >
            {sending ? 'Sending...' : 'Confirm Send'}
            {!sending && <PaperPlaneTilt size={16} />}
          </Button>
        </div>
      </div>
    </>
  )
}

export default function Profile() {
  const { address } = useParams()
  const navigate = useNavigate()
  const { user: oneIdUser, apiUrl } = useOneId()
  const [tab, setTab] = useState<typeof TABS[number]>('Owned')
  const [copied, setCopied] = useState(false)
  const [sendingNft, setSendingNft] = useState<NFT | null>(null)

  const onNFT = useCallback((nft: NFT) => navigate(`/nft/${nft.id}`), [navigate])

  // Check if viewing own profile (connected user's wallet address)
  const isOwnProfile = !!oneIdUser && oneIdUser.wallets.some(
    (w) => w.address.toLowerCase() === address?.toLowerCase()
  )

  // Resolve avatar URL from ONE ID data
  const oneIdAvatar = oneIdUser?.avatarUrl
    ? (oneIdUser.avatarUrl.startsWith('/') ? `${apiUrl}${oneIdUser.avatarUrl}` : oneIdUser.avatarUrl)
    : oneIdUser ? `https://api.dicebear.com/9.x/rings/svg?seed=${oneIdUser.username}` : undefined

  // Build profile from ONE ID (own) or mock data (other users)
  const mockUser = users.find((u) => u.address === address)

  const profile = isOwnProfile && oneIdUser ? {
    address: address!,
    displayName: oneIdUser.displayName,
    avatar: oneIdAvatar!,
    banner: undefined as string | undefined,
    bio: undefined as string | undefined,
    isVerified: false,
  } : mockUser ? {
    address: mockUser.address,
    displayName: mockUser.displayName,
    avatar: mockUser.avatar,
    banner: mockUser.banner,
    bio: mockUser.bio,
    isVerified: mockUser.isVerified,
  } : null

  if (!profile) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-muted-foreground">User not found</p>
        <Link to="/" className="text-primary text-sm mt-2 inline-block">Home</Link>
      </div>
    )
  }

  // For own profile, show showcase NFTs to demonstrate full UI
  const owned = isOwnProfile ? nfts.slice(0, 8) : nfts.filter((n) => n.owner.address === profile.address)
  const userActivity = isOwnProfile
    ? activities
    : activities.filter((a) => a.from.address === profile.address || a.to?.address === profile.address)

  // Stats — showcase values for own profile, real mock data for others
  const stats = mockUser && !isOwnProfile
    ? { volume: mockUser.stats.totalVolume, sales: mockUser.stats.totalSales, owned: mockUser.stats.nftsOwned, followers: mockUser.stats.followers }
    : { volume: 12.5, sales: 8, owned: owned.length, followers: 42 }

  const copyAddress = () => {
    navigator.clipboard.writeText(profile.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div>
      {/* Banner */}
      <div className="h-32 sm:h-44 bg-secondary overflow-hidden">
        {profile.banner && <img src={profile.banner} alt="" className="h-full w-full object-cover" />}
      </div>

      <div className="container mx-auto px-4 sm:px-6 -mt-10 relative z-10 pb-16">
        {/* Avatar + Info + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div className="flex items-end gap-4">
            <img src={profile.avatar} alt={profile.displayName} className="w-20 h-20 rounded-xl border-4 border-background object-cover" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{profile.displayName}</h1>
                {profile.isVerified && <ShieldCheck size={18} weight="fill" className="text-primary" />}
              </div>
              <button onClick={copyAddress} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono mt-0.5 cursor-pointer">
                {formatAddress(profile.address)}
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          {/* Send / Receive */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (owned.length > 0) setSendingNft(owned[0])
              }}
            >
              <PaperPlaneTilt size={15} /> Send
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAddress}
            >
              <ArrowDown size={15} /> Receive
            </Button>
            <a
              href={`https://flarescan.com/address/${profile.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
            >
              <ArrowSquareOut size={14} />
            </a>
          </div>
        </div>

        {profile.bio && <p className="text-sm text-muted-foreground mb-6 max-w-lg">{profile.bio}</p>}

        {/* Stats inline */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar border-y border-border py-3 mb-8">
          {[
            { label: 'Volume', value: `${formatCompact(stats.volume)} ETH` },
            { label: 'Sales', value: formatCompact(stats.sales) },
            { label: 'Owned', value: formatCompact(stats.owned) },
            { label: 'Followers', value: formatCompact(stats.followers) },
          ].map((s) => (
            <div key={s.label} className="shrink-0">
              <p className="font-mono text-sm font-bold tabular-nums">{s.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
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
            {owned.map((nft) => (
              <div key={nft.id} className="group relative">
                <NFTCard nft={nft} onClick={onNFT} />
                <button
                  onClick={(e) => { e.stopPropagation(); setSendingNft(nft) }}
                  className="absolute top-2 left-2 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-primary/80"
                  title="Send"
                >
                  <PaperPlaneTilt size={13} />
                </button>
              </div>
            ))}
            {owned.length === 0 && <p className="col-span-full text-sm text-muted-foreground text-center py-12">No items</p>}
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

      {/* Send Modal */}
      {sendingNft && <SendModal nft={sendingNft} onClose={() => setSendingNft(null)} />}
    </div>
  )
}
