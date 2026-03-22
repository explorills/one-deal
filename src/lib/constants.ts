export const WALLETCONNECT_PROJECT_ID = '1fe344d4623291d85ad7369cbc6d9ec8'

// OneDealMarketplace contract addresses
export const MARKETPLACE_CONTRACTS = {
  flare: '0x8aEe2b90E5A56a93B44E9DbEc78CA62da8060646',
  songbird: '0x3c3bf9cF0Ecd80ad33c22E7A91c5fD938AbB02d7',
} as const

// Chain configs
export const SUPPORTED_CHAINS = {
  flare: {
    id: 14,
    name: 'Flare',
    symbol: 'FLR',
    rpc: 'https://flare-api.flare.network/ext/C/rpc',
    explorer: 'https://flare-explorer.flare.network',
    marketplace: MARKETPLACE_CONTRACTS.flare,
  },
  songbird: {
    id: 19,
    name: 'Songbird',
    symbol: 'SGB',
    rpc: 'https://songbird-api.flare.network/ext/C/rpc',
    explorer: 'https://songbird-explorer.flare.network',
    marketplace: MARKETPLACE_CONTRACTS.songbird,
  },
} as const

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
