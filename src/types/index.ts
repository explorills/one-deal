export interface User {
  address: string
  username: string
  displayName: string
  avatar: string
  banner?: string
  bio?: string
  isVerified: boolean
  joinedAt: string
  stats: UserStats
}

export interface UserStats {
  totalSales: number
  totalVolume: number
  nftsOwned: number
  nftsCreated: number
  collections: number
  followers: number
  following: number
}

export interface NFT {
  id: string
  tokenId: string
  name: string
  description: string
  image: string
  collection: CollectionSummary
  owner: UserSummary
  creator: UserSummary
  price: number
  currency: string
  lastSale?: number
  highestBid?: number
  likes: number
  views: number
  traits: Trait[]
  priceHistory: PriceHistory[]
  isListed: boolean
  listingExpiry?: string
  createdAt: string
}

export interface CollectionSummary {
  id: string
  name: string
  image: string
  isVerified: boolean
}

export interface UserSummary {
  address: string
  username: string
  displayName: string
  avatar: string
  isVerified: boolean
}

export interface Collection {
  id: string
  name: string
  description: string
  image: string
  banner: string
  creator: UserSummary
  isVerified: boolean
  category: CollectionCategory
  stats: CollectionStats
  createdAt: string
}

export interface CollectionStats {
  floorPrice: number
  totalVolume: number
  items: number
  owners: number
  listedPercentage: number
  sevenDayChange: number
}

export type CollectionCategory =
  | 'art'
  | 'photography'
  | 'pfp'
  | 'gaming'
  | 'music'
  | 'utility'
  | 'virtual-worlds'
  | 'sports'

export interface Trait {
  traitType: string
  value: string
  rarity: number
}

export interface PriceHistory {
  date: string
  price: number
}

export interface Bid {
  id: string
  nftId: string
  bidder: UserSummary
  amount: number
  currency: string
  expiry: string
  createdAt: string
}

export interface Activity {
  id: string
  type: ActivityType
  nft: NFTSummary
  from: UserSummary
  to?: UserSummary
  price?: number
  currency?: string
  timestamp: string
}

export type ActivityType =
  | 'sale'
  | 'listing'
  | 'bid'
  | 'transfer'
  | 'mint'
  | 'cancel'

export interface NFTSummary {
  id: string
  name: string
  image: string
  collection: CollectionSummary
}

export interface Notification {
  id: string
  type: 'sale' | 'bid' | 'outbid' | 'transfer' | 'follow'
  message: string
  read: boolean
  timestamp: string
}

export interface RankingEntry {
  rank: number
  collection: Collection
  volume: number
  volumeChange: number
  floorPrice: number
  floorChange: number
  sales: number
}
