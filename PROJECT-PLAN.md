# ONE Deal — Project Plan

> AI-aligned comprehensive building plan derived from founder interview and SDLC methodology. This is the single source of truth for building ONE Deal from UI to production.

---

## Status: Complete

## Product Summary

**ONE Deal** is a general-purpose EVM NFT marketplace launching on Flare/Songbird, designed to scale to all major EVM chains. Free to trade, revenue from premium features. Built solo + AI with a 1-2 month MVP timeline.

**URL:** `deal.expl.one`
**Repo:** `github.com/explorills/one-deal`

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4 | Already built — modern, fast, team-familiar |
| **Runtime** | Bun | Fast installs, fast dev server, used across EXPL ecosystem |
| **Wallet** | RainbowKit + wagmi + viem | Polished wallet UX, 100+ wallets, EVM-native |
| **Backend** | Node.js + Express/Fastify | Fast prototyping, large ecosystem |
| **Database** | MongoDB (Mongoose) | Flexible schema for variable NFT metadata |
| **Search** | Elasticsearch | Full-text, fuzzy matching, autocomplete, faceted filters |
| **Indexing** | The Graph (subgraphs) | Decentralized on-chain data indexing via GraphQL |
| **Smart Contracts** | Solidity (forked from Seaport/LooksRare) | Battle-tested, customized for Flare/Songbird |
| **Storage** | IPFS (Pinata / NFT.Storage) | Decentralized NFT metadata and image storage |
| **Hosting** | AWS S3 + CloudFront | Existing infra pattern, CDN, custom domains |
| **CI/CD** | GitHub Actions → S3 deploy | Automated build/test/deploy pipeline |
| **Admin** | Separate React app or embedded routes | Full marketplace management dashboard |

---

## MVP Scope (v1.0 — Weeks 1-8)

### IN Scope
- Fixed-price NFT listings and purchases
- Flare + Songbird chain support
- ERC-721, ERC-1155, ERC-5192 (SoulBound display) support
- Wallet connect via RainbowKit
- User profiles with following
- Favorites and watchlists
- On-chain collection verification
- Open collection creation (anyone can deploy)
- IPFS metadata storage
- Optional royalties (ERC-2981 displayed, buyer chooses)
- Full-text search (Elasticsearch)
- Full admin panel
- Content moderation (NSFW, spam, copyright)
- Mobile-first responsive design
- Dark/light theme

### OUT of Scope (Post-MVP)
- Auctions and bidding
- Bundle sales
- Lazy minting
- Additional chains (BSC, Ethereum, L2s)
- Public API
- Advanced analytics dashboard (premium)
- Promoted listings system (premium)
- Verified creator badges (premium)
- API access tiers (premium)
- FTSO/FlareDrops integrations
- Comments and reviews
- Mobile native app

---

## Development Phases

### PHASE 1: Frontend UI (COMPLETE)
**Duration:** Done
**Status:** Built and pushed to GitHub

Deliverables:
- [x] Project scaffolding (React 19, TS, Vite, Tailwind 4, Bun)
- [x] Design system with dark/light theme (Electric Violet brand)
- [x] 10 base UI components (Button, Input, Modal, Toast, etc.)
- [x] 16 marketplace components (NFTCard, CollectionCard, FilterPanel, etc.)
- [x] 6 layout components (Header, Footer, MobileNav, etc.)
- [x] 10 pages (Home, Explore, NFT Detail, Collection, Profile, Create, Settings, Rankings, 404)
- [x] Full TypeScript types, mock data, routing

---

### PHASE 2: Smart Contracts (Weeks 1-3)
**Owner:** Founder
**Priority:** Critical path — everything depends on this

#### 2A: Marketplace Contract
- [ ] Fork Seaport or LooksRare marketplace contract
- [ ] Customize for Flare/Songbird (gas optimizations, native token handling)
- [ ] Fixed-price listing: `listItem(nftContract, tokenId, price)`
- [ ] Fixed-price purchase: `buyItem(listingId)` with payment in native token
- [ ] Cancel listing: `cancelListing(listingId)`
- [ ] Optional royalty distribution (read ERC-2981, pass to buyer as optional)
- [ ] Platform fee mechanism (configurable, starts at 0% for growth)
- [ ] Events: `ItemListed`, `ItemSold`, `ItemCancelled`, `OfferMade`

