import type { Metadata } from "next";
import { ALL_PROVIDERS } from "@/lib/providers";

export const metadata: Metadata = {
  title: "API Documentation",
  description:
    "Complete documentation of every free streaming API used by smjStreamz.",
};

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">
          API Documentation
        </h1>
        <p className="mt-2 text-zinc-500 max-w-2xl">
          smjStreamz uses only free, no-API-key-required services. This page
          documents every API — what it does, what it returns, and how the app uses it.
        </p>
      </div>

      {/* Architecture */}
      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-bold text-violet-400">How It Works</h2>
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-6 space-y-4 text-sm text-zinc-400 leading-relaxed">
          <p>
            smjStreamz is a{" "}
            <strong className="text-zinc-200">client-side aggregator</strong>.
            It does not host, store, or proxy any video content.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold">1</span>
                <h4 className="font-semibold text-zinc-200 text-xs">DISCOVER</h4>
              </div>
              <p className="text-xs">Anikoto API provides anime catalog with episode IDs. Jikan API provides search, ratings, and related seasons. Movies/TV use curated data.</p>
            </div>
            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 text-xs font-bold">2</span>
                <h4 className="font-semibold text-zinc-200 text-xs">STREAM</h4>
              </div>
              <p className="text-xs">Embed providers (MegaPlay, AnimPlay for anime; Videasy, VidSrc, VidLink Pro, AutoEmbed for movies/TV) serve video inside iframes. The app just constructs the URL.</p>
            </div>
            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500/10 text-fuchsia-400 text-xs font-bold">3</span>
                <h4 className="font-semibold text-zinc-200 text-xs">PERSIST</h4>
              </div>
              <p className="text-xs">Watchlist, continue watching, and server preference all live in your browser&apos;s localStorage. Nothing is sent to any server.</p>
            </div>
          </div>
          <div className="rounded-lg bg-violet-500/5 border border-violet-500/10 p-4">
            <p className="text-sm text-zinc-400">
              <strong className="text-violet-400">Note:</strong> All embed URLs
              only work inside{" "}
              <code className="text-violet-400">&lt;iframe&gt;</code> tags.
              Direct access via browser or curl returns 403/404 by design.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog APIs — detailed */}
      <section className="mb-12 space-y-6">
        <h2 className="text-xl font-bold text-violet-400">Catalog APIs</h2>
        <p className="text-sm text-zinc-500">
          These APIs provide the data that powers browsing, search, and anime details. They do <strong className="text-zinc-300">not</strong> serve video — that&apos;s the streaming providers below.
        </p>

        {/* Anikoto */}
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Anikoto API</h3>
            <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 text-xs font-medium">
              Free &mdash; No Key
            </span>
          </div>
          <div className="text-sm text-zinc-400 space-y-2">
            <p><strong className="text-zinc-200">What it does:</strong> Provides anime catalog data — titles, posters, genres, episodes. Each episode has an <code className="text-violet-400">episode_embed_id</code> used to build MegaPlay/AnimPlay stream URLs.</p>
            <p><strong className="text-zinc-200">Used for:</strong> Anime browse page (&quot;All&quot; tab), anime detail page, episode lists with sub/dub info.</p>
            <p><strong className="text-zinc-200">Does NOT do:</strong> Search, top charts, related anime. Those come from Jikan.</p>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg bg-black/30 p-4">
              <p className="text-xs text-zinc-500 mb-1">Recent Anime — returns paginated list of recently updated anime</p>
              <code className="text-sm text-violet-400 break-all">
                GET https://anikotoapi.site/recent-anime?page=1&amp;per_page=24
              </code>
              <p className="text-[10px] text-zinc-600 mt-2">Returns: title, poster, score, year, genres, is_sub, is_dub, mal_id</p>
            </div>
            <div className="rounded-lg bg-black/30 p-4">
              <p className="text-xs text-zinc-500 mb-1">Series Details — returns anime info + all episodes with embed IDs</p>
              <code className="text-sm text-violet-400 break-all">
                GET https://anikotoapi.site/series/&#123;id&#125;
              </code>
              <p className="text-[10px] text-zinc-600 mt-2">Returns: anime metadata + episodes[] with episode_embed_id, embed_url.sub/dub</p>
            </div>
          </div>
        </div>

        {/* Jikan */}
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Jikan API (MyAnimeList)</h3>
            <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 text-xs font-medium">
              Free &mdash; No Key
            </span>
          </div>
          <div className="text-sm text-zinc-400 space-y-2">
            <p><strong className="text-zinc-200">What it does:</strong> Unofficial MAL API that provides search, top charts, anime details, and relations (prequels/sequels). Returns <code className="text-violet-400">mal_id</code> used to build MAL-based stream URLs.</p>
            <p><strong className="text-zinc-200">Used for:</strong> Search page, Top Rated/TV Series/Movies filter tabs, anime info on watch page, &quot;Seasons &amp; Related&quot; section, episode count.</p>
            <p><strong className="text-zinc-200">Does NOT do:</strong> Provide embed IDs or video. It provides mal_id which MegaPlay/AnimPlay accept for streaming.</p>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg bg-black/30 p-4">
              <p className="text-xs text-zinc-500 mb-1">Search — find anime by name</p>
              <code className="text-sm text-violet-400 break-all">
                GET https://api.jikan.moe/v4/anime?q=&#123;query&#125;&amp;limit=24&amp;sfw=true
              </code>
              <p className="text-[10px] text-zinc-600 mt-2">Returns: title, images, score, year, type (TV/Movie/OVA), genres, episodes count</p>
            </div>
            <div className="rounded-lg bg-black/30 p-4">
              <p className="text-xs text-zinc-500 mb-1">Top Anime — ranked by score, filterable by type</p>
              <code className="text-sm text-violet-400 break-all">
                GET https://api.jikan.moe/v4/top/anime?limit=24&amp;type=&#123;tv|movie&#125;&amp;sfw=true
              </code>
              <p className="text-[10px] text-zinc-600 mt-2">Powers the Top Rated, TV Series, and Movies tabs on /anime page</p>
            </div>
            <div className="rounded-lg bg-black/30 p-4">
              <p className="text-xs text-zinc-500 mb-1">Anime Details — full info for a specific anime</p>
              <code className="text-sm text-violet-400 break-all">
                GET https://api.jikan.moe/v4/anime/&#123;mal_id&#125;
              </code>
              <p className="text-[10px] text-zinc-600 mt-2">Used on watch page to show poster, synopsis, score, episode count</p>
            </div>
            <div className="rounded-lg bg-black/30 p-4">
              <p className="text-xs text-zinc-500 mb-1">Relations — prequels, sequels, spin-offs</p>
              <code className="text-sm text-violet-400 break-all">
                GET https://api.jikan.moe/v4/anime/&#123;mal_id&#125;/relations
              </code>
              <p className="text-[10px] text-zinc-600 mt-2">Powers the &quot;Seasons &amp; Related&quot; section on watch page</p>
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            <strong className="text-zinc-400">Rate limit:</strong> ~3 req/sec.
            Responses are cached server-side (search 60s, others 1 hour).
          </p>
        </div>
      </section>

      {/* Streaming Providers — detailed */}
      <section className="mb-12 space-y-6">
        <h2 className="text-xl font-bold text-violet-400">
          Streaming Providers
        </h2>
        <p className="text-sm text-zinc-500">
          These serve the actual video inside iframes. Each has its own player with quality settings. Toggle them in{" "}
          <a href="/settings" className="text-violet-400 underline">Settings</a>. Your last-used server is remembered.
        </p>

        {/* Anime providers */}
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-6 space-y-4">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            Anime Streaming
          </h3>
          <div className="space-y-4">
            <div className="rounded-lg bg-black/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-violet-400">MegaPlay</h4>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-medium">Primary</span>
              </div>
              <p className="text-xs text-zinc-400">Main anime server with sub/dub support. Sources from HiAnime. Accepts both Anikoto embed IDs and MAL IDs.</p>
              <div className="space-y-1 text-xs">
                <code className="block text-violet-400/80 break-all">https://megaplay.buzz/stream/s-2/&#123;embed_id&#125;/&#123;sub|dub&#125;</code>
                <code className="block text-violet-400/80 break-all">https://megaplay.buzz/stream/mal/&#123;mal_id&#125;/&#123;episode&#125;/&#123;sub|dub&#125;</code>
              </div>
            </div>
            <div className="rounded-lg bg-black/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-violet-400">AnimPlay</h4>
                <span className="rounded-full bg-yellow-500/10 text-yellow-400 px-2 py-0.5 text-[10px] font-medium">Backup 1</span>
              </div>
              <p className="text-xs text-zinc-400">Mirror of MegaPlay on a different domain. Works when MegaPlay is down.</p>
              <div className="space-y-1 text-xs">
                <code className="block text-violet-400/80 break-all">https://animeplay.cfd/stream/mal/&#123;mal_id&#125;/&#123;episode&#125;/&#123;sub|dub&#125;</code>
              </div>
            </div>
          </div>
        </div>

        {/* Movie/TV providers */}
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-6 space-y-4">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-fuchsia-400" />
            Movie &amp; TV Streaming
          </h3>
          <div className="space-y-4">
            <div className="rounded-lg bg-black/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-violet-400">Videasy</h4>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-medium">Primary</span>
              </div>
              <p className="text-xs text-zinc-400">Clean player with auto quality selection. Movies and TV shows only.</p>
              <div className="space-y-1 text-xs">
                <code className="block text-violet-400/80 break-all">https://player.videasy.to/movie/&#123;tmdb_id&#125;</code>
                <code className="block text-violet-400/80 break-all">https://player.videasy.to/tv/&#123;tmdb_id&#125;/&#123;season&#125;/&#123;episode&#125;</code>
              </div>
            </div>
            <div className="rounded-lg bg-black/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-violet-400">VidSrc</h4>
                <span className="rounded-full bg-yellow-500/10 text-yellow-400 px-2 py-0.5 text-[10px] font-medium">Backup 1</span>
              </div>
              <p className="text-xs text-zinc-400">Multi-source player with quality selector and subtitles. Movies and TV shows only.</p>
              <div className="space-y-1 text-xs">
                <code className="block text-violet-400/80 break-all">https://vidsrc.pm/embed/movie/&#123;tmdb_id&#125;</code>
                <code className="block text-violet-400/80 break-all">https://vidsrc.pm/embed/tv/&#123;tmdb_id&#125;/&#123;season&#125;/&#123;episode&#125;</code>
              </div>
            </div>
            <div className="rounded-lg bg-black/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-violet-400">VidLink Pro</h4>
                <span className="rounded-full bg-yellow-500/10 text-yellow-400 px-2 py-0.5 text-[10px] font-medium">Backup 2</span>
              </div>
              <p className="text-xs text-zinc-400">Fast HD embeds up to 4K. Clean player with minimal ads. Uses TMDB IDs.</p>
              <div className="space-y-1 text-xs">
                <code className="block text-violet-400/80 break-all">https://vidlink.pro/movie/&#123;tmdb_id&#125;</code>
                <code className="block text-violet-400/80 break-all">https://vidlink.pro/tv/&#123;tmdb_id&#125;/&#123;season&#125;/&#123;episode&#125;</code>
              </div>
            </div>
            <div className="rounded-lg bg-black/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-violet-400">AutoEmbed</h4>
                <span className="rounded-full bg-yellow-500/10 text-yellow-400 px-2 py-0.5 text-[10px] font-medium">Backup 3</span>
              </div>
              <p className="text-xs text-zinc-400">Aggregates Vidcloud, Vidstream sources into one player.</p>
              <div className="space-y-1 text-xs">
                <code className="block text-violet-400/80 break-all">https://autoembed.co/movie/tmdb/&#123;tmdb_id&#125;</code>
                <code className="block text-violet-400/80 break-all">https://autoembed.co/tv/tmdb/&#123;tmdb_id&#125;-&#123;season&#125;-&#123;episode&#125;</code>
              </div>
            </div>
          </div>
        </div>

        {/* Provider status table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="py-3 pr-4 font-medium text-zinc-400">Provider</th>
                <th className="py-3 pr-4 font-medium text-zinc-400">Content</th>
                <th className="py-3 pr-4 font-medium text-zinc-400">Quality</th>
                <th className="py-3 pr-4 font-medium text-zinc-400">Status</th>
                <th className="py-3 font-medium text-zinc-400">Domain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ALL_PROVIDERS.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 pr-4 font-medium text-violet-400">{p.name}</td>
                  <td className="py-3 pr-4 text-zinc-400">
                    {p.types.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}
                  </td>
                  <td className="py-3 pr-4 text-zinc-500 text-xs">720p–1080p</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      p.enabled
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-zinc-500/10 text-zinc-500"
                    }`}>
                      {p.enabled ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="py-3 text-zinc-600 text-xs font-mono">{new URL(p.url).hostname}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Adding providers */}
      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-bold text-violet-400">Adding New Providers</h2>
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-6 space-y-3 text-sm text-zinc-400">
          <p>
            Edit{" "}
            <code className="text-violet-400">lib/providers.ts</code> and add
            to the <code className="text-violet-400">ALL_PROVIDERS</code> array:
          </p>
          <pre className="mt-3 rounded-lg bg-black/40 p-4 text-xs text-zinc-300 overflow-x-auto">
{`{
  id: "my-provider",
  name: "My Provider",
  url: "https://example.com",
  types: ["movie", "tv"],       // or ["anime"]
  free: true,
  requiresKey: false,
  notes: "What this provider does",
  enabled: true,
  // For movies/TV:
  buildMovieUrl: (tmdbId) =>
    \`https://example.com/embed/\${tmdbId}\`,
  buildTvUrl: (tmdbId, s, e) =>
    \`https://example.com/embed/\${tmdbId}/\${s}/\${e}\`,
  // For anime:
  buildAnimeEmbedUrl: (embedId, lang) =>
    \`https://example.com/anime/\${embedId}/\${lang}\`,
  buildAnimeMalUrl: (malId, ep, lang) =>
    \`https://example.com/mal/\${malId}/\${ep}/\${lang}\`,
}`}
          </pre>
        </div>
      </section>

      {/* Features */}
      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-bold text-violet-400">Features</h2>
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-6 text-sm text-zinc-400">
          <ul className="space-y-3 ml-5 list-disc">
            <li><strong className="text-zinc-300">Auto Server Fallback</strong> — If a stream doesn&apos;t load in 12s, a &quot;Try Next Server&quot; button appears. Cycles through all enabled providers.</li>
            <li><strong className="text-zinc-300">Server Memory</strong> — Your last-used server for each content type (anime/movie/TV) is saved and auto-selected next time.</li>
            <li><strong className="text-zinc-300">Infinite Scroll</strong> — Anime browse page loads more content as you scroll. No pagination buttons needed.</li>
            <li><strong className="text-zinc-300">Related Seasons</strong> — Watch page shows prequels, sequels, and spin-offs via Jikan relations API.</li>
            <li><strong className="text-zinc-300">Episode Seasons</strong> — Long anime (500+ episodes) are grouped into 25-episode seasons with tabs.</li>
            <li><strong className="text-zinc-300">Quality Selection</strong> — Each embed provider has its own quality settings (gear icon in player). Typically 360p to 1080p, some support 4K.</li>
          </ul>
        </div>
      </section>

      {/* Caching */}
      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-bold text-violet-400">Caching</h2>
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-6 text-sm text-zinc-400">
          <ul className="space-y-2 ml-5 list-disc">
            <li><strong className="text-zinc-300">Anikoto</strong> — 5 minutes (Next.js ISR)</li>
            <li><strong className="text-zinc-300">Jikan Search</strong> — 1 minute</li>
            <li><strong className="text-zinc-300">Jikan Top/Details/Relations</strong> — 1 hour</li>
            <li><strong className="text-zinc-300">Movies/TV catalog</strong> — Static curated data, zero API calls</li>
            <li><strong className="text-zinc-300">Client state</strong> — Watchlist, continue watching, server preference all in localStorage</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
