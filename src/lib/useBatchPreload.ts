import { useState, useCallback } from 'react'

/**
 * Per-image loading state hook.
 * Each card manages its own image independently — no batch blocking.
 */
export function useImageLoad() {
  const [loaded, setLoaded] = useState(false)
  const onLoad = useCallback(() => setLoaded(true), [])
  const onError = useCallback(() => setLoaded(true), []) // show placeholder on error
  return { loaded, onLoad, onError }
}
