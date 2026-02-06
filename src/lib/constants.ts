export const BRAND_COLOR = '#7C3AED'

export const CURRENCIES = ['ETH', 'WETH', 'USDC'] as const
export type Currency = (typeof CURRENCIES)[number]

export const COLLECTION_CATEGORIES = [
  { value: 'art', label: 'Art' },
  { value: 'photography', label: 'Photography' },
  { value: 'pfp', label: 'PFP' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'music', label: 'Music' },
  { value: 'utility', label: 'Utility' },
  { value: 'virtual-worlds', label: 'Virtual Worlds' },
  { value: 'sports', label: 'Sports' },
] as const

export const SORT_OPTIONS = [
  { value: 'recently-listed', label: 'Recently Listed' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'most-liked', label: 'Most Liked' },
  { value: 'ending-soon', label: 'Ending Soon' },
] as const

export const ROUTES = {
  home: '/',
  explore: '/explore',
  nftDetail: '/nft/:id',
  collection: '/collection/:id',
  profile: '/profile/:address',
  create: '/create',
  createCollection: '/create-collection',
  settings: '/settings',
  rankings: '/rankings',
} as const
