import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, Check, ArrowSquareOut, PaperPlaneTilt, X, Tag } from '@phosphor-icons/react'
import { useOneId } from '@explorills/one-ecosystem-ui'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'
import { NFTCard } from '@/components/nft/NFTCard'
import { NetworkBadge } from '@/components/ui/NetworkBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { fetchUserHoldings } from '@/lib/api'
import type { ApiNft } from '@/lib/api'
import { ERC721_ABI, MARKETPLACE_ABI, getMarketplaceAddress, getChainId } from '@/lib/contracts'
import { formatAddress } from '@/lib/utils'
import { parseEther } from 'viem'

function SendModal({ nft, onClose, onSuccess }: { nft: ApiNft; onClose: () => void; onSuccess: () => void }) {
  const [recipient, setRecipient] = useState('')
  const { address: userAddress } = useAccount()
  const { switchChain } = useSwitchChain()
  const chainId = getChainId(nft.chain)

  const { writeContract, data: txHash, error: writeError, reset } = useWriteContract()
  const { isSuccess: txConfirmed } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (txConfirmed) {
      setTimeout(() => { onSuccess(); onClose() }, 1500)
    }
  }, [txConfirmed, onClose, onSuccess])

  const handleSend = () => {
    if (!recipient.trim() || !userAddress) return
    if (chainId && chainId !== undefined) {
      switchChain({ chainId })
    }
    reset()
    writeContract({
      address: nft.address as `0x${string}`,
      abi: ERC721_ABI,
      functionName: 'safeTransferFrom',
      args: [userAddress, recipient as `0x${string}`, BigInt(nft.token_id)],
      chainId: chainId || undefined,
    })
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
            <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden shrink-0">
              {nft.image_url && <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{nft.name || `#${nft.token_id}`}</p>
              <div className="flex items-center gap-1.5">
                <p className="text-[11px] text-muted-foreground truncate">{nft.collection_name}</p>
                <NetworkBadge chain={nft.chain} />
              </div>
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

          {writeError && (
            <p className="text-xs text-red-400">
              {writeError.message?.includes('User rejected') ? 'Transaction rejected' : 'Transfer failed'}
            </p>
          )}
          {txConfirmed && <p className="text-xs text-green-400">Transfer confirmed!</p>}

          <Button
            className="w-full"
            onClick={handleSend}
            disabled={!recipient.trim() || !recipient.startsWith('0x') || txHash !== undefined}
          >
            {txHash && !txConfirmed ? 'Confirming...' : 'Confirm Send'}
            {!txHash && <PaperPlaneTilt size={16} />}
          </Button>
        </div>
      </div>
    </>
  )
}

