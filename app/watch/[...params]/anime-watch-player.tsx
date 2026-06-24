"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  anilistId?: string | null;
}

function buildUrl(
  provider: StreamProvider,
  embedId: string | null,
  malId: string | null,
  malEp: string | null,
  lang: "sub" | "dub",
  anilistId: string | null
): string | null {
  if (embedId && provider.buildAnimeEmbedUrl) {
    return provider.buildAnimeEmbedUrl(embedId, lang);
  }
  if (malId && malEp && provider.buildAnimeMalUrl) {
    return provider.buildAnimeMalUrl(malId, Number(malEp), lang);
  }
  if (anilistId && malEp && provider.buildAnimeAnilistUrl) {
    return provider.buildAnimeAnilistUrl(anilistId, Number(malEp), lang);
  }
  return null;
}

export function AnimeWatchPlayer({
  embedId,
  malId,
  malEp,
  lang,
  anilistId,
}: AnimeWatchPlayerProps) {
  const [providers, setProviders] = useState<StreamProvider[]>([]);
  const [serverId, setServerId] = useState<string>("");
  const triedServersRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const prefs = getProviderPrefs();
    const all = getEnabledProviders("anime", prefs);
    const valid = all.filter(
      (p) => buildUrl(p, embedId, malId, malEp, lang, anilistId ?? null) !== null
    );
    setProviders(valid);

    const saved = getPreferredServer("anime");
    if (saved && valid.some((p) => p.id === saved)) {
      setServerId(saved);
    } else if (valid.length > 0) {
      setServerId(valid[0].id);
    }

    triedServersRef.current = new Set();
  }, [embedId, malId, malEp, lang, anilistId]);

  const allServerIds = providers.map((p) => p.id);

  const getNextServerId = useCallback(
    (currentId: string): string | null => {
      if (allServerIds.length <= 1) return null;
      const idx = allServerIds.indexOf(currentId);
      for (let i = 1; i < allServerIds.length; i++) {
        const candidate = allServerIds[(idx + i) % allServerIds.length];
        if (!triedServersRef.current.has(candidate)) {
          return candidate;
        }
      }
      triedServersRef.current.clear();
      const nextIdx = (idx + 1) % allServerIds.length;
      return allServerIds[nextIdx];
    },
    [allServerIds]
  );

  const selectServer = useCallback(
    (id: string) => {
      setServerId(id);
      setPreferredServer("anime", id);
      triedServersRef.current.clear();
    },
    []
  );

  const tryNextServer = useCallback(() => {
    triedServersRef.current.add(serverId);
    const next = getNextServerId(serverId);
    if (next) {
      setServerId(next);
      setPreferredServer("anime", next);
    }
  }, [serverId, getNextServerId]);

  const selected = providers.find((p) => p.id === serverId) || null;
  const streamUrl = selected
    ? buildUrl(selected, embedId, malId, malEp, lang, anilistId ?? null)
    : null;

  if (!streamUrl) {
    return (
      <div className="space-y-3">
        <div className="aspect-video rounded-xl bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">No stream available for this episode</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <VideoPlayer
          key={serverId}
          src={streamUrl}
          onTryNext={tryNextServer}
          hasNextServer={allServerIds.length > 1}
        />
      </div>

      {providers.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Server:
          </span>
          {providers.map((p) => (
            <button
              key={p.id}
              onClick={() => selectServer(p.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                serverId === p.id
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "bg-black/5 dark:bg-white/5 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground"
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
