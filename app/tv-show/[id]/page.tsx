"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { PosterImage } from "@/components/poster-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/video-player";
import { WatchlistButton } from "@/components/watchlist-button";
import {
  type StreamProvider,
  getEnabledProviders,
} from "@/lib/providers";
import {
  getProviderPrefs,
  updateContinueWatching,
  getPreferredServer,
  setPreferredServer,
} from "@/lib/watchlist";
import { TOP_TV_SHOWS } from "@/lib/curated";
import { SimilarMovies } from "@/components/similar-movies";

interface SeasonDetail {
  seasonNumber: number;
  episodeCount: number;
  name: string;
}

interface TmdbDetail {
  id: number;
  title: string;
  overview: string | null;
  poster: string | null;
  backdrop: string | null;
  rating: string | null;
  year: number | null;
  genres: string[];
  runtime: number | null;
  status: string | null;
  seasons: number | null;
  episodes: number | null;
  seasonDetails: SeasonDetail[] | null;
  similar: { id: number; title: string; poster: string; rating: string; year: number }[];
}

export default function TvShowPage() {
  const params = useParams<{ id: string }>();
  const [providers, setProviders] = useState<StreamProvider[]>([]);
  const [providerIdx, setProviderIdx] = useState(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [tmdbData, setTmdbData] = useState<TmdbDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const curated = TOP_TV_SHOWS.find((s) => String(s.tmdbId) === params.id);

  useEffect(() => {
    const prefs = getProviderPrefs();
    const p = getEnabledProviders("tv", prefs);
    setProviders(p);

    const preferred = getPreferredServer("tv");
    if (preferred) {
      const idx = p.findIndex((prov) => prov.id === preferred);
      if (idx >= 0) setProviderIdx(idx);
    }
  }, []);

  useEffect(() => {
    fetch(`/api/tmdb?action=detail&type=tv&id=${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.id) setTmdbData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  const selectServer = useCallback(
    (idx: number) => {
      setProviderIdx(idx);
      if (providers[idx]) {
        setPreferredServer("tv", providers[idx].id);
      }
    },
    [providers]
  );

  const handleTryNext = useCallback(() => {
    selectServer((providerIdx + 1) % providers.length);
  }, [providerIdx, providers.length, selectServer]);

  const title = tmdbData?.title || curated?.title || `TV Show #${params.id}`;
  const poster = tmdbData?.poster || curated?.poster || "";
  const backdrop = tmdbData?.backdrop || null;
  const rating = tmdbData?.rating || curated?.rating || null;
  const year = tmdbData?.year || curated?.year || null;
  const overview = tmdbData?.overview || null;
  const genres = tmdbData?.genres || curated?.genre?.split(", ") || [];
  const totalSeasons = tmdbData?.seasons || curated?.seasons || 1;
  const seasonDetails = tmdbData?.seasonDetails || null;
  const status = tmdbData?.status || null;

  const episodesInSeason = seasonDetails
    ? (seasonDetails.find((s) => s.seasonNumber === season)?.episodeCount || 10)
    : 10;

  function handlePlay(ep: number) {
    setEpisode(ep);
    updateContinueWatching({
      id: `tv-${params.id}`,
      type: "tv",
      title,
      poster,
      watchUrl: `/tv-show/${params.id}`,
      episodeInfo: `S${season} E${ep}`,
      lastWatchedAt: Date.now(),
    });
  }

  const selectedProvider = providers[providerIdx] || null;
  const streamUrl = selectedProvider?.buildTvUrl?.(params.id, season, episode);

  const tmdbSimilar = (tmdbData?.similar || []).map((s) => ({
    title: s.title,
    year: s.year,
    tmdbId: s.id,
    poster: s.poster,
    rating: s.rating,
    seasons: 1,
  }));

  const curatedGenres = curated?.genre?.split(", ") || [];
  const curatedSimilar = curatedGenres.length > 0
    ? TOP_TV_SHOWS.filter(
        (s) => s.tmdbId !== Number(params.id) && s.genre.split(", ").some((g) => curatedGenres.includes(g))
      ).sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    : [];

  const similarShows = tmdbSimilar.length > 0 ? tmdbSimilar : curatedSimilar;

  return (
    <div>
      <div className="relative h-48 md:h-72 w-full overflow-hidden">
        {backdrop ? (
          <img src={backdrop} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-fuchsia-950/50 to-zinc-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16">
        <div className="flex flex-col md:flex-row gap-6 -mt-32 relative z-10">
          <div className="shrink-0">
            <div className="relative w-40 md:w-48 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
              {poster ? (
                <PosterImage src={poster} alt={title} fill className="object-cover" sizes="192px" priority />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground text-xs">
                  No Poster
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-3 pt-2">
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-8 w-2/3 rounded bg-black/5 dark:bg-white/5" />
                <div className="h-4 w-1/3 rounded bg-black/5 dark:bg-white/5" />
                <div className="h-20 rounded bg-black/5 dark:bg-white/5" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl md:text-4xl font-black tracking-tight">{title}</h1>
                <div className="flex flex-wrap gap-2">
                  {rating && (
                    <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">★ {rating}</Badge>
                  )}
                  {year && (
                    <Badge variant="outline" className="border-border">{year}</Badge>
                  )}
                  <Badge variant="outline" className="border-border">
                    {totalSeasons} Season{totalSeasons !== 1 ? "s" : ""}
                  </Badge>
                  {status && (
                    <Badge variant="outline" className="border-border">{status}</Badge>
                  )}
                </div>
                {genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {genres.map((g) => (
                      <Badge key={g} variant="secondary" className="bg-black/5 dark:bg-white/5 text-foreground/70 text-xs">{g}</Badge>
                    ))}
                  </div>
                )}
                {overview && (
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">{overview}</p>
                )}
                <WatchlistButton
                  item={{ id: `tv-${params.id}`, type: "tv", title, poster, addedAt: Date.now() }}
                />
              </>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {providers.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Server:</span>
              {providers.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => selectServer(i)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    providerIdx === i
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                      : "bg-black/5 dark:bg-white/5 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}

          {streamUrl ? (
            <VideoPlayer src={streamUrl} onTryNext={handleTryNext} hasNextServer={providers.length > 1} />
          ) : (
            <div className="aspect-video rounded-xl bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">No provider available. Enable one in Settings.</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            {episode > 1 && (
              <Button variant="outline" size="sm" className="border-border" onClick={() => handlePlay(episode - 1)}>
                Prev
              </Button>
            )}
            <span className="text-sm text-muted-foreground font-medium">S{season} E{episode}</span>
            {episode < episodesInSeason && (
              <Button variant="outline" size="sm" className="border-border" onClick={() => handlePlay(episode + 1)}>
                Next
              </Button>
            )}
          </div>
        </div>

        <div className="mt-10 space-y-5">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold">Episodes</h2>
            <div className="flex gap-1 rounded-lg bg-black/5 dark:bg-white/5 p-1">
              {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
                <button
                  key={s}
                  onClick={() => { setSeason(s); handlePlay(1); }}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    season === s ? "bg-violet-600 text-white" : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  S{s}
                  {seasonDetails && (
                    <span className="hidden sm:inline text-[10px] ml-1 opacity-60">
                      ({seasonDetails.find((sd) => sd.seasonNumber === s)?.episodeCount || "?"})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
            {Array.from({ length: episodesInSeason }, (_, i) => i + 1).map((ep) => (
              <Button
                key={ep}
                variant={episode === ep ? "default" : "outline"}
                size="sm"
                className={`text-xs ${
                  episode === ep ? "bg-violet-600 text-white" : "border-border hover:bg-black/10 dark:hover:bg-white/10"
                }`}
                onClick={() => handlePlay(ep)}
              >
                {ep}
              </Button>
            ))}
          </div>
        </div>

        {similarShows.length > 0 && (
          <SimilarMovies movies={similarShows} currentTmdbId={Number(params.id)} title="Similar Shows" hrefPrefix="/tv-show" />
        )}
      </div>
    </div>
  );
}
