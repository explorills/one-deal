import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowSquareOut } from '@phosphor-icons/react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useReadContract } from 'wagmi'
import { Button } from '@/components/ui/Button'
import { NetworkBadge } from '@/components/ui/NetworkBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { fetchNft } from '@/lib/api'
import type { ApiNft, ApiListing, ApiSale } from '@/lib/api'
import { SUPPORTED_CHAINS } from '@/lib/constants'
import { MARKETPLACE_ABI, ERC721_ABI, getMarketplaceAddress, getChainId } from '@/lib/contracts'
import { formatAddress, timeAgo } from '@/lib/utils'
import { formatEther, parseEther } from 'viem'

export default function NFTDetail() {
  const { chain, address, tokenId } = useParams()
  const { address: userAddress, chainId: userChainId } = useAccount()
  const { switchChain } = useSwitchChain()
  const [nft, setNft] = useState<ApiNft | null>(null)
  const [listing, setListing] = useState<ApiListing | null>(null)
  const [history, setHistory] = useState<ApiSale[]>([])
  const [loading, setLoading] = useState(true)
  const [metadata, setMetadata] = useState<any>(null)

  // List modal state
  const [showListModal, setShowListModal] = useState(false)
  const [listPrice, setListPrice] = useState('')
  const [txStatus, setTxStatus] = useState<'idle' | 'approving' | 'listing' | 'buying' | 'cancelling' | 'success' | 'error'>('idle')
  const [txError, setTxError] = useState('')

  const chainConfig = chain ? SUPPORTED_CHAINS[chain as keyof typeof SUPPORTED_CHAINS] : null
  const symbol = chainConfig?.symbol || chain?.toUpperCase() || ''
  const marketplaceAddr = chain ? getMarketplaceAddress(chain) : null
  const requiredChainId = chain ? getChainId(chain) : null

  const isOwner = userAddress && nft?.owner && userAddress.toLowerCase() === nft.owner.toLowerCase()
  const isListed = !!listing
  const isSeller = userAddress && listing?.seller && userAddress.toLowerCase() === listing.seller.toLowerCase()

  const { writeContract, data: txHash, error: writeError, reset: resetWrite } = useWriteContract()
  const { isSuccess: txConfirmed } = useWaitForTransactionReceipt({ hash: txHash })

  // Check approval status
  const { data: approvedAddress } = useReadContract({
    address: address as `0x${string}`,
    abi: ERC721_ABI,
    functionName: 'getApproved',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    chainId: requiredChainId || undefined,
  })

  useEffect(() => {
    if (!chain || !address || !tokenId) return
    setLoading(true)
    fetchNft(chain, address, tokenId)
      .then((data) => {
        setNft(data.nft)
        setListing(data.listing)
        setHistory(data.history)
        if (data.nft.metadata_json) {
          try { setMetadata(JSON.parse(data.nft.metadata_json)) } catch {}
        }
      })
      .catch(() => setNft(null))
      .finally(() => setLoading(false))
  }, [chain, address, tokenId])

  // Handle tx confirmation
  useEffect(() => {
    if (txConfirmed) {
      setTxStatus('success')
      // Refresh data after a short delay
      setTimeout(() => {
        if (chain && address && tokenId) {
          fetchNft(chain, address, tokenId).then((data) => {
            setNft(data.nft)
            setListing(data.listing)
            setHistory(data.history)
          })
        }
        setTxStatus('idle')
        setShowListModal(false)
      }, 2000)
    }
  }, [txConfirmed, chain, address, tokenId])

  useEffect(() => {
    if (writeError) {
      setTxStatus('error')
      setTxError(writeError.message?.includes('User rejected') ? 'Transaction rejected' : writeError.message || 'Transaction failed')
    }
  }, [writeError])

  const ensureCorrectChain = () => {
    if (requiredChainId && userChainId !== requiredChainId) {
      switchChain({ chainId: requiredChainId })
      return false
    }
    return true
  }

  const handleBuy = () => {
    if (!marketplaceAddr || !address || !tokenId || !listing) return
    if (!ensureCorrectChain()) return
    setTxStatus('buying')
    setTxError('')
    resetWrite()
    writeContract({
      address: marketplaceAddr,
      abi: MARKETPLACE_ABI,
      functionName: 'buyItem',
      args: [address as `0x${string}`, BigInt(tokenId)],
      value: BigInt(listing.price),
      chainId: requiredChainId || undefined,
    })
  }

  const handleList = () => {
    if (!marketplaceAddr || !address || !tokenId || !listPrice) return
    if (!ensureCorrectChain()) return

    const priceWei = parseEther(listPrice)

    // Check if already approved
    const isApproved = approvedAddress && approvedAddress.toString().toLowerCase() === marketplaceAddr.toLowerCase()

    if (!isApproved) {
      // Need to approve first
      setTxStatus('approving')
      setTxError('')
      resetWrite()
      writeContract({
        address: address as `0x${string}`,
        abi: ERC721_ABI,
        functionName: 'approve',
        args: [marketplaceAddr, BigInt(tokenId)],
        chainId: requiredChainId || undefined,
      })
      // After approval, user needs to click List again
      return
    }

    setTxStatus('listing')
    setTxError('')
    resetWrite()
    writeContract({
      address: marketplaceAddr,
      abi: MARKETPLACE_ABI,
      functionName: 'listItem',
      args: [address as `0x${string}`, BigInt(tokenId), priceWei],
      chainId: requiredChainId || undefined,
    })
  }

  const handleCancel = () => {
    if (!marketplaceAddr || !address || !tokenId) return
    if (!ensureCorrectChain()) return
    setTxStatus('cancelling')
    setTxError('')
    resetWrite()
    writeContract({
      address: marketplaceAddr,
      abi: MARKETPLACE_ABI,
      functionName: 'cancelListing',
      args: [address as `0x${string}`, BigInt(tokenId)],
      chainId: requiredChainId || undefined,
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <Skeleton className="w-20 h-5 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-64 h-8" />
            <Skeleton className="w-full h-32 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!nft) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-muted-foreground">NFT not found</p>
        <Link to="/explore" className="text-primary text-sm mt-2 inline-block">Back to Explore</Link>
      </div>
    )
  }

  const price = listing?.price
  let priceFormatted = ''
  try { if (price) priceFormatted = parseFloat(formatEther(BigInt(price))).toFixed(4) } catch {}

  const traits = metadata?.attributes || metadata?.traits || []

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <Link
        to={`/collection/${chain}/${address}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Back to collection
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary">
            {nft.image_url ? (
              <img src={nft.image_url} alt={nft.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-lg font-mono">
                #{nft.token_id}
              </div>
            )}
            <div className="absolute top-3 right-3">
              <NetworkBadge chain={nft.chain} size="md" />
            </div>
          </div>
        </motion.div>

        {/* Data */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-5"
        >
          <div>
            <Link
              to={`/collection/${chain}/${address}`}
              className="text-xs text-primary font-medium hover:underline font-mono"
            >
              {nft.collection_name || formatAddress(nft.address)}
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">{nft.name || `#${nft.token_id}`}</h1>
          </div>

          {/* Price / Action block */}
          <div className="rounded-xl border border-border p-4 sm:p-5 bg-card">
            {isListed && priceFormatted ? (
              <>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Current Price</p>
                <p className="text-3xl sm:text-4xl font-bold font-mono tabular-nums text-primary">
                  {priceFormatted} <span className="text-lg text-foreground">{symbol}</span>
                </p>
                <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                  Seller: {formatAddress(listing!.seller)} &middot; 2.5% platform fee
                </p>

                {/* Status messages */}
                {txStatus === 'success' && (
                  <p className="text-sm text-green-400 mt-2">Transaction confirmed!</p>
                )}
                {txStatus === 'error' && (
                  <p className="text-sm text-red-400 mt-2">{txError}</p>
                )}

                <div className="flex gap-2 mt-4">
                  {isSeller ? (
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={txStatus !== 'idle' && txStatus !== 'error'}
                    >
                      {txStatus === 'cancelling' ? 'Cancelling...' : 'Cancel Listing'}
                    </Button>
                  ) : userAddress ? (
                    <Button
                      className="flex-1"
                      onClick={handleBuy}
                      disabled={txStatus !== 'idle' && txStatus !== 'error'}
                    >
                      {txStatus === 'buying' ? 'Confirming...' : `Buy Now — ${priceFormatted} ${symbol}`}
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">Connect wallet to buy</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-3">Not currently listed</p>

                {txStatus === 'success' && (
                  <p className="text-sm text-green-400 mb-2">Transaction confirmed!</p>
                )}
                {txStatus === 'error' && (
                  <p className="text-sm text-red-400 mb-2">{txError}</p>
                )}

                {isOwner && !showListModal && (
                  <Button size="sm" onClick={() => setShowListModal(true)}>
                    List for Sale
                  </Button>
                )}

                {isOwner && showListModal && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-muted-foreground uppercase tracking-wider block mb-1">
                        Price ({symbol})
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        value={listPrice}
                        onChange={(e) => setListPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={handleList}
                        disabled={!listPrice || parseFloat(listPrice) <= 0 || (txStatus !== 'idle' && txStatus !== 'error')}
                      >
                        {txStatus === 'approving' ? 'Approving...' : txStatus === 'listing' ? 'Listing...' : 'List Item'}
                      </Button>
                      <Button variant="outline" onClick={() => { setShowListModal(false); setListPrice('') }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Owner */}
          {nft.owner && (
            <div className="rounded-lg border border-border p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Owner</p>
              <Link
                to={`/profile/${nft.owner}`}
                className="text-xs font-medium font-mono text-foreground hover:text-primary transition-colors"
              >
                {formatAddress(nft.owner)}
                {isOwner && <span className="text-primary ml-1">(you)</span>}
              </Link>
            </div>
          )}

          {/* Description */}
          {(nft.description || metadata?.description) && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Description</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{nft.description || metadata?.description}</p>
            </div>
          )}

          {/* Traits */}
          {traits.length > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Traits</p>
              <div className="flex flex-wrap gap-2">
                {traits.map((t: any, i: number) => (
                  <div key={i} className="rounded-lg border border-border px-3 py-2 bg-card">
                    <p className="text-[10px] text-primary font-mono uppercase">{t.trait_type || t.traitType}</p>
                    <p className="text-xs font-medium">{t.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex items-center gap-2">
            {chainConfig && (
              <a
                href={`${chainConfig.explorer}/token/${nft.address}?a=${nft.token_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowSquareOut size={14} /> View on Explorer
              </a>
            )}
            {nft.metadata_uri && (
              <a
                href={nft.metadata_uri.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors ml-4"
              >
                <ArrowSquareOut size={14} /> Metadata
              </a>
            )}
          </div>

          {/* Sale History */}
          {history.length > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Sale History</p>
              <div className="border border-border rounded-lg overflow-hidden">
                {history.map((sale) => {
                  let salePrice = '0'
                  try { salePrice = parseFloat(formatEther(BigInt(sale.price))).toFixed(4) } catch {}
                  return (
                    <div key={sale.id} className="flex items-center justify-between px-3 py-2.5 border-b border-border last:border-b-0 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">
                          sale
                        </span>
                        <span className="text-muted-foreground font-mono">{formatAddress(sale.seller)}</span>
                        <span className="text-muted-foreground">&rarr;</span>
                        <span className="text-muted-foreground font-mono">{formatAddress(sale.buyer)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono tabular-nums">{salePrice} {symbol}</span>
                        <span className="text-muted-foreground font-mono text-[10px]">{timeAgo(sale.sold_at)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
