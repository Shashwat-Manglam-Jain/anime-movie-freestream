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
}

export const ALL_PROVIDERS: StreamProvider[] = [
  // ── Anime Providers ──
  {
    id: "megaplay",
    name: "MegaPlay",
    url: "https://megaplay.buzz",
    types: ["anime"],
    free: true,
    requiresKey: false,
    notes: "Primary anime server — sub/dub, large library. Uses HiAnime/Anikoto sources.",
    enabled: true,
    buildAnimeEmbedUrl: (embedId, lang) =>
      `https://megaplay.buzz/stream/s-2/${embedId}/${lang}`,
    buildAnimeMalUrl: (malId, episode, lang) =>
      `https://megaplay.buzz/stream/mal/${malId}/${episode}/${lang}`,
  },
  {
    id: "animeplay",
    name: "AnimPlay",
    url: "https://animeplay.cfd",
    types: ["anime"],
    free: true,
    requiresKey: false,
    notes: "Mirror of MegaPlay on a different domain — works when MegaPlay is down.",
    enabled: true,
    buildAnimeEmbedUrl: (embedId, lang) =>
      `https://animeplay.cfd/stream/s-2/${embedId}/${lang}`,
    buildAnimeMalUrl: (malId, episode, lang) =>
      `https://animeplay.cfd/stream/mal/${malId}/${episode}/${lang}`,
  },
  {
    id: "videasy",
    name: "Videasy",
    url: "https://player.videasy.to",
    types: ["movie", "tv"],
    free: true,
    requiresKey: false,
    notes: "Clean player with auto quality and language detection. Supports movies and TV.",
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
    notes: "Multi-source player with built-in quality selector and subtitles. Supports movies and TV.",
    enabled: true,
    buildMovieUrl: (tmdbId) =>
      `https://vidsrc.pm/embed/movie/${tmdbId}`,
    buildTvUrl: (tmdbId, season, episode) =>
      `https://vidsrc.pm/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  // ── Movie & TV Only ──
  {
    id: "vidlink",
    name: "VidLink Pro",
    url: "https://vidlink.pro",
    types: ["movie", "tv"],
    free: true,
    requiresKey: false,
    notes: "Fast HD embeds with minimal ads. Supports movies and TV up to 4K.",
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
    notes: "Aggregates multiple video sources (Vidcloud, Vidstream) into one player.",
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
