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

export default function MoviePage() {
  const params = useParams<{ id: string }>();
  const [providers, setProviders] = useState<StreamProvider[]>([]);
  const [providerIdx, setProviderIdx] = useState(0);

  const movie = TOP_MOVIES.find((m) => String(m.tmdbId) === params.id);

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
    if (!movie && providers.length === 0) return;
    updateContinueWatching({
      id: `movie-${params.id}`,
      type: "movie",
      title: movie?.title || `Movie #${params.id}`,
      poster: movie?.poster || "",
      watchUrl: `/movie/${params.id}`,
      lastWatchedAt: Date.now(),
    });
  }, [params.id, movie, providers]);

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
  const genres = movie?.genre.split(", ") || [];

  const tmdbIdNum = Number(params.id);
  const collection = MOVIE_COLLECTIONS.find((c) => c.tmdbIds.includes(tmdbIdNum));

  const currentGenres = movie?.genre.split(", ") || [];
  const similarMovies = currentGenres.length > 0
    ? TOP_MOVIES.filter(
        (m) =>
          m.tmdbId !== tmdbIdNum &&
          m.genre.split(", ").some((g) => currentGenres.includes(g))
      )
        .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    : [];

  return (
    <div>
      <div className="relative h-48 md:h-64 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-fuchsia-950/50 to-zinc-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16">
        <div className="flex flex-col md:flex-row gap-6 -mt-32 relative z-10">
          <div className="shrink-0">
            <div className="relative w-40 md:w-48 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <PosterImage
                src={movie?.poster || ""}
                alt={movie?.title || "Movie"}
                fill
                className="object-cover"
                sizes="192px"
                priority
              />
            </div>
          </div>

          <div className="flex-1 space-y-3 pt-2">
            <h1 className="text-2xl md:text-4xl font-black tracking-tight">
              {movie?.title || `Movie #${params.id}`}
            </h1>
            <div className="flex flex-wrap gap-2">
              {movie?.rating && (
                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">★ {movie.rating}</Badge>
              )}
              {movie?.year && (
                <Badge variant="outline" className="border-white/10">{movie.year}</Badge>
              )}
              <Badge variant="outline" className="border-white/10">Movie</Badge>
            </div>
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {genres.map((g) => (
                  <Badge key={g} variant="secondary" className="bg-white/5 text-zinc-300 text-xs">{g}</Badge>
                ))}
              </div>
            )}
            {movie && (
              <WatchlistButton
                item={{ id: `movie-${movie.tmdbId}`, type: "movie", title: movie.title, poster: movie.poster, addedAt: Date.now() }}
              />
            )}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {providers.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Server:</span>
              {providers.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => selectServer(i)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    providerIdx === i
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                      : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
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
            <div className="aspect-video rounded-xl bg-zinc-900 flex items-center justify-center">
              <p className="text-zinc-500">No streaming provider available. Enable one in Settings.</p>
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
