import type { Metadata } from "next";
import { ALL_PROVIDERS } from "@/lib/providers";

export const metadata: Metadata = {
  title: "How It Works — API Documentation",
  description:
    "Complete documentation of every free API, streaming provider, and architectural decision behind smjStreamz.",
};

function ApiBlock({ label, url, response }: { label: string; url: string; response: string }) {
  return (
    <div className="rounded-lg bg-black/5 dark:bg-black/30 p-4 space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <code className="text-sm text-violet-400 break-all block">{url}</code>
      <p className="text-[10px] text-muted-foreground/70 mt-1">{response}</p>
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="my-16 flex items-center justify-center">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
    </div>
  );
}

function ApiIcon({ letter, color }: { letter: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    violet: "bg-violet-500/15 text-violet-400 border-violet-500/20",
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    fuchsia: "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/20",
    rose: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  };
  return (
    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border text-lg font-bold ${colorMap[color] ?? colorMap.violet}`}>
      {letter}
    </span>
  );
}

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* ── Page Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          How It Works
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl leading-relaxed">
          smjStreamz is an open-source aggregator that connects your browser to free, public APIs.
          This page documents every API, streaming provider, and architectural decision.
        </p>
      </div>

      {/* ── Zero Storage Policy Banner ── */}
      <div className="mb-12 rounded-xl border border-violet-500/20 bg-violet-500/[0.04] p-6">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-violet-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-violet-300">Zero Storage Policy</h2>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              smjStreamz <strong className="text-foreground/90">does not host, store, cache, or earn from any content</strong>.
              All anime, manga, comics, novels, movies, and TV shows are streamed or displayed directly from free, publicly
              available APIs. No video is transcoded or saved. No manga pages are stored on our servers. No user data is
              collected or transmitted. The app is a transparent pass-through to existing public services.
            </p>
          </div>
        </div>
      </div>

      {/* ── Architecture Diagram ── */}
      <section className="mb-4 space-y-4">
        <h2 className="text-xl font-bold text-violet-400">Architecture Overview</h2>
        <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 overflow-x-auto">
          {/* Flow diagram with CSS boxes and arrows */}
          <div className="flex flex-col items-center gap-0 min-w-[600px]">
            {/* Row 1: User Browser */}
            <div className="rounded-xl border-2 border-blue-500/40 bg-blue-500/10 px-6 py-3 text-center">
              <p className="text-xs text-blue-400 font-medium uppercase tracking-wider">Client</p>
              <p className="text-sm font-bold text-foreground mt-0.5">User Browser</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">localStorage for watchlist, preferences</p>
            </div>

            {/* Arrow down */}
            <div className="flex flex-col items-center">
              <div className="h-6 w-px bg-gradient-to-b from-blue-500/40 to-violet-500/40" />
              <svg viewBox="0 0 12 8" className="h-2 w-3 text-violet-500/60" fill="currentColor"><polygon points="6,8 0,0 12,0" /></svg>
            </div>

            {/* Row 2: smjStreamz */}
            <div className="rounded-xl border-2 border-violet-500/40 bg-violet-500/10 px-8 py-4 text-center">
              <p className="text-xs text-violet-400 font-medium uppercase tracking-wider">Aggregator</p>
              <p className="text-sm font-bold text-foreground mt-0.5">smjStreamz (Next.js)</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Server components + API proxy routes for CORS</p>
            </div>

            {/* Arrow down */}
            <div className="flex flex-col items-center">
              <div className="h-6 w-px bg-gradient-to-b from-violet-500/40 to-emerald-500/40" />
              <svg viewBox="0 0 12 8" className="h-2 w-3 text-emerald-500/60" fill="currentColor"><polygon points="6,8 0,0 12,0" /></svg>
            </div>

            {/* Row 3: External APIs grid */}
            <div className="w-full rounded-xl border border-border bg-black/[0.02] dark:bg-white/[0.02] p-4">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider text-center mb-3">External APIs (free, no key required)</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/[0.06] p-2.5 text-center">
                  <p className="text-xs font-semibold text-blue-400">AniList GraphQL</p>
                  <p className="text-[10px] text-muted-foreground">Anime/manga metadata</p>
                </div>
                <div className="rounded-lg border border-violet-500/20 bg-violet-500/[0.06] p-2.5 text-center">
                  <p className="text-xs font-semibold text-violet-400">Jikan / MAL</p>
                  <p className="text-[10px] text-muted-foreground">Info, episodes, relations</p>
                </div>
                <div className="rounded-lg border border-fuchsia-500/20 bg-fuchsia-500/[0.06] p-2.5 text-center">
                  <p className="text-xs font-semibold text-fuchsia-400">Anikoto</p>
                  <p className="text-[10px] text-muted-foreground">Streaming embed IDs</p>
                </div>
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] p-2.5 text-center">
                  <p className="text-xs font-semibold text-emerald-400">MangaDex</p>
                  <p className="text-[10px] text-muted-foreground">Manga chapters + images</p>
                </div>
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] p-2.5 text-center">
                  <p className="text-xs font-semibold text-amber-400">ComicK</p>
                  <p className="text-[10px] text-muted-foreground">Comics / manhwa</p>
                </div>
                <div className="rounded-lg border border-rose-500/20 bg-rose-500/[0.06] p-2.5 text-center">
                  <p className="text-xs font-semibold text-rose-400">NovelBin</p>
                  <p className="text-[10px] text-muted-foreground">Light novel chapters</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works Steps ── */}
      <section className="mb-4 space-y-4">
        <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold">1</span>
                <h4 className="font-semibold text-foreground/90 text-xs">DISCOVER</h4>
              </div>
              <p className="text-xs">Anikoto + Jikan for anime. MangaDex + ComicK for manga/comics. NovelBin for novels. Curated data for movies/TV.</p>
            </div>
            <div className="rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 text-xs font-bold">2</span>
                <h4 className="font-semibold text-foreground/90 text-xs">STREAM</h4>
              </div>
              <p className="text-xs">Embed providers serve anime/movie/TV video in iframes. Manga/comics read directly via MangaDex/ComicK image APIs.</p>
            </div>
            <div className="rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">3</span>
                <h4 className="font-semibold text-foreground/90 text-xs">READ</h4>
              </div>
              <p className="text-xs">Novel text fetched via /api/novels proxy (NovelBin has no CORS). Manga images loaded directly from MangaDex/ComicK CDN.</p>
            </div>
            <div className="rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500/10 text-fuchsia-400 text-xs font-bold">4</span>
                <h4 className="font-semibold text-foreground/90 text-xs">PERSIST</h4>
              </div>
              <p className="text-xs">Watchlist, continue watching/reading, and preferences all in browser localStorage. In-memory cache (5min TTL) for API calls.</p>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Anime Catalog APIs ── */}
      <section className="mb-4 space-y-6">
        <h2 className="text-xl font-bold text-violet-400">Anime Catalog APIs</h2>

        {/* Anikoto */}
        <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 space-y-4">
          <div className="flex items-start gap-4">
            <ApiIcon letter="Ak" color="fuchsia" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg font-semibold text-foreground">Anikoto API</h3>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 text-xs font-medium">Free &mdash; No Key &mdash; CORS OK</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Anime catalog with episode embed IDs. Each episode has an <code className="text-violet-400">episode_embed_id</code> used to build stream URLs.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-[10px] text-muted-foreground bg-black/[0.04] dark:bg-white/[0.04] rounded-md px-2 py-0.5 font-mono">anikotoapi.site</span>
                <span className="text-[10px] text-muted-foreground bg-black/[0.04] dark:bg-white/[0.04] rounded-md px-2 py-0.5">No data stored by smjStreamz</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <ApiBlock
              label="Recent Anime -- paginated list of recently updated"
              url="GET https://anikotoapi.site/recent-anime?page=1&per_page=24"
              response="Returns: {data: [{id, title, poster, score, year, genres[], is_sub, is_dub, mal_id}]}"
            />
            <ApiBlock
              label="Series Details -- anime info + all episodes"
              url="GET https://anikotoapi.site/series/{id}"
              response="Returns: {data: {anime: {title, poster, description, mal_id, ani_id}, episodes: [{number, episode_embed_id, embed_url: {sub, dub}}]}}"
            />
          </div>
        </div>

        {/* Jikan */}
        <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 space-y-4">
          <div className="flex items-start gap-4">
            <ApiIcon letter="Jk" color="violet" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg font-semibold text-foreground">Jikan API (MyAnimeList)</h3>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 text-xs font-medium">Free &mdash; No Key &mdash; CORS OK</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Unofficial MAL API. Provides search, top charts, details, relations, recommendations. Rate limit: ~3 req/sec.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-[10px] text-muted-foreground bg-black/[0.04] dark:bg-white/[0.04] rounded-md px-2 py-0.5 font-mono">api.jikan.moe/v4</span>
                <span className="text-[10px] text-muted-foreground bg-black/[0.04] dark:bg-white/[0.04] rounded-md px-2 py-0.5">No data stored by smjStreamz</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <ApiBlock
              label="Search Anime"
              url="GET https://api.jikan.moe/v4/anime?q={query}&limit=24&sfw=true"
              response="Returns: {data: [{mal_id, title, title_english, images, score, year, type, genres[], episodes}]}"
            />
            <ApiBlock
              label="Top Anime (by type)"
              url="GET https://api.jikan.moe/v4/top/anime?limit=24&type={tv|movie}&sfw=true"
              response="Same shape as search. Filterable by type=tv, type=movie"
            />
            <ApiBlock
              label="Anime Full Details"
              url="GET https://api.jikan.moe/v4/anime/{mal_id}/full"
              response="Returns: {data: {title, synopsis, score, episodes, status, genres[], relations[], ...}}"
            />
            <ApiBlock
              label="Relations (prequels/sequels)"
              url="GET https://api.jikan.moe/v4/anime/{mal_id}/relations"
              response="Returns: {data: [{relation, entry: [{mal_id, type, name, url}]}]}"
            />
            <ApiBlock
              label="Recommendations"
              url="GET https://api.jikan.moe/v4/anime/{mal_id}/recommendations"
              response="Returns: {data: [{entry: {mal_id, title, images}}]}"
            />
          </div>
        </div>

        {/* AniList */}
        <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 space-y-4">
          <div className="flex items-start gap-4">
            <ApiIcon letter="AL" color="blue" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg font-semibold text-foreground">AniList GraphQL</h3>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 text-xs font-medium">Free &mdash; No Key &mdash; CORS OK</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Used to convert MAL IDs to AniList IDs for streaming providers that need them.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-[10px] text-muted-foreground bg-black/[0.04] dark:bg-white/[0.04] rounded-md px-2 py-0.5 font-mono">graphql.anilist.co</span>
                <span className="text-[10px] text-muted-foreground bg-black/[0.04] dark:bg-white/[0.04] rounded-md px-2 py-0.5">No data stored by smjStreamz</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <ApiBlock
              label="MAL -> AniList ID conversion"
              url='POST https://graphql.anilist.co  Body: {"query": "query($malId:Int){Media(idMal:$malId,type:ANIME){id}}", "variables": {"malId": 1}}'
              response="Returns: {data: {Media: {id: 1}}}"
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Manga & Comics APIs ── */}
      <section className="mb-4 space-y-6">
        <h2 className="text-xl font-bold text-emerald-400">Manga &amp; Comics APIs</h2>

        {/* MangaDex */}
        <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 space-y-4">
          <div className="flex items-start gap-4">
            <ApiIcon letter="MD" color="emerald" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg font-semibold text-foreground">MangaDex API</h3>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 text-xs font-medium">Free &mdash; No Key &mdash; CORS OK</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Full manga catalog with chapter reading. Covers served from mangadex.org CDN. Chapter pages from at-home server.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-[10px] text-muted-foreground bg-black/[0.04] dark:bg-white/[0.04] rounded-md px-2 py-0.5 font-mono">api.mangadex.org</span>
                <span className="text-[10px] text-muted-foreground bg-black/[0.04] dark:bg-white/[0.04] rounded-md px-2 py-0.5">No data stored by smjStreamz</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <ApiBlock
              label="Search Manga"
              url="GET https://api.mangadex.org/manga?title={query}&limit=20&offset=0&order[relevance]=desc&includes[]=cover_art&includes[]=author"
              response="Returns: {data: [{id, attributes: {title: {en}, description: {en}, status, tags[]}, relationships: [{type: 'cover_art', attributes: {fileName}}]}]}"
            />
            <ApiBlock
              label="Popular Manga"
              url="GET https://api.mangadex.org/manga?order[followedCount]=desc&hasAvailableChapters=true&limit=20&includes[]=cover_art"
              response="Same shape. Cover URL: https://mangadex.org/covers/{mangaId}/{fileName}"
            />
            <ApiBlock
              label="Manga Details"
              url="GET https://api.mangadex.org/manga/{id}?includes[]=cover_art&includes[]=author&includes[]=artist"
              response="Returns: {data: {id, attributes: {title, description, status, year, tags[]}, relationships[]}}"
            />
            <ApiBlock
              label="Chapter List (paginated)"
              url="GET https://api.mangadex.org/manga/{id}/feed?offset=0&limit=96&order[chapter]=desc&translatedLanguage[]=en"
              response="Returns: {data: [{id, attributes: {chapter, title, volume, pages, publishAt}}]}"
            />
            <ApiBlock
              label="Read Chapter (get page images)"
              url="GET https://api.mangadex.org/at-home/server/{chapterId}"
              response="Returns: {baseUrl, chapter: {hash, data: ['file1.png', ...]}}. Image URL: {baseUrl}/data/{hash}/{filename}"
            />
          </div>
        </div>

        {/* ComicK */}
        <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 space-y-4">
          <div className="flex items-start gap-4">
            <ApiIcon letter="CK" color="amber" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg font-semibold text-foreground">ComicK API</h3>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 text-xs font-medium">Free &mdash; No Key &mdash; CORS OK</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Comics/webtoons/manga via comick.art. Covers from meo.comick.pictures CDN. Requires User-Agent header.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-[10px] text-muted-foreground bg-black/[0.04] dark:bg-white/[0.04] rounded-md px-2 py-0.5 font-mono">comick.art/api</span>
                <span className="text-[10px] text-muted-foreground bg-black/[0.04] dark:bg-white/[0.04] rounded-md px-2 py-0.5">No data stored by smjStreamz</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <ApiBlock
              label="Search Comics"
              url="GET https://comick.art/api/search?q={query}  Headers: User-Agent required"
              response='Returns: [{slug, title, default_thumbnail, md_covers: [{b2key}], status, description}]. Image: https://meo.comick.pictures/{b2key}'
            />
            <ApiBlock
              label="Chapter List"
              url="GET https://comick.art/api/comics/{slug}/chapter-list?page=1  Headers: User-Agent required"
              response="Returns: {data: [{hid, chap, vol, lang, title, created_at}]}. Page size: 50. Filter: lang=en"
            />
            <ApiBlock
              label="Read Chapter (get page images)"
              url="GET https://comick.art/api/comics/{slug}/{hid}-chapter-{chap}-{lang}  Headers: User-Agent required"
              response="Returns: {chapter: {images: [{url}]}}. Images are full CDN URLs."
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Light Novels APIs ── */}
      <section className="mb-4 space-y-6">
        <h2 className="text-xl font-bold text-amber-400">Light Novels APIs</h2>

        {/* Jikan LN */}
        <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 space-y-4">
          <div className="flex items-start gap-4">
            <ApiIcon letter="Jk" color="violet" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg font-semibold text-foreground">Jikan (Light Novel Metadata)</h3>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 text-xs font-medium">Free &mdash; CORS OK</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Light novel browse/search uses Jikan with type=lightnovel filter.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-[10px] text-muted-foreground bg-black/[0.04] dark:bg-white/[0.04] rounded-md px-2 py-0.5 font-mono">api.jikan.moe/v4</span>
                <span className="text-[10px] text-muted-foreground bg-black/[0.04] dark:bg-white/[0.04] rounded-md px-2 py-0.5">No data stored by smjStreamz</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <ApiBlock
              label="Browse Top Light Novels"
              url="GET https://api.jikan.moe/v4/top/manga?type=lightnovel&filter=bypopularity&page=1&limit=24"
              response="Returns: {data: [{mal_id, title, title_english, images, score, volumes, chapters, status, synopsis, authors[]}]}"
            />
            <ApiBlock
              label="Search Light Novels"
              url="GET https://api.jikan.moe/v4/manga?q={query}&type=lightnovel&page=1&limit=24"
              response="Same shape as browse."
            />
          </div>
        </div>

        {/* NovelBin */}
        <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 space-y-4">
          <div className="flex items-start gap-4">
            <ApiIcon letter="NB" color="rose" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg font-semibold text-foreground">NovelBin (Chapter Content)</h3>
                <span className="rounded-full bg-yellow-500/10 text-yellow-400 px-2.5 py-0.5 text-xs font-medium">Proxied via /api/novels &mdash; No CORS</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">NovelBin has no CORS headers, so requests go through our Next.js API route at <code className="text-violet-400">/api/novels</code>. All actions use GET with query params.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-[10px] text-muted-foreground bg-black/[0.04] dark:bg-white/[0.04] rounded-md px-2 py-0.5 font-mono">novelbin.me (via /api/novels proxy)</span>
                <span className="text-[10px] text-muted-foreground bg-black/[0.04] dark:bg-white/[0.04] rounded-md px-2 py-0.5">No data stored by smjStreamz</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <ApiBlock
              label="Search Novels"
              url="GET /api/novels?action=search&q={query}"
              response='Returns: [{id: "slug", title, image: "https://images.novelbin.me/novel/{slug}.jpg"}]'
            />
            <ApiBlock
              label="Novel Info"
              url="GET /api/novels?action=info&id={slug}"
              response="Returns: {id, title, description, image, author, status, genres[]}"
            />
            <ApiBlock
              label="Chapter List"
              url="GET /api/novels?action=chapters&id={slug}"
              response='Returns: [{id: "slug/chapter-N", title: "Chapter N", url}]'
            />
            <ApiBlock
              label="Read Chapter"
              url="GET /api/novels?action=read&id={slug/chapter-N}"
              response='Returns: {title, content: "plain text...", prevChapter: "slug/chapter-N-1" | null, nextChapter: "slug/chapter-N+1" | null}'
            />
          </div>
          <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-3">
            <p className="text-xs text-muted-foreground">
              <strong className="text-amber-400">Upstream:</strong> The proxy calls <code className="text-amber-300">novelbin.me</code> endpoints:
              <code className="block mt-1 text-amber-300/70">/ajax/search-novel?keyword=... (XHR header required)</code>
              <code className="block text-amber-300/70">/ajax/chapter-archive?novelId=... (XHR header required)</code>
              <code className="block text-amber-300/70">/novel-book/slug/chapter-N (HTML, parse #chr-content div)</code>
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Streaming Providers ── */}
      <section className="mb-4 space-y-6">
        <h2 className="text-xl font-bold text-violet-400">Streaming Providers (Video)</h2>

        {/* Explanation card */}
        <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 space-y-3">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-violet-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5,3 19,12 5,21 5,3" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground/90">How Streaming Works</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                  <span>All video streams are <strong className="text-foreground/90">embedded via iframe</strong> from third-party providers (MegaPlay, AnimPlay, Videasy, VidSrc, etc.).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                  <span>smjStreamz <strong className="text-foreground/90">does not host, transcode, or cache any video content</strong>. It only constructs the embed URL.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                  <span>Your browser <strong className="text-foreground/90">connects directly to the provider</strong>. Video traffic never passes through smjStreamz servers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                  <span>All embed URLs only work inside <code className="text-violet-400">&lt;iframe&gt;</code> tags. Direct access returns 403/404.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Provider table */}
        <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 font-medium text-muted-foreground">Provider</th>
                  <th className="py-3 pr-4 font-medium text-muted-foreground">Content</th>
                  <th className="py-3 pr-4 font-medium text-muted-foreground">URL Pattern</th>
                  <th className="py-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ALL_PROVIDERS.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 pr-4 font-medium text-violet-400">{p.name}</td>
                    <td className="py-3 pr-4 text-muted-foreground text-xs">
                      {p.types.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground/70 text-xs font-mono">{new URL(p.url).hostname}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${
                        p.enabled
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-zinc-500/10 text-muted-foreground"
                      }`}>
                        {p.enabled ? "Active" : "Disabled"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* URL patterns */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-black/20 p-4 space-y-2">
            <h4 className="font-medium text-blue-400 text-sm">Anime Stream URLs</h4>
            <code className="block text-xs text-violet-400/80 break-all">megaplay.buzz/stream/s-2/{'{embed_id}'}/{'{sub|dub}'}</code>
            <code className="block text-xs text-violet-400/80 break-all">megaplay.buzz/stream/mal/{'{mal_id}'}/{'{episode}'}/{'{sub|dub}'}</code>
          </div>
          <div className="rounded-lg bg-black/20 p-4 space-y-2">
            <h4 className="font-medium text-fuchsia-400 text-sm">Movie/TV Stream URLs</h4>
            <code className="block text-xs text-violet-400/80 break-all">player.videasy.to/movie/{'{tmdb_id}'}</code>
            <code className="block text-xs text-violet-400/80 break-all">player.videasy.to/tv/{'{tmdb_id}'}/{'{season}'}/{'{episode}'}</code>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Technical Approach ── */}
      <section className="mb-4 space-y-6">
        <h2 className="text-xl font-bold text-violet-400">Technical Approach</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* CORS Proxy */}
          <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground/90 text-sm">Server-Side CORS Proxy</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              API routes like <code className="text-violet-400">/api/novels</code> and the ComicK image proxy exist only to bypass
              CORS restrictions on upstream APIs. They forward requests, return the response, and store nothing.
            </p>
          </div>

          {/* No Database */}
          <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground/90 text-sm">No Database</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All user data -- watchlist, continue watching/reading progress, streaming provider preferences -- lives
              entirely in the browser&apos;s <code className="text-violet-400">localStorage</code>. There is no backend database, no cloud sync, no server-side state.
            </p>
          </div>

          {/* No Auth */}
          <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-fuchsia-500/20 bg-fuchsia-500/10">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-fuchsia-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground/90 text-sm">No Auth, No Tracking</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              There are no user accounts, no authentication, no cookies (beyond Next.js internals), no analytics,
              and no data collection of any kind. The app is fully anonymous.
            </p>
          </div>

          {/* Open Source Aggregator */}
          <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground/90 text-sm">Open Source Aggregator</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              smjStreamz follows the aggregator pattern: it discovers content from multiple free APIs, presents a unified
              interface, and delegates playback/reading to the original sources. All code is open source and auditable.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Caching Strategy ── */}
      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-bold text-violet-400">Caching Strategy</h2>
        <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 text-sm text-muted-foreground">
          <ul className="space-y-2 ml-5 list-disc">
            <li><strong className="text-foreground/70">In-memory cache</strong> -- All manga/comics API calls cached 5min (search, browse) or 10min (details). Shared across components via lib/cache.ts</li>
            <li><strong className="text-foreground/70">Anikoto</strong> -- 5 minutes (Next.js ISR)</li>
            <li><strong className="text-foreground/70">Jikan</strong> -- Rate limited at ~3 req/sec, search cached 1min, others 1hr</li>
            <li><strong className="text-foreground/70">Movies/TV</strong> -- Static curated data, zero API calls</li>
            <li><strong className="text-foreground/70">Client state</strong> -- Watchlist, continue watching/reading, server preference all in localStorage</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
