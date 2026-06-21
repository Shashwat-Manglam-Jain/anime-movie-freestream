"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { VideoPlayer } from "@/components/video-player";
import {
  type StreamProvider,
  getEnabledProviders,
} from "@/lib/providers";
import { getProviderPrefs, getPreferredServer, setPreferredServer } from "@/lib/watchlist";

interface AnimeWatchPlayerProps {
  embedId: string | null;
  malId: string | null;
  malEp: string | null;
  lang: "sub" | "dub";
}

function buildUrl(
  provider: StreamProvider,
  embedId: string | null,
  malId: string | null,
  malEp: string | null,
  lang: "sub" | "dub"
): string | null {
  if (embedId && provider.buildAnimeEmbedUrl) {
    return provider.buildAnimeEmbedUrl(embedId, lang);
  }
  if (malId && malEp && provider.buildAnimeMalUrl) {
    return provider.buildAnimeMalUrl(malId, Number(malEp), lang);
  }
  return null;
}

export function AnimeWatchPlayer({
  embedId,
  malId,
  malEp,
  lang,
}: AnimeWatchPlayerProps) {
  const [allProviders, setAllProviders] = useState<StreamProvider[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    const prefs = getProviderPrefs();
    const animeProviders = getEnabledProviders("anime", prefs);
    setAllProviders(animeProviders);

    const preferred = getPreferredServer("anime");
    if (preferred) {
      const idx = animeProviders.findIndex((p) => p.id === preferred);
      if (idx >= 0) setSelectedIdx(idx);
    }
  }, []);

  const providers = useMemo(
    () => allProviders.filter((p) => buildUrl(p, embedId, malId, malEp, lang) !== null),
    [allProviders, embedId, malId, malEp, lang]
  );

  const clampedIdx = Math.min(selectedIdx, Math.max(0, providers.length - 1));

  const selectServer = useCallback(
    (idx: number) => {
      setSelectedIdx(idx);
      if (providers[idx]) {
        setPreferredServer("anime", providers[idx].id);
      }
    },
    [providers]
  );

  const handleTryNext = useCallback(() => {
    const next = (clampedIdx + 1) % providers.length;
    selectServer(next);
  }, [clampedIdx, providers.length, selectServer]);

  const selected = providers[clampedIdx] || null;
  const streamUrl = selected ? buildUrl(selected, embedId, malId, malEp, lang) : null;

  if (!streamUrl) {
    return (
      <div className="aspect-video rounded-xl bg-zinc-900 flex items-center justify-center">
        <p className="text-zinc-500">No stream available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <VideoPlayer
        src={streamUrl}
        onTryNext={handleTryNext}
        hasNextServer={providers.length > 1}
      />

      {providers.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
            Server:
          </span>
          {providers.map((p, i) => (
            <button
              key={p.id}
              onClick={() => selectServer(i)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                clampedIdx === i
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
