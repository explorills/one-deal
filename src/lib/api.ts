import { isDevEnvironment } from './utils'

function getApiUrl(): string {
  if (isDevEnvironment()) return 'http://localhost:3030'
  if (window.location.hostname.startsWith('staging2-all-access')) return 'https://api-dev-deal.expl.one'
  return 'https://api-deal.expl.one'
}

const API = getApiUrl()

// ==========================================
// Navigation Cache — survives page changes, simple Map
// ==========================================

const navCache = new Map<string, { data: any; ts: number }>()
const NAV_TTL = 60_000 // 1 min — just for back/forward navigation speed

function fromCache<T>(key: string): T | null {
  const entry = navCache.get(key)
  if (entry && Date.now() - entry.ts < NAV_TTL) return entry.data as T
  return null
}

function toCache(key: string, data: any): void {
  navCache.set(key, { data, ts: Date.now() })
}

// ==========================================
// API Helpers
// ==========================================

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`)
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json()
}

/** Fetch with navigation cache — serves stale instantly, fetches fresh in background */
async function cachedGet<T>(path: string): Promise<T> {
  const cached = fromCache<T>(path)
  if (cached) return cached
  const data = await get<T>(path)
  toCache(path, data)
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
// API Functions — all serve instantly from backend disk
// ==========================================

export async function fetchStats(): Promise<ApiStats> {
  return cachedGet<ApiStats>('/stats')
}

export async function fetchRecentlyActive(chain: string, limit: number = 12): Promise<ApiCollection[]> {
  const data = await cachedGet<{ collections: ApiCollection[] }>(`/recently-active/${chain}?limit=${limit}`)
  return data.collections
}

export async function fetchCollections(chain?: string, search?: string): Promise<ApiCollection[]> {
  const params = new URLSearchParams()
  if (chain) params.set('chain', chain)
  if (search) params.set('search', search)
  const qs = params.toString()
  const data = await cachedGet<{ collections: ApiCollection[] }>(`/collections${qs ? '?' + qs : ''}`)
  return data.collections
}

export async function fetchCollection(chain: string, address: string): Promise<{ collection: ApiCollection; activeListings: number }> {
  return cachedGet(`/collections/${chain}/${address}`)
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
  return cachedGet(`/nfts/${chain}/${address}?${params.toString()}`)
}

export async function fetchNft(
  chain: string,
  address: string,
  tokenId: string,
): Promise<{ nft: ApiNft; listing: ApiListing | null; history: ApiSale[] }> {
  return cachedGet(`/nft/${chain}/${address}/${tokenId}`)
}

export async function fetchListings(chain?: string, limit?: number): Promise<ApiListing[]> {
  const params = new URLSearchParams()
  if (chain) params.set('chain', chain)
  if (limit) params.set('limit', String(limit))
  const qs = params.toString()
  const data = await cachedGet<{ listings: ApiListing[] }>(`/listings${qs ? '?' + qs : ''}`)
  return data.listings
}

export async function fetchUserHoldings(address: string): Promise<ApiNft[]> {
  const data = await cachedGet<{ nfts: ApiNft[] }>(`/user/${address}/holdings`)
  return data.nfts
}

export async function searchCollections(q: string): Promise<ApiCollection[]> {
  if (q.length < 3) return []
  const data = await cachedGet<{ collections: ApiCollection[] }>(`/search?q=${encodeURIComponent(q)}`)
  return data.collections
}

// ==========================================
// Frontend triggers backend to prepare upcoming content
// ==========================================

export function triggerPrepare(chain: string, address: string): void {
  fetch(`${API}/prepare/${chain}/${address}`, { method: 'POST' }).catch(() => {})
}
