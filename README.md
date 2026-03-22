## ONE Ecosystem - [expl.one](https://expl.one)

**ONE deal** is part of the ONE Ecosystem
// powered by [EXPL Nodes](https://node.expl.one)

# ONE Deal

The NFT marketplace for Flare and Songbird networks — built for the [EXPL.ONE](https://expl.one) ecosystem. Buy, sell, and transfer digital assets with fixed-price listings, peer-to-peer transfers, and cross-chain collection browsing.

**Live:** [deal.expl.one](https://deal.expl.one)
**Docs:** [docs.expl.one](https://docs.expl.one)

## Supported Networks

| Network | Chain ID | Currency | Explorer |
|---------|----------|----------|----------|
| Flare | 14 | FLR | [flare-explorer.flare.network](https://flare-explorer.flare.network) |
| Songbird | 19 | SGB | [songbird-explorer.flare.network](https://songbird-explorer.flare.network) |

## Features

- **Fixed-price listings** — List and buy NFTs with transparent pricing and 2.5% platform fee
- **Peer-to-peer transfers** — Send and receive NFTs directly from your profile
- **Collection browsing** — Explore collections across both networks with search and filtering
- **Auto-discovery** — Backend indexes collections and metadata via Blockscout v2 API
- **Image optimization** — IPFS images proxied through CloudFront CDN with Sharp resize + WebP conversion
- **Cross-ecosystem auth** — Wallet connection and identity through ONE ID

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript |
| Build | Bun, Vite 6 |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion |
| Icons | Phosphor Icons |
| Web3 | wagmi 3, viem 2 |
| Auth | [@explorills/one-ecosystem-ui](https://github.com/explorills/z-2-user-components) (ONE ID + Reown AppKit) |
| Backend | Bun.serve, SQLite (via `z-0-one-backend/one-deal`) |
| Deployment | AWS S3 + CloudFront |

## Architecture

```
src/
├── components/
│   ├── layout/          # Layout wrapper
│   ├── nft/             # NFTCard, CollectionCard
│   └── ui/              # Button, Skeleton, NetworkBadge
├── pages/
│   ├── Home.tsx         # Hero, stats, collections carousel, recent listings
│   ├── Explore.tsx      # Collection browser with search + network filter
│   ├── CollectionPage.tsx  # Collection detail with NFT grid + sorting
│   ├── NFTDetail.tsx    # NFT view with buy/list/cancel actions
│   └── Profile.tsx      # User holdings with send/list modals
├── lib/
│   ├── api.ts           # Backend API client
│   ├── contracts.ts     # Marketplace ABI + chain configs
│   ├── constants.ts     # Chain definitions, contract addresses
│   └── utils.ts         # Formatting helpers, ONE ID API URL
└── styles/
    └── index.css        # Design tokens (oklch color system)
```

## Smart Contracts

The OneDealMarketplace contract is deployed identically on both networks:

| Network | Address |
|---------|---------|
| Flare | `0x8aEe2b90E5A56a93B44E9DbEc78CA62da8060646` |
| Songbird | `0x3c3bf9cF0Ecd80ad33c22E7A91c5fD938AbB02d7` |

Functions: `listItem`, `buyItem`, `cancelListing` — standard ERC-721 marketplace with approval flow.

## Development

```bash
bun install
bun run dev
```

Dev server runs at `http://localhost:5173`. Requires ONE ID backend on port 3010 for authentication.

## Build

```bash
bun run build
```

Output in `dist/`.

## Deployment

Pushing to `main` triggers CI which builds and deploys to S3 staging. Production promotion is handled manually via S3 sync.

## Part of the ONE Ecosystem

ONE Deal is one of several interconnected projects powered by EXPL Nodes. All projects share a unified authentication layer and navigation through the `@explorills/one-ecosystem-ui` package.

- [EXPL.ONE](https://expl.one) — Main landing
- [EXPL Nodes](https://node.expl.one) — Infrastructure
- [ONE pump](https://pump.expl.one) — Token launch platform
- [ONE network](https://network.expl.one) — Node management dashboard
- [ONE chain](https://chain.expl.one) — EVM blockchain
- [ONE ID](https://id.expl.one) — Identity service
- [ONE box](https://box.expl.one) — Mystery experience
- [ONE world](https://world.expl.one) — Metaverse lobby
- [Documentation](https://docs.expl.one) — Ecosystem docs

## License

See [LICENSE](LICENSE) for details.
