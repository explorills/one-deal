import { SUPPORTED_CHAINS } from './constants'

// OneDealMarketplace ABI (only the functions we need)
export const MARKETPLACE_ABI = [
  {
    name: 'listItem',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'nftAddress', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'price', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'buyItem',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'nftAddress', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'cancelListing',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'nftAddress', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'isListed',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'nftAddress', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'getListing',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'nftAddress', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [
      { name: 'seller', type: 'address' },
      { name: 'price', type: 'uint256' },
    ],
  },
  {
    name: 'PLATFORM_FEE_BPS',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const

// ERC-721 ABI (approve + setApprovalForAll)
export const ERC721_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'setApprovalForAll',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' },
    ],
    outputs: [],
  },
  {
    name: 'getApproved',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ type: 'address' }],
  },
  {
    name: 'isApprovedForAll',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'operator', type: 'address' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'ownerOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ type: 'address' }],
  },
  {
    name: 'safeTransferFrom',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },
] as const

export function getMarketplaceAddress(chain: string): `0x${string}` | null {
  const config = SUPPORTED_CHAINS[chain as keyof typeof SUPPORTED_CHAINS]
  if (!config) return null
  return config.marketplace as `0x${string}`
}

export function getChainId(chain: string): number | null {
  const config = SUPPORTED_CHAINS[chain as keyof typeof SUPPORTED_CHAINS]
  if (!config) return null
  return config.id
}
