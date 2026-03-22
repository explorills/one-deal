import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, Check, ArrowSquareOut } from '@phosphor-icons/react'
import { useOneId } from '@explorills/one-ecosystem-ui'
import { NFTCard } from '@/components/nft/NFTCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { fetchUserHoldings } from '@/lib/api'
import type { ApiNft } from '@/lib/api'
import { formatAddress } from '@/lib/utils'

export default function Profile() {
  const { address } = useParams()
  const navigate = useNavigate()
  const { user: oneIdUser, apiUrl } = useOneId()
  const [copied, setCopied] = useState(false)
  const [holdings, setHoldings] = useState<ApiNft[]>([])
  const [loading, setLoading] = useState(true)

  // Check if viewing own profile
  const isOwnProfile = !!oneIdUser && oneIdUser.wallets.some(
    (w: any) => w.address.toLowerCase() === address?.toLowerCase()
  )

  // Resolve avatar URL from ONE ID data
  const oneIdAvatar = oneIdUser?.avatarUrl
    ? (oneIdUser.avatarUrl.startsWith('/') ? `${apiUrl}${oneIdUser.avatarUrl}` : oneIdUser.avatarUrl)
    : oneIdUser ? `https://api.dicebear.com/9.x/rings/svg?seed=${oneIdUser.username}` : undefined

  const displayName = isOwnProfile && oneIdUser ? oneIdUser.displayName : formatAddress(address || '')
  const avatar = isOwnProfile ? oneIdAvatar : undefined

  // Fetch holdings
  useEffect(() => {
    if (!address) return
    setLoading(true)
    fetchUserHoldings(address)
      .then(setHoldings)
      .catch(() => setHoldings([]))
      .finally(() => setLoading(false))
  }, [address])

  const copyAddress = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div>
      {/* Banner */}
      <div className="h-32 sm:h-44 bg-secondary overflow-hidden" />

      <div className="container mx-auto px-4 sm:px-6 -mt-10 relative z-10 pb-16">
        {/* Avatar + Info */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-xl border-4 border-background bg-secondary overflow-hidden">
              {avatar ? (
                <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-muted-foreground/30">
                  {(address || '?')[2]}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold">{displayName}</h1>
              <button onClick={copyAddress} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono mt-0.5 cursor-pointer">
                {formatAddress(address || '')}
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://flare-explorer.flare.network/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
            >
              <ArrowSquareOut size={14} />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar border-y border-border py-3 mb-8">
          <div className="shrink-0">
            <p className="font-mono text-sm font-bold tabular-nums">{loading ? '...' : holdings.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Owned</p>
          </div>
          <div className="shrink-0">
            <p className="font-mono text-sm font-bold tabular-nums">{loading ? '...' : holdings.filter(n => n.listing_status === 'active').length}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Listed</p>
          </div>
        </div>

        {/* Holdings */}
        <h2 className="text-sm font-semibold mb-4">Owned NFTs</h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : holdings.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {holdings.map((nft, i) => (
              <NFTCard key={`${nft.chain}-${nft.address}-${nft.token_id}`} nft={nft} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-12">No NFTs found for this address</p>
        )}
      </div>
    </div>
  )
}
