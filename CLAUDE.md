# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Altman Utilization Audit** — a Next.js (App Router) parody site satirizing Sam Altman's reported comments about consumer RAM being "quite terrible" on the Cheeky Pint podcast. No database, no tracking, no required env vars.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at localhost:3000 |
| `npm run build` | Production build (outputs to `.next`) |
| `npm start` | Run production server |

No tests are configured — the `test` script exits with an error.

## Architecture

### Stack
- **Next.js 16** (App Router, React 19, TypeScript 7)
- **Client Components** for interactive parts (`"use client"`)
- **Server Components** for pages, metadata, OG image generation
- **No external APIs** — all data is deterministic/fake

### Key Directories
```
app/
├── page.tsx           # Home: audit UI + FAQ + links
├── Audit.tsx          # Client: interactive RAM audit wizard
├── layout.tsx         # Root layout, global metadata, JSON-LD
├── globals.css        # All styles (CSS custom properties, no framework)
├── og/route.tsx       # Dynamic OG image (ImageResponse)
├── ram/[size]/page.tsx  # Static pages per RAM size (generateStaticParams)
├── letter/page.tsx    # Long-form satire letter + LetterClient
├── donate/page.tsx    # Donation flow + DonateClient
├── sitemap.ts         # Static sitemap generation
└── robots.ts          # Robots.txt

lib/
├── tiers.ts           # Core logic: tiers, parsing, formatting, hashing
└── fake.ts            # Deterministic fake counters (time-based)
```

### Data Flow
1. User enters RAM amount on home page (`Audit.tsx`)
2. `parseGb` validates input → `tierOf` returns tier config
3. Client animates "scan" then shows warrant with share links
4. Share links encode `gb` and optional `n` (name) in query params
5. `/og?gb=...&n=...` generates share card (or downloads PNG with `&dl=1`)
6. `/ram/[size]` static pages show verdict + real-world context for each size
7. `/letter` and `/donate` read same query params for personalized content

### Tier System (`lib/tiers.ts`)
- **Tiers**: retro (<0.01 GB), 8, 16, 32, 64, 128, 256, mac
- Each tier has: `status`, `color`, `line` (warrant text), `post` (share text), `eta` (seconds), optional `siren`
- `parseGb` accepts `"mac"` or numeric GB (1–4096)
- `fmtRam` formats for display (GB/MB/KB)
- `hash` (FNV-1a) deterministic pseudo-randomness for utilization %, case numbers, rankings

### Fake Stats (`lib/fake.ts`)
- `fakeTotals(now)` — audits count + total GB confessed (linear from fixed epoch)
- `fakeDonations(now)` — donor count + donated GB
- `fakePct(g, n)` — "more RAM than X% of audited machines" (tier base + hash jitter)
- All deterministic from `Date.now()` — same numbers for every visitor at a given second

### Styling
- CSS custom properties in `:root` (`--bg`, `--ink`, `--dim`, `--paper`, `--c`, `--mono`, `--meme`)
- `--c` (accent color) overridden inline per tier for warrant/share UI
- Monospace default (`Courier New`), Impact for headlines
- Scanline overlay via `body::after`
- Reduced-motion media query disables animations

### SEO / Metadata
- Root layout: `metadataBase` from `NEXT_PUBLIC_SITE_URL` (defaults to `https://samsramraid.com`)
- Each page exports `generateMetadata` with Open Graph / Twitter cards pointing to `/og`
- JSON-LD: `WebApplication` (root), `FAQPage` (home, ram pages), `HowTo` (donate)
- Sitemap includes `/`, `/letter`, `/donate`, and all `/ram/[size]` pages

## Deployment Notes (from README)
1. `npm i && npm run dev` to preview
2. Push to GitHub → import at vercel.com/new (auto-detected)
3. Add domain in Vercel Project > Domains
4. Set `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` in Vercel env vars → redeploy
5. Submit sitemap to Google Search Console / Bing Webmaster Tools
6. Test share links (`/?ram=128&n=YourName`) in X card validator and Discord

## Conventions
- **Satire disclaimer** appears in footers, warrant stamp, and OG images
- **No real data collection** — `localStorage` only used for donation "confirmation" UI
- **Client components** only where interactivity needed (Audit, LetterClient, DonateClient)
- **Static generation** for `/ram/[size]` via `generateStaticParams`
- **Dynamic OG images** via `ImageResponse` (Edge-compatible)