#### 2B: Collection Factory Contract
- [ ] Factory pattern for deploying new ERC-721 collections
- [ ] Factory pattern for deploying new ERC-1155 collections
- [ ] Configurable: name, symbol, base URI, royalty info, max supply
- [ ] Owner controls: mint, pause, update base URI
- [ ] Events: `CollectionCreated`

#### 2C: Testing & Audit
- [ ] Unit tests with Hardhat/Foundry (100% coverage on critical paths)
- [ ] Deploy to Songbird Coston (testnet)
- [ ] Integration testing with frontend
- [ ] Professional security audit before Flare mainnet

---

### PHASE 3: Backend API (Weeks 2-4)
**Parallel with smart contract work**

#### 3A: Core API Setup
- [ ] Node.js + Express/Fastify project scaffolding
- [ ] MongoDB connection + Mongoose models
- [ ] Authentication via wallet signature (Sign-In with Ethereum / EIP-4361)
- [ ] JWT session management
- [ ] API versioning (`/api/v1/`)
- [ ] Error handling middleware
- [ ] Rate limiting

#### 3B: Data Models (MongoDB)

```
User {
  address, displayName, bio, avatar, banner,
  socialLinks, followers[], following[],
  isVerified, createdAt
}

Collection {
  contractAddress, chainId, name, symbol,
  description, bannerImage, logoImage,
  creator (ref User), category, royaltyPercentage,
  stats { floorPrice, totalVolume, owners, items },
  isVerified, createdAt
}

NFT {
  contractAddress, tokenId, chainId,
  collection (ref Collection), owner (ref User),
  metadata { name, description, image, attributes[] },
  isListed, listingPrice, listingCurrency,
  favorites[], favoritesCount, createdAt
}

Activity {
  type (list/sale/transfer/mint/cancel),
  nft (ref NFT), collection (ref Collection),
  from (ref User), to (ref User),
  price, txHash, blockNumber, timestamp
}

Listing {
  nft (ref NFT), seller (ref User),
  price, currency, status (active/sold/cancelled),
  txHash, createdAt, expiresAt
}
```

#### 3C: API Endpoints

```
Auth:
  POST /auth/nonce          — get signing nonce
  POST /auth/verify         — verify signature, return JWT

Users:
  GET  /users/:address      — get profile
  PUT  /users/:address      — update profile (authed)
  POST /users/:address/follow — follow/unfollow

Collections:
  GET  /collections                — list (with search, filters, pagination)
  GET  /collections/:address       — get collection details
  GET  /collections/:address/nfts  — get NFTs in collection
  GET  /collections/:address/activity — get activity

NFTs:
  GET  /nfts                — list (with search, filters, pagination)
  GET  /nfts/:contract/:id  — get NFT details
  POST /nfts/:contract/:id/favorite — toggle favorite

Listings:
  GET  /listings            — active listings (with filters)
  POST /listings            — create listing (synced from chain events)

Activity:
  GET  /activity            — global activity feed
  GET  /activity/:address   — user activity

Search:
  GET  /search?q=           — unified search (NFTs, collections, users)

Rankings:
  GET  /rankings            — collection rankings (with timeframe filter)

Admin:
  GET  /admin/collections   — manage collections
  POST /admin/flag          — flag NFT/collection
  GET  /admin/reports       — user reports
  GET  /admin/stats         — marketplace statistics
```

#### 3D: Elasticsearch Integration
- [ ] Sync NFTs, collections, users to Elasticsearch indices
- [ ] Configure analyzers for NFT name/description search
- [ ] Autocomplete suggestions endpoint
- [ ] Faceted search (by chain, category, price range, status)

---

### PHASE 4: On-Chain Indexing (Weeks 3-4)

#### 4A: The Graph Subgraph
- [ ] Verify The Graph support for Flare/Songbird
- [ ] If supported: write subgraph schema + mappings for marketplace events
- [ ] If not supported: build custom indexer (Node.js event listener + MongoDB sync)

