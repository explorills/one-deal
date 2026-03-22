import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowSquareOut } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { NetworkBadge } from '@/components/ui/NetworkBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { fetchNft } from '@/lib/api'
import type { ApiNft, ApiListing, ApiSale } from '@/lib/api'
import { SUPPORTED_CHAINS } from '@/lib/constants'
import { formatAddress, timeAgo } from '@/lib/utils'
import { formatEther } from 'viem'

export default function NFTDetail() {
  const { chain, address, tokenId } = useParams()
  const [nft, setNft] = useState<ApiNft | null>(null)
  const [listing, setListing] = useState<ApiListing | null>(null)
  const [history, setHistory] = useState<ApiSale[]>([])
  const [loading, setLoading] = useState(true)
  const [metadata, setMetadata] = useState<any>(null)

  const chainConfig = chain ? SUPPORTED_CHAINS[chain as keyof typeof SUPPORTED_CHAINS] : null
  const symbol = chainConfig?.symbol || chain?.toUpperCase() || ''

  useEffect(() => {
    if (!chain || !address || !tokenId) return
    setLoading(true)
    fetchNft(chain, address, tokenId)
      .then((data) => {
        setNft(data.nft)
        setListing(data.listing)
        setHistory(data.history)
        // Parse metadata JSON if available
        if (data.nft.metadata_json) {
          try { setMetadata(JSON.parse(data.nft.metadata_json)) } catch {}
        }
      })
      .catch(() => setNft(null))
      .finally(() => setLoading(false))
  }, [chain, address, tokenId])

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
            <Skeleton className="w-full h-20 rounded-xl" />
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

  // Get traits from metadata
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
          {/* Collection link */}
          <div>
            <Link
              to={`/collection/${chain}/${address}`}
              className="text-xs text-primary font-medium hover:underline font-mono"
            >
              {nft.collection_name || formatAddress(nft.address)}
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">{nft.name || `#${nft.token_id}`}</h1>
          </div>

          {/* Price block */}
          {listing && priceFormatted ? (
            <div className="rounded-xl border border-border p-4 sm:p-5 bg-card">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Current Price</p>
              <p className="text-3xl sm:text-4xl font-bold font-mono tabular-nums text-primary">
                {priceFormatted} <span className="text-lg text-foreground">{symbol}</span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                Seller: {formatAddress(listing.seller)}
              </p>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1">Buy Now</Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border p-4 sm:p-5 bg-card">
              <p className="text-sm text-muted-foreground">Not currently listed</p>
            </div>
          )}

          {/* Owner */}
          {nft.owner && (
            <div className="rounded-lg border border-border p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Owner</p>
              <Link
                to={`/profile/${nft.owner}`}
                className="text-xs font-medium font-mono text-foreground hover:text-primary transition-colors"
              >
                {formatAddress(nft.owner)}
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

          {/* Traits from metadata */}
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
