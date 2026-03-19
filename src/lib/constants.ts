export const WALLETCONNECT_PROJECT_ID = '1fe344d4623291d85ad7369cbc6d9ec8'

export const ROUTES = {
  home: '/',
  explore: '/explore',
  nftDetail: '/nft/:id',
  collection: '/collection/:id',
  profile: '/profile/:address',
  create: '/create',
  settings: '/settings',
  rankings: '/rankings',
} as const

export const COLLECTION_CATEGORIES = [
  { value: 'all', label: 'All' },
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
] as const

export const ECOSYSTEM_LINKS = [
  { name: 'MAIN', url: 'https://expl.one' },
  { name: 'EXPL Nodes', url: 'https://node.expl.one' },
  { name: 'Documentation', url: 'https://docs.expl.one' },
  { name: 'pump', url: 'https://pump.expl.one' },
  { name: 'network', url: 'https://network.expl.one' },
  { name: 'world', url: 'https://world.expl.one' },
  { name: 'id', url: 'https://id.expl.one' },
  { name: 'box', url: 'https://box.expl.one' },
]
