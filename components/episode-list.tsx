"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnikotoEpisode } from "@/lib/types";

interface EpisodeListProps {
  episodes: AnikotoEpisode[];
  animeId: number;
  currentEpisode?: string;
}

export function EpisodeList({
  episodes,
  animeId,
  currentEpisode,
}: EpisodeListProps) {
  const [lang, setLang] = useState<"sub" | "dub">("sub");

  if (episodes.length === 0) {
    return (
      <p className="text-sm text-zinc-500 py-8 text-center">
        No episodes available yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">
          Episodes
          <span className="ml-2 text-sm font-normal text-zinc-500">
            ({episodes.length})
          </span>
        </h2>
        <div className="flex gap-1 rounded-lg bg-white/5 p-1">
          <button
            onClick={() => setLang("sub")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
              lang === "sub"
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            SUB
          </button>
          <button
            onClick={() => setLang("dub")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
              lang === "dub"
                ? "bg-purple-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            DUB
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 gap-1.5">
        {episodes.map((ep) => {
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
                    : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
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
