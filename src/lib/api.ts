import { isDevEnvironment } from './utils'

function getApiUrl(): string {
  if (isDevEnvironment()) return 'http://localhost:3030'
  if (window.location.hostname.startsWith('staging2-all-access')) return 'https://api-dev-deal.expl.one'
  return 'https://api-deal.expl.one'
}

const API = getApiUrl()

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`)
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json()
}

// --- Types matching backend responses ---

export interface ApiCollection {
  address: string
  chain: string
  name: string
  symbol: string
  type: string
  total_supply: number
  owner_count: number
  floor_price: string
  volume: string
  image_url: string
  description: string
  status: string
  discovered_at: string
  approved_at: string | null
  last_indexed: string | null
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
  // Joined from listings
  price?: string | null
  seller?: string | null
  listing_status?: string | null
  // Joined from collections
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
  collections: number
  activeListings: number
  totalSales: number
  totalNFTs: number
  volume: { flare: number; songbird: number }
}

// --- API functions ---

export async function fetchStats(): Promise<ApiStats> {
  const data = await get<ApiStats>('/stats')
  return data
}

export async function fetchCollections(chain?: string, search?: string): Promise<ApiCollection[]> {
  const params = new URLSearchParams()
  if (chain) params.set('chain', chain)
  if (search) params.set('search', search)
  const qs = params.toString()
  const data = await get<{ collections: ApiCollection[] }>(`/collections${qs ? '?' + qs : ''}`)
  return data.collections
}

export async function fetchCollection(chain: string, address: string): Promise<{ collection: ApiCollection; activeListings: number }> {
  return get(`/collections/${chain}/${address}`)
}

export async function fetchCollectionNfts(
  chain: string,
  address: string,
  sort?: string,
  limit?: number,
  offset?: number,
): Promise<{ nfts: ApiNft[]; total: number }> {
  const params = new URLSearchParams()
  if (sort) params.set('sort', sort)
  if (limit) params.set('limit', String(limit))
  if (offset) params.set('offset', String(offset))
  const qs = params.toString()
  return get(`/nfts/${chain}/${address}${qs ? '?' + qs : ''}`)
}

export async function fetchNft(
  chain: string,
  address: string,
  tokenId: string,
): Promise<{ nft: ApiNft; listing: ApiListing | null; history: ApiSale[] }> {
  return get(`/nft/${chain}/${address}/${tokenId}`)
}

export async function fetchListings(chain?: string, limit?: number): Promise<ApiListing[]> {
  const params = new URLSearchParams()
  if (chain) params.set('chain', chain)
  if (limit) params.set('limit', String(limit))
  const qs = params.toString()
  const data = await get<{ listings: ApiListing[] }>(`/listings${qs ? '?' + qs : ''}`)
  return data.listings
}

export async function fetchUserHoldings(address: string): Promise<ApiNft[]> {
  const data = await get<{ nfts: ApiNft[] }>(`/user/${address}/holdings`)
  return data.nfts
}

export async function searchCollections(q: string): Promise<ApiCollection[]> {
  if (q.length < 2) return []
  const data = await get<{ collections: ApiCollection[] }>(`/search?q=${encodeURIComponent(q)}`)
  return data.collections
}
