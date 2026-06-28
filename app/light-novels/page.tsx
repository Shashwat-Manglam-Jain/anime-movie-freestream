"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  getPopularNovelsPaginated,
  searchAllSources,
  type NormalizedNovel,
} from "@/lib/novel-api";

export default function LightNovelsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NormalizedNovel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [browse, setBrowse] = useState<NormalizedNovel[]>([]);
  const [browseLoading, setBrowseLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const initializedRef = useRef(false);

  // Fetch a page of novels from AniList
  const fetchPage = useCallback(async (page: number, isInitial: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    if (isInitial) {
      setBrowseLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const { novels, hasNext } = await getPopularNovelsPaginated(page);

      setBrowse((prev) => {
        if (isInitial) return novels;
        // Deduplicate by ID when appending
        const existingIds = new Set(prev.map((n) => n.id));
        const unique = novels.filter((n) => !existingIds.has(n.id));
        return [...prev, ...unique];
      });
      setHasMore(hasNext);
      pageRef.current = page;
    } catch {
      if (isInitial) setBrowse([]);
      setHasMore(false);
    } finally {
      setBrowseLoading(false);
      setLoadingMore(false);
      loadingRef.current = false;
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    fetchPage(1, true);
  }, [fetchPage]);

  // IntersectionObserver for infinite scroll
  const browseLen = browse.length;
  useEffect(() => {
    if (searched) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current && hasMore) {
          fetchPage(pageRef.current + 1, false);
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [searched, hasMore, fetchPage, browseLen]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchAllSources(q);
      setResults(data);
      setSearched(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to search");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    search(query);
  }

  function clearSearch() {
    setSearched(false);
    setResults([]);
    setQuery("");
  }

  function novelHref(novel: NormalizedNovel) {
    if (novel.source === "novelfire") {
      return `/light-novels/${novel.id}`;
    }
    return `/light-novels/${novel.id}`;
  }

  const displayItems = searched ? results : browse;
  const isLoading = searched ? loading : browseLoading;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          Light Novels
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse and discover light novels — powered by AniList &amp; NovelFire.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search light novels... (e.g. Sword Art Online, Re:Zero)"
          className="flex-1 rounded-lg border border-border bg-black/5 dark:bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 focus:bg-black/10 dark:focus:bg-white/10 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Searching..." : "Search"}
        </button>
        {searched && (
          <button
            type="button"
            onClick={clearSearch}
            className="rounded-lg bg-black/5 dark:bg-white/5 px-3 py-2.5 text-sm text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {!searched && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Popular Novels
          </h2>
        </div>
      )}

      {searched && results.length > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">
          Results for &quot;{query}&quot;
        </p>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] rounded-lg bg-black/5 dark:bg-white/5" />
              <div className="mt-2 h-3 w-3/4 rounded bg-black/5 dark:bg-white/5" />
              <div className="mt-1 h-3 w-1/2 rounded bg-black/5 dark:bg-white/5" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && displayItems.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayItems.map((novel) => (
              <Link
                key={`${novel.source}-${novel.id}`}
                href={novelHref(novel)}
                className="group"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-white/5 group-hover:ring-violet-500/40 transition-all bg-black/5 dark:bg-white/5">
                  {novel.image ? (
                    <img
                      src={novel.image}
                      alt={novel.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground/70 text-xs px-2 text-center">
                      {novel.title}
                    </div>
                  )}
                  {novel.score && (
                    <div className="absolute top-1 right-1 flex items-center gap-0.5 rounded bg-black/60 px-1 py-0.5 text-[10px]">
                      <span className="text-yellow-400">&#9733;</span>
                      <span className="text-white">{novel.score.toFixed(1)}</span>
                    </div>
                  )}
                  <span
                    className={`absolute top-1 left-1 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                      novel.source === "anilist"
                        ? "bg-blue-500/80 text-white"
                        : "bg-emerald-500/80 text-white"
                    }`}
                  >
                    {novel.source === "anilist" ? "AniList" : "NovelFire"}
                  </span>
                  {novel.status && (
                    <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-zinc-300">
                      {novel.status}
                    </span>
                  )}
                </div>
                <div className="mt-1.5 space-y-0.5">
                  <p className="text-xs font-medium text-foreground/70 line-clamp-2 group-hover:text-violet-300 transition-colors">
                    {novel.title}
                  </p>
                  {novel.chapters && (
                    <p className="text-[10px] text-muted-foreground/70">
                      {novel.chapters} chapters
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {!searched && (
            <div ref={sentinelRef} className="mt-8 flex justify-center py-4">
              {loadingMore && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                  Loading more novels...
                </div>
              )}
              {!hasMore && browse.length > 0 && (
                <p className="text-xs text-muted-foreground/70">No more results</p>
              )}
            </div>
          )}
        </>
      )}

      {!isLoading && searched && results.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p className="text-sm">
            No light novels found for &ldquo;{query}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
