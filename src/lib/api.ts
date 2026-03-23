import { isDevEnvironment } from './utils'

function getApiUrl(): string {
  if (isDevEnvironment()) return 'http://localhost:3030'
  if (window.location.hostname.startsWith('staging2-all-access')) return 'https://api-dev-deal.expl.one'
  return 'https://api-deal.expl.one'
}

const API = getApiUrl()

// ==========================================
// Frontend Response Cache
// Survives React navigation — data persists across page changes
// ==========================================

const responseCache = new Map<string, { data: any; expires: number }>()

function getCachedResponse<T>(key: string): T | null {
  const entry = responseCache.get(key)
  if (entry && Date.now() < entry.expires) return entry.data as T
  if (entry) responseCache.delete(key)
  return null
}

function setCachedResponse(key: string, data: any, ttlMs: number): void {
  responseCache.set(key, { data, expires: Date.now() + ttlMs })
}

const CACHE_5M = 5 * 60_000
const CACHE_2M = 2 * 60_000
const CACHE_1M = 60_000

// ==========================================
// API Helpers
// ==========================================

export function getOptimizedImageUrl(imageUrl: string, _width: number = 400): string {
  return imageUrl || ''
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`)
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json()
}

async function cachedGet<T>(path: string, ttlMs: number): Promise<T> {
  const cached = getCachedResponse<T>(path)
  if (cached) return cached
  const data = await get<T>(path)
  setCachedResponse(path, data, ttlMs)
  return data
}

// ==========================================
// Types
// ==========================================

export interface ApiCollection {
  address: string
  chain: string
  name: string
  symbol: string
  type: string
  total_supply: number
  holder_count: number
  nfts_cached: number
  image_url: string
  status: string
  discovered_at: string
}

export interface ApiNft {
  address: string
  chain: string
  token_id: string
  owner: string
  name: string
  description: string
  image_url: string
  metadata_uri: string
  metadata_json: string
  last_indexed: string
  price?: string | null
  seller?: string | null
  listing_status?: string | null
  collection_name?: string
  collection_symbol?: string
}

export interface ApiListing {
  address: string
  chain: string
  token_id: string
  seller: string
  price: string
  listed_at: string
  status: string
  name?: string
  image_url?: string
  collection_name?: string
  collection_symbol?: string
}

export interface ApiSale {
  id: number
  address: string
  chain: string
  token_id: string
  seller: string
  buyer: string
  price: string
  sold_at: string
}

export interface ApiStats {
  stats: Record<string, { collections: number; nfts: number }>
}

// ==========================================
// API Functions
// ==========================================

export async function fetchStats(): Promise<ApiStats> {
  return cachedGet<ApiStats>('/stats', CACHE_5M)
}

/** Recently active collections for landing page (sorted by recent transfers) */
export async function fetchRecentlyActive(chain: string, limit: number = 12): Promise<ApiCollection[]> {
  const path = `/recently-active/${chain}?limit=${limit}`
  const cacheKey = `ra:${path}`
  const cached = getCachedResponse<ApiCollection[]>(cacheKey)
  if (cached) return cached

  try {
    const data = await get<{ collections: ApiCollection[] }>(path)
    setCachedResponse(cacheKey, data.collections, CACHE_2M)
    return data.collections
  } catch {
    // Fallback until backend endpoint is built — use top collections by holders
    const cols = await fetchCollections(chain)
    const result = cols.slice(0, limit)
    setCachedResponse(cacheKey, result, CACHE_2M)
    return result
  }
}

export async function fetchCollections(chain?: string, search?: string): Promise<ApiCollection[]> {
  const params = new URLSearchParams()
  if (chain) params.set('chain', chain)
  if (search) params.set('search', search)
  const qs = params.toString()
  const path = `/collections${qs ? '?' + qs : ''}`
  const data = await cachedGet<{ collections: ApiCollection[] }>(path, search ? CACHE_1M : CACHE_5M)
  return data.collections
}

export async function fetchCollection(chain: string, address: string): Promise<{ collection: ApiCollection; activeListings: number }> {
  return cachedGet(`/collections/${chain}/${address}`, CACHE_2M)
}

export async function fetchCollectionNfts(
  chain: string,
  address: string,
  sort?: string,
  limit: number = 24,
  offset: number = 0,
): Promise<{ nfts: ApiNft[]; total: number }> {
  const params = new URLSearchParams()
  if (sort) params.set('sort', sort)
  params.set('limit', String(limit))
  params.set('offset', String(offset))
  const path = `/nfts/${chain}/${address}?${params.toString()}`
  return cachedGet(path, CACHE_2M)
}

export async function fetchNft(
  chain: string,
  address: string,
  tokenId: string,
): Promise<{ nft: ApiNft; listing: ApiListing | null; history: ApiSale[] }> {
  return cachedGet(`/nft/${chain}/${address}/${tokenId}`, CACHE_2M)
}

export async function fetchListings(chain?: string, limit?: number): Promise<ApiListing[]> {
  const params = new URLSearchParams()
  if (chain) params.set('chain', chain)
  if (limit) params.set('limit', String(limit))
  const qs = params.toString()
  const data = await cachedGet<{ listings: ApiListing[] }>(`/listings${qs ? '?' + qs : ''}`, CACHE_1M)
  return data.listings
}

export async function fetchUserHoldings(address: string): Promise<ApiNft[]> {
  const data = await cachedGet<{ nfts: ApiNft[] }>(`/user/${address}/holdings`, CACHE_1M)
  return data.nfts
}

export async function searchCollections(q: string): Promise<ApiCollection[]> {
  if (q.length < 3) return []
  const data = await cachedGet<{ collections: ApiCollection[] }>(`/search?q=${encodeURIComponent(q)}`, CACHE_1M)
  return data.collections
}

// ==========================================
// Pre-cache helpers (fire-and-forget, fills frontend cache)
// ==========================================

export function precacheCollectionNfts(chain: string, address: string, limit: number = 24): void {
  fetchCollectionNfts(chain, address, 'token_id', limit, 0).catch(() => {})
}

export function precacheNextBatch(chain: string, address: string, sort: string, limit: number, offset: number): void {
  fetchCollectionNfts(chain, address, sort, limit, offset).catch(() => {})
}
