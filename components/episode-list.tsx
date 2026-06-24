"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { AnikotoEpisode } from "@/lib/types";

interface EpisodeListProps {
  episodes: AnikotoEpisode[];
  animeId: number;
  currentEpisode?: string;
}

const RANGE_SIZE = 50;

export function EpisodeList({
  episodes,
  animeId,
  currentEpisode,
}: EpisodeListProps) {
  const [lang, setLang] = useState<"sub" | "dub">("sub");
  const [activeRange, setActiveRange] = useState(0);

  const ranges = useMemo(() => {
    if (episodes.length <= 100) return null;
    const groups: { label: string; start: number; end: number }[] = [];
    for (let i = 0; i < episodes.length; i += RANGE_SIZE) {
      const start = i;
      const end = Math.min(i + RANGE_SIZE - 1, episodes.length - 1);
      const startNum = episodes[start].number;
      const endNum = episodes[end].number;
      groups.push({
        label: `${startNum} - ${endNum}`,
        start,
        end: end + 1,
      });
    }
    return groups;
  }, [episodes]);

  if (episodes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No episodes available yet.
      </p>
    );
  }

  const displayEpisodes = ranges
    ? episodes.slice(ranges[activeRange].start, ranges[activeRange].end)
    : episodes;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">
          Episodes
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({episodes.length})
          </span>
        </h2>
        <div className="flex gap-1 rounded-lg bg-black/5 dark:bg-white/5 p-1">
          <button
            onClick={() => setLang("sub")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
              lang === "sub"
                ? "bg-blue-600 text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            SUB
          </button>
          <button
            onClick={() => setLang("dub")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
              lang === "dub"
                ? "bg-purple-600 text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            DUB
          </button>
        </div>
      </div>

      {ranges && (
        <div className="flex flex-wrap gap-1.5">
          {ranges.map((range, idx) => (
            <button
              key={idx}
              onClick={() => setActiveRange(idx)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeRange === idx
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "bg-black/5 dark:bg-white/5 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground"
              }`}
            >
              EP {range.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 gap-1.5">
        {displayEpisodes.map((ep) => {
          const isActive = currentEpisode === ep.episode_embed_id;
          return (
            <Link
              key={ep.id}
              href={`/watch/anikoto/${ep.episode_embed_id}/${lang}?anime=${animeId}&ep=${ep.number}`}
            >
              <button
                className={`w-full rounded-lg px-2 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                    : "bg-black/5 dark:bg-white/5 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground"
                }`}
              >
                {ep.number}
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
