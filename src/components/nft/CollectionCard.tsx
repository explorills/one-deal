import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { NetworkBadge } from '@/components/ui/NetworkBadge'
import { getOptimizedImageUrl } from '@/lib/api'
import type { ApiCollection } from '@/lib/api'

const DOMINO_DELAY = 100 // ms between each card reveal

interface CollectionCardProps {
  collection: ApiCollection
  index?: number
}

export function CollectionCard({ collection, index = 0 }: CollectionCardProps) {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [imageReady, setImageReady] = useState(false)
  const mountTime = useRef(Date.now())

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

  // Pre-load image in background, mark ready when done
  useEffect(() => {
    if (!collection.image_url) { setImageReady(true); return }
    const img = new Image()
    img.onload = () => setImageReady(true)
    img.onerror = () => setImageReady(true)
    img.src = getOptimizedImageUrl(collection.image_url, 300)
  }, [collection.image_url])

  return (
    <div
      onClick={() => navigate(`/collection/${collection.chain}/${collection.address}`)}
      className="relative shrink-0 w-56 sm:w-64 cursor-pointer group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(20px)',
        transition: 'opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1), transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary">
        {collection.image_url ? (
          <img
            src={getOptimizedImageUrl(collection.image_url, 300)}
            alt={collection.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-3xl font-bold text-muted-foreground/30">{collection.symbol || '?'}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute top-2.5 right-2.5">
          <NetworkBadge chain={collection.chain} />
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-sm font-semibold text-white leading-tight truncate">{collection.name || collection.symbol}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[11px] text-white/70 font-mono">{collection.nfts_cached} items</span>
            <span className="text-[11px] text-white/70 font-mono">{collection.type}</span>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/5 transition-all duration-300 group-hover:ring-primary/30" />
    </div>
  )
}
