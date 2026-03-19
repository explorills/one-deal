# ONE Deal

EVM-compatible NFT marketplace within the ONE ecosystem. Buy, sell, send, and receive digital assets with fixed-price transactions and peer-to-peer transfers.

**Live**: [deal.expl.one](https://deal.expl.one)
**Docs**: [docs.expl.one](https://docs.expl.one)

## Stack

- React 19, TypeScript, Vite
- Tailwind CSS 4
- Bun runtime
- Framer Motion, Phosphor Icons
- Authentication: [@explorills/one-id-auth](https://github.com/explorills/one-id-auth-components)
- Wallet: wagmi, viem, WalletConnect (via one-id-auth)

## Features

- Fixed-price NFT listings and purchases
- Peer-to-peer asset transfers (send/receive) from user profile
- Collection browsing with category filtering and sorting
- User profiles with holdings overview and activity history
- Cross-ecosystem authentication through ONE id

## Development

```bash
bun install
bun run dev
```

Dev server runs at `http://localhost:5173`.

## Build

```bash
bun run build
```

Output in `dist/`.

## Deployment

Pushing to `main` triggers the CI pipeline which builds and deploys to S3 staging. Production deployment is handled manually.

## Architecture

```
src/
├── components/       # Layout, NFT cards, UI primitives
├── pages/            # Route-level components
├── data/             # Mock data (pre-backend phase)
├── lib/              # Utilities, constants
└── types/            # TypeScript definitions
```

Authentication is delegated entirely to `@explorills/one-id-auth`. No wallet connection logic exists in this repository.

## Part of the ONE Ecosystem

ONE Deal is one of several interconnected projects powered by EXPL Nodes. All projects share a unified authentication layer through ONE id.

- [EXPL.ONE](https://expl.one) — Main
- [EXPL Nodes](https://node.expl.one) — Infrastructure
- [Documentation](https://docs.expl.one) — Ecosystem docs

## License

See [LICENSE](LICENSE) for details.
