"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ContentCard } from "@/components/content-card";
import { TOP_MOVIES } from "@/lib/curated";

interface TmdbItem {
  id: number;
  title: string;
  year: number | null;
  rating: string | null;
  poster: string | null;
  overview: string | null;
}

type Tab = "popular" | "trending" | "top_rated";

const TABS: { label: string; value: Tab }[] = [
  { label: "Popular", value: "popular" },
  { label: "Trending", value: "trending" },
  { label: "Top Rated", value: "top_rated" },
];

export default function MoviesPage() {
  const [tab, setTab] = useState<Tab>("popular");
  const [items, setItems] = useState<TmdbItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false);

  const fetchMovies = useCallback(
    async (
      pageNum: number,
      action: string,
      query: string,
      append: boolean
    ) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        const params = new URLSearchParams({
          action: query ? "search" : action,
          type: "movie",
          page: String(pageNum),
        });
        if (query) params.set("q", query);

        const res = await fetch(`/api/tmdb?${params}`);
        const data = await res.json();

        if (data.error && data.items.length === 0 && pageNum === 1 && !query) {
          // TMDB not configured — use curated list as fallback
          setUsingFallback(true);
          setItems(
            TOP_MOVIES.map((m) => ({
              id: m.tmdbId,
              title: m.title,
              year: m.year,
              rating: m.rating,
              poster: m.poster,
              overview: null,
            }))
          );
          setHasMore(false);
          return;
        }

        if (append) {
          setItems((prev) => {
            const ids = new Set(prev.map((i) => i.id));
            return [
              ...prev,
              ...data.items.filter((i: TmdbItem) => !ids.has(i.id)),
            ];
          });
        } else {
          setItems(data.items);
        }
        setHasMore(data.hasMore);
      } catch {
        if (!append) {
          setUsingFallback(true);
          setItems(
            TOP_MOVIES.map((m) => ({
              id: m.tmdbId,
              title: m.title,
              year: m.year,
              rating: m.rating,
              poster: m.poster,
              overview: null,
            }))
          );
          setHasMore(false);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        fetchingRef.current = false;
      }
    },
    []
  );

  // Initial fetch + tab/search changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setUsingFallback(false);
    fetchMovies(1, tab, searchQuery, false);
  }, [tab, searchQuery, fetchMovies]);

  // Pagination
  useEffect(() => {
    if (page > 1 && !usingFallback) {
      fetchMovies(page, tab, searchQuery, true);
    }
  }, [page, tab, searchQuery, usingFallback, fetchMovies]);

  // IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          !loadingMore &&
          hasMore &&
          !usingFallback
        ) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, loadingMore, hasMore, usingFallback]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  }

  function clearSearch() {
    setSearchInput("");
    setSearchQuery("");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          Movies
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse and stream movies — powered by TMDB
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search movies..."
          className="flex-1 rounded-lg border border-border bg-black/5 dark:bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 focus:bg-black/10 dark:focus:bg-white/10 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !searchInput.trim()}
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "..." : "Search"}
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="rounded-lg bg-black/5 dark:bg-white/5 px-3 py-2.5 text-sm text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Tabs (hide during search) */}
      {!searchQuery && (
        <div className="flex gap-1 rounded-lg bg-black/5 dark:bg-white/5 p-1 mb-6 w-fit">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                tab === t.value
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Fallback notice */}
      {usingFallback && (
        <div className="mb-6 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-400">
          Showing curated collection. Add a free TMDB API key to{" "}
          <code className="text-amber-300">.env.local</code> for infinite
          browsing.
        </div>
      )}

      {searchQuery && items.length > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">
          Results for &quot;{searchQuery}&quot;
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] rounded-xl bg-black/5 dark:bg-white/5" />
              <div className="mt-2 h-3 w-3/4 rounded bg-black/5 dark:bg-white/5" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p className="text-sm">
            {searchQuery
              ? `No movies found for "${searchQuery}"`
              : "No movies available"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {items.map((item) => (
              <ContentCard
                key={item.id}
                title={item.title}
                poster={item.poster || ""}
                score={item.rating}
                year={item.year}
                type="Movie"
                href={`/movie/${item.id}`}
              />
            ))}
          </div>

          <div ref={sentinelRef} className="mt-8 flex justify-center py-4">
            {loadingMore && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                Loading more movies...
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
