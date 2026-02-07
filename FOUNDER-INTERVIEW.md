# ONE Deal — Founder Interview & Vision Document

> This document captures the founder's vision, decisions, and rationale for every aspect of the ONE Deal NFT Marketplace. Each section corresponds to an SDLC phase. Answers are polished for clarity while preserving the founder's original intent.

---

## Status: Complete

---

## PHASE 0: Product Vision & Requirements

### Q: What is ONE Deal's core identity?
**A:** A general-purpose EVM NFT marketplace — trade any NFT across any category (art, gaming, music, PFPs, virtual land, etc.). Open to everyone. Think OpenSea-level feature set, but starting lean and expanding.

### Q: Which EVM chains should ONE Deal support?
**A:** Starting with **Flare and Songbird** as the primary chains — these are underserved and represent the initial market opportunity. Then progressively adding **Binance Smart Chain**, **Ethereum mainnet**, and eventually all major EVM chains. Layer 2 networks (Arbitrum, Optimism, Base, etc.) are a future consideration built on top of L1 support. The architecture must be chain-agnostic from day one — ONE Deal is an EVM marketplace, not a single-chain marketplace.

### Q: What's the primary revenue model?
**A:** Premium features — the core marketplace functionality is free to use. Revenue comes from:
- **Promoted listings** — creators pay to feature NFTs in premium positions
- **Analytics dashboard** — free basic analytics, paid advanced tier (whale tracking, trends)
- **Verified creator badges** — paid verification with enhanced profile, priority support
- **API access** — rate-limited free tier, paid plans for higher limits

### Q: Who is the primary target user at launch?
**A:** Crypto natives — users already familiar with wallets, gas fees, and NFTs. No need to simplify the UX for mainstream onboarding in v1. Focus on power features and a fast, professional experience.

---

## PHASE 0B: Feature Decisions

### Q: What wallet connection approach?
**A:** RainbowKit or ConnectKit — pre-built wallet modal with polished UX, supports 100+ wallets out of the box. Fast to integrate, professional feel, and covers MetaMask, Rabby, Bifrost, and any WalletConnect-compatible wallet automatically.

### Q: What listing/sale types at launch?
**A:** **Fixed price only for MVP.** Seller sets a price, buyer pays it. Auctions, bidding, and advanced sale types are planned for post-launch updates. Simplicity first — ship fast, iterate.

### Q: Social and community features?
**A:** Two features at launch:
- **User profiles with following** — build a social graph, follow creators, activity feeds
- **Favorites and watchlists** — save NFTs and collections, notifications on price changes

No comments, reviews, or chat features for now.

### Q: How should collection verification work?
**A:** On-chain verification — auto-verify based on on-chain contract standards and ownership proof. No manual review process. This is scalable, trustless, and aligns with the decentralized ethos.

### Q: What NFT standards to support?
**A:** Three standards:
- **ERC-721** — standard single-edition NFTs (most common)
- **ERC-1155** — multi-edition NFTs (gaming items, editions)
- **ERC-5192 (SoulBound)** — non-transferable NFTs for display only (credentials, achievements)

### Q: Metadata storage?
**A:** IPFS via Pinata or NFT.Storage — decentralized, immutable, industry standard. The marketplace reads whatever the NFT contract points to, but the recommended and default flow for new collections uses IPFS.

### Q: Lazy minting?
**A:** Nice to have, not for MVP. Gas on Flare/Songbird is low enough that the barrier isn't critical. Plan the architecture to support it later.

### Q: Royalty enforcement?
**A:** Optional royalties — show the suggested royalty (respect ERC-2981), but let buyers choose whether to pay it. This balances creator support with buyer-friendly pricing. The UI should clearly display the royalty and encourage payment, but not force it.

### Q: Collection creation flow?
**A:** Open to all — any connected wallet can deploy a collection contract and start minting. Maximum openness, no gatekeeping. On-chain verification handles trust.

