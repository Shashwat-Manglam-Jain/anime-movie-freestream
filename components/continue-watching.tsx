"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getContinueWatching,
  removeContinueWatching,
  type ContinueWatchingItem,
} from "@/lib/watchlist";

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
        {items.slice(0, 12).map((item) => (
          <div key={item.id} className="group relative">
            <Link href={item.watchUrl} className="block">
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/5">
                {item.poster ? (
                  <Image
                    src={item.poster}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-800/50">
                    <svg className="h-10 w-10 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs font-semibold text-white line-clamp-2">
                    {item.title}
                  </p>
                  {item.episodeInfo && (
                    <p className="text-[10px] text-zinc-400 mt-0.5">
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
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-zinc-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
