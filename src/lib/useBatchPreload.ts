import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Preloads a batch of image URLs. Returns `ready` only when ALL images
 * in the batch have loaded (or failed). This ensures we never show
 * partial content — the domino animation starts only after everything
 * is loaded on our side.
 */
export function useBatchPreload(urls: string[]): boolean {
  const [ready, setReady] = useState(false)
  const urlsKey = urls.join('|')

  useEffect(() => {
    setReady(false)
    if (urls.length === 0) { setReady(true); return }

    let loaded = 0
    const target = urls.filter(Boolean).length
    if (target === 0) { setReady(true); return }

    const done = () => { loaded++; if (loaded >= target) setReady(true) }

    urls.forEach((url) => {
      if (!url) return
      const img = new Image()
      img.onload = done
      img.onerror = done
      img.src = url
    })
  }, [urlsKey])

  return ready
}

/**
 * Manages "Load More" with batch preloading.
 * - Shows loading state while fetching + preloading images
 * - Only delivers new items once ALL images are ready
 * - Returns items to render, loading state, and loadMore trigger
 */
export function useLoadMoreBatch<T extends { image_url?: string }>(
  fetchBatch: (offset: number) => Promise<{ items: T[]; total: number }>,
  batchSize: number,
) {
  const [items, setItems] = useState<T[]>([])
  const [pendingItems, setPendingItems] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [batchReady, setBatchReady] = useState(false)
  const offsetRef = useRef(0)

  // Preload pending batch images
  useEffect(() => {
    if (pendingItems.length === 0) return
    setBatchReady(false)
    const urls = pendingItems.map((i) => i.image_url || '').filter(Boolean)
    if (urls.length === 0) { setBatchReady(true); return }

    let loaded = 0
    const target = urls.length
    const done = () => { loaded++; if (loaded >= target) setBatchReady(true) }
    urls.forEach((url) => {
      const img = new Image()
      img.onload = done
      img.onerror = done
      img.src = url
    })
  }, [pendingItems])

  // When batch images are ready, deliver to visible items
  useEffect(() => {
    if (!batchReady || pendingItems.length === 0) return
    setItems((prev) => [...prev, ...pendingItems])
    setPendingItems([])
    setLoading(false)
    setInitialLoading(false)
  }, [batchReady, pendingItems])

  const loadInitial = useCallback(async () => {
    setItems([])
    setPendingItems([])
    setInitialLoading(true)
    setLoading(true)
    offsetRef.current = 0
    try {
      const { items: newItems, total: newTotal } = await fetchBatch(0)
      setTotal(newTotal)
      offsetRef.current = newItems.length
      setPendingItems(newItems) // triggers preload → batchReady → deliver
    } catch {
      setInitialLoading(false)
      setLoading(false)
    }
  }, [fetchBatch])

  const loadMore = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      const { items: newItems, total: newTotal } = await fetchBatch(offsetRef.current)
      setTotal(newTotal)
      offsetRef.current += newItems.length
      setPendingItems(newItems)
    } catch {
      setLoading(false)
    }
  }, [fetchBatch, loading])

  const hasMore = items.length < total

  return { items, total, loading, initialLoading, hasMore, loadInitial, loadMore }
}
