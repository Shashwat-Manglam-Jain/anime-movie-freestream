export interface StreamProvider {
  id: string;
  name: string;
  url: string;
  types: ("movie" | "tv" | "anime")[];
  free: boolean;
  requiresKey: false;
  notes: string;
  enabled: boolean;
  buildMovieUrl?: (id: string) => string;
  buildTvUrl?: (id: string, season: number, episode: number) => string;
  buildAnimeEmbedUrl?: (embedId: string, lang: "sub" | "dub") => string;
  buildAnimeMalUrl?: (
    malId: string,
    episode: number,
    lang: "sub" | "dub"
  ) => string;
  buildAnimeAnilistUrl?: (
    anilistId: string,
    episode: number,
    lang: "sub" | "dub"
  ) => string;
}

export const ALL_PROVIDERS: StreamProvider[] = [
  // ── Anime Embed Providers (fallback order: 1→2→3→4) ──
  {
    id: "megaplay",
    name: "MegaPlay",
    url: "https://megaplay.buzz",
    types: ["anime"],
    free: true,
    requiresKey: false,
    notes: "Primary anime server — sub/dub, large library.",
    enabled: true,
    buildAnimeEmbedUrl: (embedId, lang) =>
      `https://megaplay.buzz/stream/s-2/${embedId}/${lang}`,
    buildAnimeMalUrl: (malId, episode, lang) =>
      `https://megaplay.buzz/stream/mal/${malId}/${episode}/${lang}`,
    buildAnimeAnilistUrl: (anilistId, episode, lang) =>
      `https://megaplay.buzz/stream/ani/${anilistId}/${episode}/${lang}`,
  },
  {
    id: "animplay",
    name: "AnimPlay",
    url: "https://animeplay.cfd",
    types: ["anime"],
    free: true,
    requiresKey: false,
    notes: "MegaPlay mirror domain — same sources, alternate CDN.",
    enabled: true,
    buildAnimeEmbedUrl: (embedId, lang) =>
      `https://animeplay.cfd/stream/s-2/${embedId}/${lang}`,
    buildAnimeMalUrl: (malId, episode, lang) =>
      `https://animeplay.cfd/stream/mal/${malId}/${episode}/${lang}`,
    buildAnimeAnilistUrl: (anilistId, episode, lang) =>
      `https://animeplay.cfd/stream/ani/${anilistId}/${episode}/${lang}`,
  },
  {
    id: "megaplay2",
    name: "MegaPlay S1",
    url: "https://megaplay.buzz",
    types: ["anime"],
    free: true,
    requiresKey: false,
    notes: "MegaPlay alternate embed format (s-1).",
    enabled: true,
    buildAnimeEmbedUrl: (embedId, lang) =>
      `https://megaplay.buzz/stream/s-1/${embedId}/${lang}`,
    buildAnimeMalUrl: (malId, episode, lang) =>
      `https://megaplay.buzz/stream/mal/${malId}/${episode}/${lang}`,
    buildAnimeAnilistUrl: (anilistId, episode, lang) =>
      `https://megaplay.buzz/stream/ani/${anilistId}/${episode}/${lang}`,
  },
  {
    id: "videasy-anime",
    name: "Videasy",
    url: "https://player.videasy.to",
    types: ["anime"],
    free: true,
    requiresKey: false,
    notes: "Videasy anime player — supports MAL ID lookup.",
    enabled: true,
    buildAnimeMalUrl: (malId, episode, lang) =>
      `https://player.videasy.to/anime/mal/${malId}/${episode}/${lang}`,
  },
  // ── Movie & TV Providers ──
  {
    id: "videasy",
    name: "Videasy",
    url: "https://player.videasy.to",
    types: ["movie", "tv"],
    free: true,
    requiresKey: false,
    notes: "Clean player with auto quality and language detection.",
    enabled: true,
    buildMovieUrl: (tmdbId) =>
      `https://player.videasy.to/movie/${tmdbId}`,
    buildTvUrl: (tmdbId, season, episode) =>
      `https://player.videasy.to/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: "vidsrcpm",
    name: "VidSrc",
    url: "https://vidsrc.pm",
    types: ["movie", "tv"],
    free: true,
    requiresKey: false,
    notes: "Multi-source player with built-in quality selector and subtitles.",
    enabled: true,
    buildMovieUrl: (tmdbId) =>
      `https://vidsrc.pm/embed/movie/${tmdbId}`,
    buildTvUrl: (tmdbId, season, episode) =>
      `https://vidsrc.pm/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: "vidlink",
    name: "VidLink Pro",
    url: "https://vidlink.pro",
    types: ["movie", "tv"],
    free: true,
    requiresKey: false,
    notes: "Fast HD embeds with minimal ads.",
    enabled: true,
    buildMovieUrl: (tmdbId) =>
      `https://vidlink.pro/movie/${tmdbId}`,
    buildTvUrl: (tmdbId, season, episode) =>
      `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: "autoembed",
    name: "AutoEmbed",
    url: "https://autoembed.co",
    types: ["movie", "tv"],
    free: true,
    requiresKey: false,
    notes: "Aggregates multiple video sources into one player.",
    enabled: true,
    buildMovieUrl: (tmdbId) =>
      `https://autoembed.co/movie/tmdb/${tmdbId}`,
    buildTvUrl: (tmdbId, season, episode) =>
      `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`,
  },
];

export function getEnabledProviders(
  type: "movie" | "tv" | "anime",
  savedPrefs?: Record<string, boolean>
): StreamProvider[] {
  return ALL_PROVIDERS.filter((p) => {
    const isEnabled = savedPrefs ? (savedPrefs[p.id] ?? p.enabled) : p.enabled;
    return isEnabled && p.types.includes(type);
  });
}

export function getProviderById(id: string): StreamProvider | undefined {
  return ALL_PROVIDERS.find((p) => p.id === id);
}
