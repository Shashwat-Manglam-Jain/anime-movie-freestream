"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMangaDexPopular, type MangaItem } from "@/lib/manga-api";

export function HomeReadingRows() {
  const [manga, setManga] = useState<MangaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMangaDexPopular(1)
      .then((r) => setManga(r.slice(0, 12)))
      .catch(() => setManga([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Popular Manga</h2>
          <Link href="/manga" className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] rounded-xl bg-black/5 dark:bg-white/5" />
              <div className="mt-2 h-3 w-3/4 rounded bg-black/5 dark:bg-white/5" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (manga.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Popular Manga</h2>
        <Link href="/manga" className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium">
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {manga.map((item) => (
          <Link
            key={item.id}
            href={`/manga/MangaDex/${item.id}`}
            className="group block"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300 group-hover:ring-violet-500/40 group-hover:shadow-lg group-hover:shadow-violet-500/10">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-950 to-fuchsia-950">
                  <span className="text-xs text-zinc-500">No Cover</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <span className="absolute top-2 left-2 rounded bg-emerald-500/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                MANGA
              </span>
              {item.status && (
                <span className="absolute bottom-8 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-zinc-300">
                  {item.status}
                </span>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <h3 className="text-sm font-semibold leading-tight line-clamp-2 text-white drop-shadow-lg">
                  {item.title}
                </h3>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/90 text-white">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