function ListModal({ nft, onClose, onSuccess }: { nft: ApiNft; onClose: () => void; onSuccess: () => void }) {
  const [price, setPrice] = useState('')
  const [step, setStep] = useState<'price' | 'approve' | 'list'>('price')
  const { switchChain } = useSwitchChain()
  const chainId = getChainId(nft.chain)
  const marketplaceAddr = getMarketplaceAddress(nft.chain)

  const { writeContract, data: txHash, error: writeError, reset } = useWriteContract()
  const { isSuccess: txConfirmed } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (txConfirmed && step === 'approve') {
      // Approval confirmed, now list
      setStep('list')
      reset()
      if (!marketplaceAddr) return
      writeContract({
        address: marketplaceAddr,
        abi: MARKETPLACE_ABI,
        functionName: 'listItem',
        args: [nft.address as `0x${string}`, BigInt(nft.token_id), parseEther(price)],
        chainId: chainId || undefined,
      })
    } else if (txConfirmed && step === 'list') {
      setTimeout(() => { onSuccess(); onClose() }, 1500)
    }
  }, [txConfirmed, step])

  const handleSubmit = () => {
    if (!price || !marketplaceAddr) return
    if (chainId) switchChain({ chainId })

    // Start with approval
    setStep('approve')
    reset()
    writeContract({
      address: nft.address as `0x${string}`,
      abi: ERC721_ABI,
      functionName: 'approve',
      args: [marketplaceAddr, BigInt(nft.token_id)],
      chainId: chainId || undefined,
    })
  }

  const symbol = nft.chain === 'flare' ? 'FLR' : nft.chain === 'songbird' ? 'SGB' : nft.chain.toUpperCase()

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md bg-background border border-border rounded-xl shadow-[0_0_40px_oklch(0.72_0.17_195/0.1)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold">List for Sale</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
            <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden shrink-0">
              {nft.image_url && <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{nft.name || `#${nft.token_id}`}</p>
              <div className="flex items-center gap-1.5">
                <p className="text-[11px] text-muted-foreground truncate">{nft.collection_name}</p>
                <NetworkBadge chain={nft.chain} />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-muted-foreground uppercase tracking-wider block mb-1.5">
              Price ({symbol})
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              disabled={step !== 'price'}
              className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="text-[10px] text-muted-foreground mt-1">2.5% platform fee applies on sale</p>
          </div>

          {writeError && (
            <p className="text-xs text-red-400">
              {writeError.message?.includes('User rejected') ? 'Transaction rejected' : 'Listing failed'}
            </p>
          )}
          {txConfirmed && step === 'list' && <p className="text-xs text-green-400">Listed successfully!</p>}

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!price || parseFloat(price) <= 0 || step !== 'price'}
          >
            {step === 'approve' ? 'Approving...' : step === 'list' ? 'Listing...' : 'List Item'}
            {step === 'price' && <Tag size={16} />}
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
  const { address: userAddress } = useAccount()
  const [copied, setCopied] = useState(false)
  const [holdings, setHoldings] = useState<ApiNft[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingNft, setSendingNft] = useState<ApiNft | null>(null)
  const [listingNft, setListingNft] = useState<ApiNft | null>(null)

  const isOwnProfile = !!oneIdUser && oneIdUser.wallets.some(
    (w: any) => w.address.toLowerCase() === address?.toLowerCase()
  )

  const oneIdAvatar = oneIdUser?.avatarUrl
    ? (oneIdUser.avatarUrl.startsWith('/') ? `${apiUrl}${oneIdUser.avatarUrl}` : oneIdUser.avatarUrl)
    : oneIdUser ? `https://api.dicebear.com/9.x/rings/svg?seed=${oneIdUser.username}` : undefined

  const displayName = isOwnProfile && oneIdUser ? oneIdUser.displayName : formatAddress(address || '')
  const avatar = isOwnProfile ? oneIdAvatar : undefined

  const loadHoldings = () => {
    if (!address) return
    setLoading(true)
    fetchUserHoldings(address)
      .then(setHoldings)
      .catch(() => setHoldings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadHoldings() }, [address])

  const copyAddress = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const isConnectedProfile = userAddress && userAddress.toLowerCase() === address?.toLowerCase()

  return (
    <div>
      <div className="h-32 sm:h-44 bg-secondary overflow-hidden" />

      <div className="container mx-auto px-4 sm:px-6 -mt-10 relative z-10 pb-16">
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
              href={`https://flarescan.com/address/${address}`}
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
              <div key={`${nft.chain}-${nft.address}-${nft.token_id}`} className="group relative">
                <NFTCard nft={nft} index={i} />
                {isConnectedProfile && (
                  <div className="absolute top-2 left-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSendingNft(nft) }}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-primary/80 transition-colors cursor-pointer"
                      title="Send"
                    >
                      <PaperPlaneTilt size={13} />
                    </button>
                    {nft.listing_status !== 'active' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setListingNft(nft) }}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-primary/80 transition-colors cursor-pointer"
                        title="List for Sale"
                      >
                        <Tag size={13} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-12">No NFTs found for this address</p>
        )}
      </div>

      {/* Modals */}
      {sendingNft && <SendModal nft={sendingNft} onClose={() => setSendingNft(null)} onSuccess={loadHoldings} />}
      {listingNft && <ListModal nft={listingNft} onClose={() => setListingNft(null)} onSuccess={loadHoldings} />}
    </div>
  )
}
