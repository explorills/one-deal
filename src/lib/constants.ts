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
  nftDetail: '/nft/:chain/:address/:tokenId',
  collection: '/collection/:chain/:address',
  profile: '/profile/:address',
} as const
