"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ContentCard } from "@/components/content-card";

interface Item {
  title: string;
  year: number;
  tmdbId: number;
  genre: string;
  rating: string;
  poster: string;
  seasons?: number;
}

type SortMode = "top-rated" | "newest" | "oldest" | "a-z";

interface CuratedGridProps {
  items: Item[];
  type: "movie" | "tv";
  perPage?: number;
}

const FILTERS: { key: SortMode; label: string }[] = [
  { key: "top-rated", label: "Top Rated" },
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Classic" },
  { key: "a-z", label: "A–Z" },
];

function sortItems(items: Item[], mode: SortMode): Item[] {
  const copy = [...items];
  switch (mode) {
    case "top-rated":
      return copy.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    case "newest":
      return copy.sort((a, b) => b.year - a.year);
    case "oldest":
      return copy.sort((a, b) => a.year - b.year);
    case "a-z":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
  }
}

export function CuratedGrid({ items, type, perPage = 24 }: CuratedGridProps) {
  const [sort, setSort] = useState<SortMode>("top-rated");
  const [genre, setGenre] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(perPage);
  const loaderRef = useRef<HTMLDivElement>(null);

  const allGenres = Array.from(
    new Set(items.flatMap((i) => i.genre.split(", ")))
  ).sort();

  const filtered =
    genre === "all"
      ? items
      : items.filter((i) => i.genre.includes(genre));

  const sorted = sortItems(filtered, sort);
  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  useEffect(() => {
    setVisibleCount(perPage);
  }, [sort, genre, perPage]);

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + perPage, sorted.length));
  }, [perPage, sorted.length]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="space-y-6">
      {/* Sort tabs */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-xl bg-white/5 p-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setSort(f.key)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                sort === f.key
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-zinc-300 outline-none focus:ring-1 focus:ring-violet-500"
        >
          <option value="all">All Genres</option>
          {allGenres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <span className="ml-auto text-xs text-zinc-600">
          {sorted.length} title{sorted.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="py-20 text-center text-zinc-500">
          No titles match this filter.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {visible.map((item) => (
            <ContentCard
              key={item.tmdbId}
              title={item.title}
              poster={item.poster}
              score={item.rating}
              year={item.year}
              genres={item.genre.split(", ")}
              type={type === "tv" && item.seasons ? `${item.seasons}S` : type === "movie" ? "Movie" : "TV"}
              href={type === "movie" ? `/movie/${item.tmdbId}` : `/tv-show/${item.tmdbId}`}
            />
          ))}
        </div>
      )}

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading more...
          </div>
        </div>
      )}

      {!hasMore && sorted.length > perPage && (
        <p className="text-center text-xs text-zinc-600 py-4">
          You&apos;ve seen all {sorted.length} titles
        </p>
      )}
    </div>
  );
}
