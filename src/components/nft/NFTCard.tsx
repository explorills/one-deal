import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { NetworkBadge } from '@/components/ui/NetworkBadge'
import { getOptimizedImageUrl } from '@/lib/api'
import type { ApiNft, ApiListing } from '@/lib/api'
import { SUPPORTED_CHAINS } from '@/lib/constants'
import { formatEther } from 'viem'

const DOMINO_DELAY = 100 // ms between each card reveal

interface NFTCardProps {
  nft?: ApiNft
  listing?: ApiListing
  index?: number
}

export function NFTCard({ nft, listing, index = 0 }: NFTCardProps) {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [imageReady, setImageReady] = useState(false)
  const mountTime = useRef(Date.now())

  const chain = nft?.chain || listing?.chain || ''
  const address = nft?.address || listing?.address || ''
  const tokenId = nft?.token_id || listing?.token_id || ''
  const name = nft?.name || listing?.name || `#${tokenId}`
  const imageUrl = nft?.image_url || listing?.image_url || ''
  const collectionName = nft?.collection_name || listing?.collection_name || ''
  const price = nft?.price || listing?.price
  const chainConfig = SUPPORTED_CHAINS[chain as keyof typeof SUPPORTED_CHAINS]
  const symbol = chainConfig?.symbol || chain.toUpperCase()

  // Domino reveal: card appears only when image is ready AND it's this card's turn
  useEffect(() => {
    if (!imageReady) return
    const minTime = mountTime.current + index * DOMINO_DELAY
    const remaining = minTime - Date.now()
    if (remaining <= 0) {
      setVisible(true)
    } else {
      const t = setTimeout(() => setVisible(true), remaining)
      return () => clearTimeout(t)
    }
  }, [imageReady, index])

  // Start loading image immediately (hidden), mark ready when done
  useEffect(() => {
    if (!imageUrl) { setImageReady(true); return }
    const img = new Image()
    img.onload = () => setImageReady(true)
    img.onerror = () => setImageReady(true)
    img.src = getOptimizedImageUrl(imageUrl, 400)
  }, [imageUrl])

  return (
    <div
      onClick={() => navigate(`/nft/${chain}/${address}/${tokenId}`)}
      className="group cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
        {imageUrl ? (
          <img
            src={getOptimizedImageUrl(imageUrl, 400)}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs font-mono">
            No image
          </div>
        )}
        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 pt-8">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] text-white/60 font-mono truncate">{collectionName}</p>
              <p className="text-sm font-semibold text-white leading-tight truncate">{name}</p>
            </div>
            {price && price !== '0' && (
              <span className="text-sm font-bold text-primary font-mono tabular-nums shrink-0">
                {formatPrice(price)} {symbol}
              </span>
            )}
          </div>
        </div>
        {/* Network badge */}
        <div className="absolute top-2.5 right-2.5">
          <NetworkBadge chain={chain} />
        </div>
        {/* Hover glow */}
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/5 transition-all duration-300 group-hover:ring-primary/30 group-hover:shadow-[inset_0_0_30px_oklch(0.72_0.17_195/0.1)]" />
      </div>
    </div>
  )
}

function formatPrice(weiPrice: string): string {
  try {
    const eth = formatEther(BigInt(weiPrice))
    const num = parseFloat(eth)
    if (num === 0) return '0'
    if (num < 0.001) return '<0.001'
    if (num < 1) return num.toFixed(3)
    if (num < 100) return num.toFixed(2)
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toFixed(1)
  } catch {
    return weiPrice
  }
}