#### 4B: Event Indexing
- [ ] Index `ItemListed` events → create/update Listing + NFT docs
- [ ] Index `ItemSold` events → update Listing, NFT ownership, create Activity
- [ ] Index `ItemCancelled` events → update Listing status
- [ ] Index `Transfer` events → track NFT ownership changes
- [ ] Index `CollectionCreated` events → create Collection docs
- [ ] Backfill historical events on first run

---

### PHASE 5: Frontend Integration (Weeks 4-6)
**Connect the existing UI to real data**

#### 5A: Wallet Integration
- [ ] Install and configure wagmi + RainbowKit
- [ ] Add Flare + Songbird chain configs to wagmi
- [ ] Replace mock wallet button with real RainbowKit connect
- [ ] Sign-In with Ethereum flow (nonce → sign → JWT)
- [ ] Persist session, auto-reconnect

#### 5B: API Integration Layer
- [ ] Create API client (axios/fetch wrapper with JWT, base URL, error handling)
- [ ] React Query hooks for all API endpoints
- [ ] Optimistic updates for favorites, follows
- [ ] Loading/error states wired to real API responses

#### 5C: Smart Contract Integration
- [ ] wagmi hooks for contract reads (NFT metadata, ownership, listings)
- [ ] wagmi hooks for contract writes (list, buy, cancel)
- [ ] Transaction status UI (pending → confirming → confirmed → done)
- [ ] Gas estimation display before transactions

#### 5D: Replace Mock Data
- [ ] Home page: real trending collections, real top sellers, real featured NFTs
- [ ] Explore: real search + filters backed by Elasticsearch
- [ ] NFT Detail: real on-chain metadata, real listing data, real activity
- [ ] Collection page: real collection stats from indexer
- [ ] Profile: real user data, real owned/created/favorited NFTs
- [ ] Rankings: real volume/floor price data from indexer
- [ ] Create flows: real collection deployment + NFT minting transactions

---

### PHASE 6: Admin Panel (Week 5-6)

- [ ] Separate admin route group (`/admin/*`) with role-based access
- [ ] Dashboard: marketplace stats (volume, users, listings, sales)
- [ ] Collection management: verify, flag, remove
- [ ] NFT moderation: flag, hide, remove (NSFW, copyright)
- [ ] User reports: review and action
- [ ] Promoted listings: manage, approve, schedule
- [ ] Feature flags: toggle marketplace features without redeploy

---

### PHASE 7: Testing (Week 6-7)

#### Unit Tests
- [ ] Smart contract tests (Hardhat/Foundry) — all listing/buying/cancellation flows
- [ ] API endpoint tests (Jest/Vitest + Supertest)
- [ ] Frontend component tests (Vitest + Testing Library)

#### Integration Tests
- [ ] Full purchase flow: connect wallet → browse → buy → verify ownership
- [ ] Full listing flow: connect wallet → create collection → mint → list → verify on explore
- [ ] Profile flow: connect → edit profile → follow user → verify

#### Security Tests
- [ ] Smart contract audit (professional)
- [ ] API penetration testing (OWASP top 10)
- [ ] Input validation on all endpoints
- [ ] Rate limiting verification

---

### PHASE 8: Deployment & Launch (Week 7-8)

#### Pre-Launch Checklist
- [ ] Smart contracts deployed to Songbird mainnet
- [ ] Smart contracts deployed to Flare mainnet
- [ ] Subgraph deployed and syncing
- [ ] Backend deployed (EC2/ECS or serverless)
- [ ] MongoDB Atlas production cluster
- [ ] Elasticsearch production cluster
- [ ] Frontend built and deployed to S3 + CloudFront
- [ ] SSL certificate for deal.expl.one
- [ ] DNS configured (Route53)
- [ ] GitHub Actions CI/CD pipeline active
- [ ] Rollback plan documented

#### Launch Sequence
1. Deploy contracts to Songbird first (lower stakes)
2. Seed with known Songbird NFT collections
3. Soft launch — invite EXPL community
4. Monitor for 1 week, fix issues
5. Deploy to Flare mainnet
6. Public launch announcement

---

### PHASE 9: Post-Launch Iteration

**Month 2-3:**
- [ ] Add English auction support
- [ ] Add offer/negotiation system
- [ ] Add BSC chain support
- [ ] Launch promoted listings (first revenue feature)
- [ ] Launch verified creator badges