---

## PHASE 1: Architecture & Technical Decisions

### Q: Smart contract approach?
**A:** Fork proven contracts — likely Seaport (OpenSea) or LooksRare contracts as the base. Battle-tested security, faster to market, customize for Flare/Songbird specifics. Still requires audit before mainnet.

### Q: Backend infrastructure?
**A:** Node.js + MongoDB — flexible schema works well for NFT metadata which varies wildly between collections. Faster prototyping aligns with the aggressive 1-2 month timeline.

### Q: On-chain data indexing?
**A:** The Graph (subgraphs) — decentralized indexing with GraphQL queries. Need to verify Flare/Songbird support; if not available, fall back to a custom indexer as a temporary solution.

### Q: Frontend hosting?
**A:** AWS S3 + CloudFront — consistent with the existing EXPL ecosystem infrastructure. Full control over CDN, custom domains, caching.

### Q: Domain?
**A:** `deal.expl.one` — subdomain under the existing expl.one domain. Consistent with the ecosystem pattern (pump.expl.one, network.expl.one, world.expl.one).

### Q: Search?
**A:** Elasticsearch for full-text search — powerful, fast, supports fuzzy matching, autocomplete, and faceted filters. Industry standard for marketplace search.

### Q: Admin panel?
**A:** Yes — full admin dashboard for marketplace management. Covers collection management, NFT flagging, user reports, analytics overview, feature flags, promoted listings management. Essential for a professional marketplace.

---

## PHASE 2: Infrastructure & DevOps

### Q: CI/CD pipeline?
**A:** GitHub Actions + AWS — GitHub Actions handles build, test, and lint automation. On merge to main, automatically deploy to S3 + invalidate CloudFront cache. Clean, automated, integrated with the existing GitHub workflow.

### Q: Monitoring and error tracking?
**A:** Keep it simple for now — no AWS CloudWatch initially. Add monitoring tools as needed post-launch. Focus build effort on the marketplace itself, not infrastructure tooling.

### Q: Public API?
**A:** Not a priority for launch. Build the API for the frontend's needs first. Make it public and documented later once the data model and endpoints are stable.

### Q: Flare/Songbird-specific integrations?
**A:** Standard EVM only for now. Treat Flare/Songbird as standard EVM chains — no FTSO oracle integration, no FlareDrops tracking, no ecosystem-specific features in v1. This keeps the codebase chain-agnostic and speeds up multi-chain expansion.

---

## PHASE 3: Security

### Q: Security requirements?
**A:** Full security stack from day one:
- **Smart contract audit** — professional audit before mainnet deployment (non-negotiable for handling user funds)
- **Rate limiting & DDoS protection** — API rate limiting, Cloudflare protection, bot prevention
- **Content moderation** — NSFW detection, copyright claim system, spam collection filtering

---

## PHASE 4: Timeline & Team

### Q: Launch timeline?
**A:** 1-2 months — aggressive MVP. Fixed-price trading on Songbird/Flare, profiles, favorites, on-chain verification. Minimal features, maximum polish. Ship fast, iterate based on user feedback.

### Q: Team composition?
**A:** Solo founder + AI-assisted development. Founder handles architecture, decisions, and smart contract strategy. AI assists with code generation, debugging, and development velocity. No team hires planned initially — documentation and clean architecture are essential for future scalability.

---

## Founder's Core Principles

1. **Ship fast, iterate** — MVP with fixed price only, expand features post-launch
2. **Chain-agnostic architecture** — EVM-first, starting with Flare/Songbird, designed to scale to any EVM chain
3. **Open marketplace** — no gatekeeping on collections or creators
4. **Premium revenue model** — free to trade, pay for premium features
5. **Solo+AI velocity** — leverage AI development to move at team-speed as a solo founder
6. **Security non-negotiable** — audit contracts, protect users, moderate content

---

*Document generated from founder interview conducted during ONE Deal development kickoff.*
