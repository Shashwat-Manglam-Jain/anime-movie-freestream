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

const EPISODES_PER_SEASON = 10;

export default function TvShowPage() {
  const params = useParams<{ id: string }>();
  const [providers, setProviders] = useState<StreamProvider[]>([]);
  const [providerIdx, setProviderIdx] = useState(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  const show = TOP_TV_SHOWS.find((s) => String(s.tmdbId) === params.id);

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

  if (!show) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4">
        <p className="text-zinc-500">TV show not found in catalog.</p>
        <p className="text-sm text-zinc-600">
          Browse the <a href="/tv" className="text-violet-400 underline">TV Shows</a> page to see available titles.
        </p>
      </div>
    );
  }

  function handlePlay(ep: number) {
    setEpisode(ep);
    updateContinueWatching({
      id: `tv-${show!.tmdbId}`,
      type: "tv",
      title: show!.title,
      poster: show!.poster,
      watchUrl: `/tv-show/${show!.tmdbId}`,
      episodeInfo: `S${season} E${ep}`,
      lastWatchedAt: Date.now(),
    });
  }

  const selectedProvider = providers[providerIdx] || null;
  const streamUrl = selectedProvider?.buildTvUrl?.(String(show.tmdbId), season, episode);
  const genres = show.genre.split(", ");

  const currentGenres = show.genre.split(", ");
  const similarShows = TOP_TV_SHOWS
    .filter(
      (s) =>
        s.tmdbId !== show.tmdbId &&
        s.genre.split(", ").some((g) => currentGenres.includes(g))
    )
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));

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
              <PosterImage src={show.poster} alt={show.title} fill className="object-cover" sizes="192px" priority />
            </div>
          </div>

          <div className="flex-1 space-y-3 pt-2">
            <h1 className="text-2xl md:text-4xl font-black tracking-tight">{show.title}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">★ {show.rating}</Badge>
              <Badge variant="outline" className="border-white/10">{show.year}</Badge>
              <Badge variant="outline" className="border-white/10">
                {show.seasons} Season{show.seasons !== 1 ? "s" : ""}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {genres.map((g) => (
                <Badge key={g} variant="secondary" className="bg-white/5 text-zinc-300 text-xs">{g}</Badge>
              ))}
            </div>
            <WatchlistButton
              item={{ id: `tv-${show.tmdbId}`, type: "tv", title: show.title, poster: show.poster, addedAt: Date.now() }}
            />
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
              <p className="text-zinc-500">No provider available. Enable one in Settings.</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            {episode > 1 && (
              <Button variant="outline" size="sm" className="border-white/10" onClick={() => handlePlay(episode - 1)}>
                Prev
              </Button>
            )}
            <span className="text-sm text-zinc-500 font-medium">S{season} E{episode}</span>
            {episode < EPISODES_PER_SEASON && (
              <Button variant="outline" size="sm" className="border-white/10" onClick={() => handlePlay(episode + 1)}>
                Next
              </Button>
            )}
          </div>
        </div>

        <div className="mt-10 space-y-5">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold">Episodes</h2>
            <div className="flex gap-1 rounded-lg bg-white/5 p-1">
              {Array.from({ length: show.seasons }, (_, i) => i + 1).map((s) => (
                <button
                  key={s}
                  onClick={() => { setSeason(s); handlePlay(1); }}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    season === s ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  S{s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
            {Array.from({ length: EPISODES_PER_SEASON }, (_, i) => i + 1).map((ep) => (
              <Button
                key={ep}
                variant={episode === ep ? "default" : "outline"}
                size="sm"
                className={`text-xs ${
                  episode === ep ? "bg-violet-600 text-white" : "border-white/10 hover:bg-white/10"
                }`}
                onClick={() => handlePlay(ep)}
              >
                {ep}
              </Button>
            ))}
          </div>
        </div>

        {similarShows.length > 0 && (
          <SimilarMovies movies={similarShows} currentTmdbId={show.tmdbId} title="Similar Shows" hrefPrefix="/tv-show" />
        )}
      </div>
    </div>
  );
}
