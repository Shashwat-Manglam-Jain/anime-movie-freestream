"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { PosterImage } from "@/components/poster-image";
import { Badge } from "@/components/ui/badge";
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
import { TOP_MOVIES, MOVIE_COLLECTIONS } from "@/lib/curated";
import { MovieCollection } from "@/components/movie-collection";
import { SimilarMovies } from "@/components/similar-movies";

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
  similar: { id: number; title: string; poster: string; rating: string; year: number }[];
}

export default function MoviePage() {
  const params = useParams<{ id: string }>();
  const [providers, setProviders] = useState<StreamProvider[]>([]);
  const [providerIdx, setProviderIdx] = useState(0);
  const [tmdbData, setTmdbData] = useState<TmdbDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const curated = TOP_MOVIES.find((m) => String(m.tmdbId) === params.id);

  useEffect(() => {
    const prefs = getProviderPrefs();
    const p = getEnabledProviders("movie", prefs);
    setProviders(p);

    const preferred = getPreferredServer("movie");
    if (preferred) {
      const idx = p.findIndex((prov) => prov.id === preferred);
      if (idx >= 0) setProviderIdx(idx);
    }
  }, []);

  useEffect(() => {
    fetch(`/api/tmdb?action=detail&type=movie&id=${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.id) setTmdbData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    const title = tmdbData?.title || curated?.title || `Movie #${params.id}`;
    const poster = tmdbData?.poster || curated?.poster || "";
    updateContinueWatching({
      id: `movie-${params.id}`,
      type: "movie",
      title,
      poster,
      watchUrl: `/movie/${params.id}`,
      lastWatchedAt: Date.now(),
    });
  }, [params.id, tmdbData, curated]);

  const selectServer = useCallback(
    (idx: number) => {
      setProviderIdx(idx);
      if (providers[idx]) {
        setPreferredServer("movie", providers[idx].id);
      }
    },
    [providers]
  );

  const handleTryNext = useCallback(() => {
    selectServer((providerIdx + 1) % providers.length);
  }, [providerIdx, providers.length, selectServer]);

  const selectedProvider = providers[providerIdx] || null;
  const streamUrl = selectedProvider?.buildMovieUrl?.(params.id) || null;

  const title = tmdbData?.title || curated?.title || `Movie #${params.id}`;
  const poster = tmdbData?.poster || curated?.poster || "";
  const backdrop = tmdbData?.backdrop || null;
  const rating = tmdbData?.rating || curated?.rating || null;
  const year = tmdbData?.year || curated?.year || null;
  const overview = tmdbData?.overview || null;
  const genres = tmdbData?.genres || curated?.genre?.split(", ") || [];
  const runtime = tmdbData?.runtime || null;

  const tmdbIdNum = Number(params.id);
  const collection = MOVIE_COLLECTIONS.find((c) => c.tmdbIds.includes(tmdbIdNum));

  const tmdbSimilar = (tmdbData?.similar || []).map((s) => ({
    title: s.title,
    year: s.year,
    tmdbId: s.id,
    poster: s.poster,
    rating: s.rating,
  }));

  const curatedGenres = curated?.genre?.split(", ") || [];
  const curatedSimilar = curatedGenres.length > 0
    ? TOP_MOVIES.filter(
        (m) => m.tmdbId !== tmdbIdNum && m.genre.split(", ").some((g) => curatedGenres.includes(g))
      ).sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    : [];

  const similarMovies = tmdbSimilar.length > 0 ? tmdbSimilar : curatedSimilar;

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
                  <Badge variant="outline" className="border-border">Movie</Badge>
                  {runtime && (
                    <Badge variant="outline" className="border-border">{runtime} min</Badge>
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
                  item={{ id: `movie-${params.id}`, type: "movie", title, poster, addedAt: Date.now() }}
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
              <p className="text-muted-foreground">No streaming provider available. Enable one in Settings.</p>
            </div>
          )}
        </div>

        {collection && (
          <MovieCollection collection={collection} currentTmdbId={tmdbIdNum} />
        )}

        {similarMovies.length > 0 && (
          <SimilarMovies movies={similarMovies} currentTmdbId={tmdbIdNum} title="Similar Movies" />
        )}
      </div>
    </div>
  );
}
