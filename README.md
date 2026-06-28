# smjStreamz

A free, open-source anime/manga/movies/light novels aggregator built with Next.js 16 and React 19. No accounts, no tracking, no data collection — everything runs in your browser.

## What It Does

- **Anime** — Browse, search, and stream anime via embedded players (MegaPlay, Videasy, etc.)
- **Manga & Comics** — Read manga from MangaDex and comics/webtoons from ComicK
- **Light Novels** — Read novels sourced from NovelFire (with FreeWebNovel/NovelBin fallbacks)
- **Movies & TV** — Browse curated catalogs and stream via embedded players
- **Watchlist & Progress** — Track what you're watching/reading (stored in browser localStorage)

## Architecture

```
Browser (localStorage)  →  Next.js (API proxy + SSR)  →  External APIs
```

- **Zero storage** — No content is hosted, cached, or stored on the server
- **No database** — All user state lives in `localStorage`
- **No auth** — Fully anonymous, no accounts or cookies
- **CORS proxies** — `/api/novels`, `/api/tmdb`, `/api/mangadex`, `/api/img-proxy` bypass upstream CORS restrictions

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn/bun)
- A free [TMDB API key](https://www.themoviedb.org/settings/api) (for movies/TV — everything else works without keys)

### Setup

```bash
# Clone the repo
git clone https://github.com/Shashwat-Manglam-Jain/anime-movie-freestream.git
cd anime-movie-freestream

# Install dependencies
npm install

# Create your env file
cp .env.example .env.local
# Edit .env.local and add your TMDB API key

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `TMDB_API_KEY` | For movies/TV | Free API key from [themoviedb.org](https://www.themoviedb.org/settings/api) |
| `Access_Token` | For movies/TV | TMDB API read access token (bearer auth) |

Anime, manga, comics, and light novels work without any API keys.

## Project Structure

```
app/
├── api/
│   ├── anime/route.ts          # Anime data proxy
│   ├── novels/route.ts         # Novel proxy (NovelFire → FreeWebNovel → NovelBin)
│   ├── tmdb/route.ts           # TMDB proxy for movies/TV
│   ├── mangadex/[...path]/     # MangaDex CORS proxy
│   └── img-proxy/route.ts      # Image proxy
├── anime/                      # Anime browse + detail pages
├── manga/                      # Manga browse + reader
├── comics/                     # Comics browse
├── light-novels/               # Novel browse + detail + reader
├── movies/                     # Movie catalog
├── tv/                         # TV show catalog
├── watch/                      # Anime/movie/TV streaming player
├── watchlist/                  # User watchlist page
├── search/                     # Global search
├── docs/                       # API documentation ("How It Works")
└── dmca/                       # DMCA/legal info

components/
├── header.tsx                  # Navigation
├── hls-player.tsx              # HLS video player
├── content-card.tsx            # Reusable content card
├── featured-carousel.tsx       # Hero carousel
├── continue-watching.tsx       # Resume watching/reading
├── episode-list.tsx            # Episode selector
├── watchlist-button.tsx        # Add/remove from watchlist
└── ui/                         # shadcn/ui primitives (badge, button, card, etc.)

lib/
├── anikoto.ts                  # Anikoto API client (anime + embed IDs)
├── jikan.ts                    # Jikan/MAL API client
├── manga-api.ts                # MangaDex + ComicK client
├── novel-api.ts                # Novel API client (search, chapters, reading)
├── providers.ts                # Streaming provider configs
├── cache.ts                    # In-memory cache (5min TTL)
├── curated.ts                  # Curated movies/TV data
├── watchlist.ts                # localStorage watchlist manager
├── types.ts                    # TypeScript types
└── utils.ts                    # Utilities
```

## External APIs Used

All APIs are free and require no API keys (except TMDB for movies/TV).

| API | Used For | Endpoint |
|---|---|---|
| [Anikoto](https://anikotoapi.site) | Anime catalog + embed IDs | `anikotoapi.site` |
| [Jikan](https://jikan.moe) | MAL data — anime, manga, light novels | `api.jikan.moe/v4` |
| [AniList](https://anilist.co) | GraphQL — novel metadata, ID conversion | `graphql.anilist.co` |
| [MangaDex](https://mangadex.org) | Manga search, chapters, page images | `api.mangadex.org` |
| [ComicK](https://comick.io) | Comics/webtoons/manhwa | `comick.art/api` |
| [NovelFire](https://novelfire.net) | Novel search, chapters, reading | `novelfire.net` (via `/api/novels`) |
| [TMDB](https://www.themoviedb.org) | Movie/TV metadata and images | `api.themoviedb.org/3` |

## Contributing

Contributions are welcome! Here's how to get started:

### Finding Issues

- Check existing [GitHub Issues](https://github.com/Shashwat-Manglam-Jain/anime-movie-freestream/issues)
- Look for `good first issue` or `help wanted` labels
- Or open a new issue describing the bug/feature before starting work

### Development Workflow

1. **Fork** the repo and clone your fork
2. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Install dependencies** and make sure the dev server runs:
   ```bash
   npm install
   npm run dev
   ```
4. **Make your changes** — the app hot-reloads on save
5. **Test your changes**:
   ```bash
   # Type check
   npx tsc --noEmit

   # Lint
   npm run lint

   # Build (catches SSR issues)
   npm run build
   ```
6. **Commit** with a clear message describing what changed and why
7. **Push** and open a Pull Request against `main`

### Code Guidelines

- **TypeScript** — The project uses strict TypeScript. No `any` types unless unavoidable.
- **Styling** — Tailwind CSS v4 with shadcn/ui components. Follow existing patterns.
- **No new dependencies** without discussion — open an issue first if you need a new package.
- **No secrets in code** — API keys go in `.env.local`, never committed.
- **No content hosting** — This is an aggregator. All content must come from external APIs at request time.

### Common Contribution Areas

- **Adding streaming providers** — Add new entries in `lib/providers.ts`
- **Fixing scrapers** — Upstream sites change their HTML frequently. If novels/manga stop loading, the regex parsers in the API routes likely need updating.
- **UI improvements** — New features, better mobile experience, accessibility
- **New content sources** — Adding new manga/novel/anime APIs
- **Bug fixes** — Check the issues page or report new ones

### API Route Architecture

The `/api/novels` route follows a cascading fallback pattern:

```
NovelFire (primary) → FreeWebNovel (fallback) → NovelBin (fallback)
```

Each source has four operations: `search`, `info`, `chapters`, `read`. If the primary source fails (Cloudflare block, site down, HTML changed), it falls through to the next source. When adding or fixing a source, follow this same pattern.

## Tech Stack

- **Framework** — [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **UI** — [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com)
- **Language** — TypeScript 5 (strict mode)
- **Video** — [hls.js](https://github.com/video-dev/hls.js) for HLS streaming
- **Icons** — [Lucide React](https://lucide.dev)

## Deployment

Deploy to any platform that supports Next.js:

```bash
npm run build
npm start
```

Or deploy to [Vercel](https://vercel.com) with one click — just connect the repo and set the environment variables.

## License

Open source. See the repository for license details.
