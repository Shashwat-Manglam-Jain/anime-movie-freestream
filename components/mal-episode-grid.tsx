"use client";

import { useState } from "react";
import Link from "next/link";

const EPS_PER_SEASON = 25;

interface MalEpisodeGridProps {
  malId: string;
  totalEpisodes: number;
  currentEpisode: number;
  lang: string;
}

export function MalEpisodeGrid({
  malId,
  totalEpisodes,
  currentEpisode,
  lang,
}: MalEpisodeGridProps) {
  const totalSeasons = Math.ceil(totalEpisodes / EPS_PER_SEASON);
  const currentSeason = Math.ceil(currentEpisode / EPS_PER_SEASON);
  const [season, setSeason] = useState(currentSeason);
  const [jumpEp, setJumpEp] = useState("");

  const seasonStart = (season - 1) * EPS_PER_SEASON + 1;
  const seasonEnd = Math.min(season * EPS_PER_SEASON, totalEpisodes);

  const episodes = Array.from(
    { length: seasonEnd - seasonStart + 1 },
    (_, i) => seasonStart + i
  );

  return (
    <div className="space-y-4 pt-4 border-t border-white/5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-bold">Episodes</h3>
        <span className="text-xs text-zinc-600">
          {totalEpisodes} episodes · {totalSeasons} season{totalSeasons !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Season tabs */}
      {totalSeasons > 1 && (
        <div className="space-y-2">
          <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
            Season
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => {
              const sStart = (s - 1) * EPS_PER_SEASON + 1;
              const sEnd = Math.min(s * EPS_PER_SEASON, totalEpisodes);
              return (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    season === s
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                      : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                  }`}
                  title={`Episodes ${sStart}–${sEnd}`}
                >
                  S{s}
                  <span className="hidden sm:inline text-[10px] ml-1 opacity-60">
                    ({sStart}-{sEnd})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Episode grid */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
        {episodes.map((ep) => {
          const isActive = ep === currentEpisode;
          return (
            <Link
              key={ep}
              href={`/watch/mal/${malId}/${ep}/${lang}`}
              className={`flex items-center justify-center rounded-lg h-10 text-sm font-medium transition-all ${
                isActive
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20 ring-2 ring-violet-400/50"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {ep}
            </Link>
          );
        })}
      </div>

      {/* Jump to episode */}
      {totalEpisodes > EPS_PER_SEASON && (
        <div className="flex items-center gap-2 pt-2">
          <span className="text-xs text-zinc-500">Go to episode:</span>
          <input
            type="number"
            min={1}
            max={totalEpisodes}
            value={jumpEp}
            onChange={(e) => setJumpEp(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const ep = Number(jumpEp);
                if (ep >= 1 && ep <= totalEpisodes) {
                  window.location.href = `/watch/mal/${malId}/${ep}/${lang}`;
                }
              }
            }}
            placeholder={`1–${totalEpisodes}`}
            className="w-24 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50"
          />
          <Link
            href={
              Number(jumpEp) >= 1 && Number(jumpEp) <= totalEpisodes
                ? `/watch/mal/${malId}/${jumpEp}/${lang}`
                : "#"
            }
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              Number(jumpEp) >= 1 && Number(jumpEp) <= totalEpisodes
                ? "bg-violet-600 text-white hover:bg-violet-500"
                : "bg-white/5 text-zinc-600 cursor-not-allowed"
            }`}
            onClick={(e) => {
              const ep = Number(jumpEp);
              if (ep < 1 || ep > totalEpisodes) e.preventDefault();
            }}
          >
            Go
          </Link>
        </div>
      )}
    </div>
  );
}