**Month 4-6:**
- [ ] Add Ethereum mainnet support
- [ ] Launch analytics dashboard (premium)
- [ ] Launch API access tiers (premium)
- [ ] Add lazy minting
- [ ] Add bundle sales
- [ ] Explore L2 chains (Arbitrum, Base, Optimism)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    deal.expl.one                         │
│              React 19 + TypeScript + Vite                │
│              RainbowKit + wagmi + viem                   │
│                  AWS S3 + CloudFront                     │
└──────────────┬──────────────────┬───────────────────────┘
               │ API calls        │ Contract calls (RPC)
               ▼                  ▼
┌──────────────────────┐  ┌──────────────────────────────┐
│   Node.js Backend    │  │   Flare / Songbird RPC       │
│   Express + MongoDB  │  │                              │
│   JWT Auth           │  │  ┌────────────────────────┐  │
│   Elasticsearch      │  │  │  Marketplace Contract  │  │
│                      │  │  │  (Seaport fork)        │  │
│   /api/v1/*          │  │  ├────────────────────────┤  │
└──────────┬───────────┘  │  │  Collection Factory    │  │
           │              │  │  (ERC-721 / ERC-1155)  │  │
           ▼              │  └────────────────────────┘  │
┌──────────────────────┐  └──────────────┬───────────────┘
│   MongoDB Atlas      │                 │ Events
│                      │                 ▼
│  Users, Collections  │  ┌──────────────────────────────┐
│  NFTs, Listings      │  │   The Graph (Subgraph)       │
│  Activities, Reports │  │   or Custom Indexer          │
└──────────────────────┘  │                              │
                          │   Indexes on-chain events    │
┌──────────────────────┐  │   → syncs to MongoDB         │
│   Elasticsearch      │  └──────────────────────────────┘
│                      │
│  Search indices for  │  ┌──────────────────────────────┐
│  NFTs, Collections,  │  │   IPFS (Pinata/NFT.Storage)  │
│  Users               │  │   NFT metadata + images      │
└──────────────────────┘  └──────────────────────────────┘
```

---

## File Structure (Target)

```
one-deal/
├── src/                          # Frontend (BUILT)
│   ├── components/               # UI + marketplace components
│   ├── pages/                    # All pages
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utilities
│   ├── types/                    # TypeScript interfaces
│   ├── context/                  # React contexts
│   ├── data/                     # Mock data (replaced by API)
│   ├── styles/                   # Global CSS
│   └── api/                      # API client + React Query hooks
├── contracts/                    # Smart contracts (TODO)
│   ├── src/                      # Solidity sources
│   ├── test/                     # Contract tests
│   ├── scripts/                  # Deploy scripts
│   └── hardhat.config.ts
├── server/                       # Backend API (TODO)
│   ├── src/
│   │   ├── routes/               # API routes
│   │   ├── models/               # Mongoose models
│   │   ├── middleware/           # Auth, rate limit, validation
│   │   ├── services/            # Business logic
│   │   ├── indexer/             # On-chain event indexer
│   │   └── search/              # Elasticsearch integration
│   └── package.json
├── subgraph/                     # The Graph subgraph (TODO)
│   ├── schema.graphql
│   ├── subgraph.yaml
│   └── src/mappings/
├── admin/                        # Admin panel (TODO)
│   └── src/
├── .github/workflows/            # CI/CD pipelines
├── FOUNDER-INTERVIEW.md          # Founder vision document
├── PROJECT-PLAN.md               # This file
└── README.md
```

---

## Key Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| The Graph doesn't support Flare/Songbird | Blocks indexing | Build custom indexer as fallback (Node.js + ethers.js event listener) |
| Smart contract vulnerability | Loss of user funds | Professional audit + testnet period + bug bounty |
| Solo developer bottleneck | Slow progress | AI-assisted development + clear modular architecture + phase-based delivery |
| Low initial volume on Flare/Songbird | No revenue | Seed with existing collections + community marketing + zero platform fees at launch |
| Elasticsearch operational overhead | Infrastructure complexity | Start with MongoDB text search, upgrade to Elasticsearch when search volume demands it |

---

*Plan generated from founder interview. Living document — update as decisions evolve.*
