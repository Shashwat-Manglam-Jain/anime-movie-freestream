"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { type MangaItem, searchComicK, getComicKBrowse } from "@/lib/manga-api";

export default function ComicsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MangaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const [browse, setBrowse] = useState<MangaItem[]>([]);
  const [browseLoading, setBrowseLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const seenIds = useRef(new Set<string>());
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);

  const loadBrowse = useCallback(async (cursorValue: string | undefined, append: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    if (append) setLoadingMore(true); else setBrowseLoading(true);

    try {
      const { items, nextCursor } = await getComicKBrowse(cursorValue);
      const newItems: MangaItem[] = [];
      for (const item of items) {
        if (!seenIds.current.has(item.id)) {
          seenIds.current.add(item.id);
          newItems.push(item);
        }
      }

      if (append) {
        setBrowse((prev) => [...prev, ...newItems]);
      } else {
        setBrowse(newItems);
      }

      setCursor(nextCursor);
      setHasMore(nextCursor !== null);
    } catch {
      setHasMore(false);
    } finally {
      setBrowseLoading(false);
      setLoadingMore(false);
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!searched && !initialLoadDone.current) {
      initialLoadDone.current = true;
      seenIds.current.clear();
      loadBrowse(undefined, false);
    }
  }, [searched, loadBrowse]);

  useEffect(() => {
    if (searched) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current && hasMore) {
          const currentCursor = cursor;
          if (currentCursor) {
            loadBrowse(currentCursor, true);
          }
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [cursor, hasMore, searched, loadBrowse]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchComicK(q);
      setResults(data);
      setSearched(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to search comics");
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

  const displayResults = searched ? results : browse;
  const isLoading = searched ? loading : browseLoading;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Comics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search and read comics — DC, Marvel, Image, Webtoons, and more via ComicK.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search comics... (e.g. Batman, Spider-Man, Invincible)"
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

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {!searched && !browseLoading && browse.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">Browse comics · {browse.length} titles</p>
        </div>
      )}

      {searched && results.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Results for &quot;{query}&quot; · {results.length} found
          </p>
          <button
            onClick={clearSearch}
            className="text-xs text-violet-400 hover:text-violet-300"
          >
            Clear search
          </button>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] rounded-lg bg-black/5 dark:bg-white/5" />
              <div className="mt-2 h-3 w-3/4 rounded bg-black/5 dark:bg-white/5" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && displayResults.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayResults.map((comic) => (
              <Link
                key={comic.id}
                href={`/manga/ComicK/${comic.id}`}
                className="group"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-white/5 group-hover:ring-violet-500/40 transition-all bg-black/5 dark:bg-white/5">
                  {comic.image ? (
                    <img
                      src={comic.image}
                      alt={comic.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground/70 text-xs text-center p-2">
                      No Cover
                    </div>
                  )}
                  {comic.status && (
                    <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-zinc-300">
                      {comic.status}
                    </span>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/90 text-white">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="mt-1.5 text-xs font-medium text-foreground/70 line-clamp-2 group-hover:text-violet-300 transition-colors">
                  {comic.title}
                </p>
              </Link>
            ))}
          </div>

          {!searched && (
            <div ref={sentinelRef} className="mt-8 flex justify-center py-4">
              {loadingMore && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                  Loading more comics...
                </div>
              )}
              {!hasMore && browse.length > 0 && (
                <p className="text-xs text-muted-foreground/70">No more comics to load</p>
              )}
            </div>
          )}
        </>
      )}

      {!isLoading && searched && results.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <svg className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-sm">No comics found for &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
