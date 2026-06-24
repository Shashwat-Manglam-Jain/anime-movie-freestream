"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getContinueWatching,
  removeContinueWatching,
  type ContinueWatchingItem,
} from "@/lib/watchlist";

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  anime: { label: "Anime", color: "bg-blue-500/80" },
  movie: { label: "Movie", color: "bg-fuchsia-500/80" },
  tv: { label: "TV", color: "bg-pink-500/80" },
  manga: { label: "Manga", color: "bg-emerald-500/80" },
  novel: { label: "Novel", color: "bg-amber-500/80" },
  comic: { label: "Comic", color: "bg-cyan-500/80" },
};

export function ContinueWatching() {
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);

  useEffect(() => {
    setItems(getContinueWatching());
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight">Continue Watching</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {items.slice(0, 12).map((item) => {
          const typeInfo = TYPE_LABELS[item.type] || TYPE_LABELS.anime;
          return (
            <div key={item.id} className="group relative">
              <Link href={item.watchUrl} className="block">
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted ring-1 ring-black/5 dark:ring-white/5">
                  {item.poster ? (
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-950 to-fuchsia-950">
                      <svg className="h-10 w-10 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <span className={`absolute top-1.5 left-1.5 rounded px-1.5 py-0.5 text-[9px] font-bold text-white ${typeInfo.color}`}>
                    {typeInfo.label}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-xs font-semibold text-white line-clamp-2">
                      {item.title}
                    </p>
                    {item.episodeInfo && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {item.episodeInfo}
                      </p>
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/90 text-white">
                      <svg className="h-4 w-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => {
                  removeContinueWatching(item.id);
                  setItems((prev) => prev.filter((i) => i.id !== item.id));
                }}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-muted-foreground hover:text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
