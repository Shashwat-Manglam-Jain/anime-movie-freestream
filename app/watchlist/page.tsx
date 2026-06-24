"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  getWatchlist,
  removeFromWatchlist,
  getContinueWatching,
  removeContinueWatching,
  type WatchlistItem,
  type ContinueWatchingItem,
} from "@/lib/watchlist";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [continueItems, setContinueItems] = useState<ContinueWatchingItem[]>([]);
  const [tab, setTab] = useState<"watchlist" | "history">("watchlist");

  useEffect(() => {
    setWatchlist(getWatchlist());
    setContinueItems(getContinueWatching());
  }, []);

  function handleRemoveWatchlist(id: string) {
    removeFromWatchlist(id);
    setWatchlist((prev) => prev.filter((i) => i.id !== id));
  }

  function handleRemoveHistory(id: string) {
    removeContinueWatching(id);
    setContinueItems((prev) => prev.filter((i) => i.id !== id));
  }

  const items = tab === "watchlist" ? watchlist : continueItems;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Library</h1>
        <p className="mt-1 text-muted-foreground">
          Your saved anime, movies, and watch history
        </p>
      </div>

      <div className="flex gap-1 rounded-xl bg-black/5 dark:bg-white/5 p-1 w-fit mb-8">
        <button
          onClick={() => setTab("watchlist")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            tab === "watchlist"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
              : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
          }`}
        >
          Watchlist ({watchlist.length})
        </button>
        <button
          onClick={() => setTab("history")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            tab === "history"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
              : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
          }`}
        >
          Continue Watching ({continueItems.length})
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 mb-4">
            <svg className="h-8 w-8 text-muted-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <p className="text-muted-foreground">
            {tab === "watchlist"
              ? "Your watchlist is empty. Add anime or movies to get started."
              : "No watch history yet. Start watching something!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {items.map((item) => {
            const href =
              tab === "history"
                ? (item as ContinueWatchingItem).watchUrl
                : item.type === "anime"
                  ? `/anime/${item.id.replace("anime-", "")}`
                  : item.type === "movie"
                    ? `/movie/${item.id.replace("movie-", "")}`
                    : `/tv-show/${item.id.replace("tv-", "")}`;

            return (
              <div key={item.id} className="group relative">
                <Link href={href} className="block">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted ring-1 ring-black/5 dark:ring-white/5 transition-all group-hover:ring-violet-500/40">
                    {item.poster ? (
                      <Image
                        src={item.poster}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-zinc-800/50">
                        <svg className="h-10 w-10 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-sm font-semibold text-white line-clamp-2">
                        {item.title}
                      </p>
                      {"episodeInfo" in item && item.episodeInfo && (
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {(item as ContinueWatchingItem).episodeInfo}
                        </p>
                      )}
                      <p className="text-[10px] text-zinc-500 mt-1 uppercase">
                        {item.type}
                      </p>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() =>
                    tab === "watchlist"
                      ? handleRemoveWatchlist(item.id)
                      : handleRemoveHistory(item.id)
                  }
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 backdrop-blur-sm text-zinc-400 hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
