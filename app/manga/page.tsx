"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type MangaProvider,
  type MangaItem,
  searchManga,
  getPopular,
  getLatest,
  getRecentlyAdded,
} from "@/lib/manga-api";

const PROVIDERS: { value: MangaProvider; label: string }[] = [
  { value: "MangaDex", label: "MangaDex" },
  { value: "ComicK", label: "ComicK" },
];

type Tab = "popular" | "latest-updates" | "recently-added";

const TABS: { label: string; value: Tab }[] = [
  { label: "Popular", value: "popular" },
  { label: "Latest Updates", value: "latest-updates" },
  { label: "Recently Added", value: "recently-added" },
];

type StatusFilter = "all" | "Ongoing" | "Completed" | "Hiatus";
const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Ongoing", value: "Ongoing" },
  { label: "Completed", value: "Completed" },
  { label: "Hiatus", value: "Hiatus" },
];

export default function MangaBrowsePage() {
  const [provider, setProvider] = useState<MangaProvider>("MangaDex");
  const [tab, setTab] = useState<Tab>("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [items, setItems] = useState<MangaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [englishOnly, setEnglishOnly] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filteredItems = statusFilter === "all"
    ? items
    : items.filter((i) => i.status === statusFilter);

  const fetchPage = useCallback(async (pageNum: number, append: boolean) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      let results: MangaItem[];
      if (searchQuery) {
        results = await searchManga(searchQuery, pageNum, provider, englishOnly);
      } else if (tab === "popular") {
        results = await getPopular(pageNum, provider, englishOnly);
      } else if (tab === "latest-updates") {
        results = await getLatest(pageNum, provider, englishOnly);
      } else {
        results = await getRecentlyAdded(pageNum, provider, englishOnly);
      }
      if (append) {
        setItems((prev) => {
          const ids = new Set(prev.map((i) => i.id));
          return [...prev, ...results.filter((r) => !ids.has(r.id))];
        });
      } else {
        setItems(results);
      }
      setHasMore(results.length >= 10);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      if (!append) setItems([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [provider, tab, searchQuery, englishOnly]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchPage(1, false);
  }, [provider, tab, searchQuery, englishOnly, fetchPage]);

  useEffect(() => {
    if (page > 1) {
      fetchPage(page, true);
    }
  }, [page, fetchPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, loadingMore, hasMore]);

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          Manga
        </h1>
        <p className="mt-1 text-muted-foreground">
          Browse and read manga from MangaDex &amp; ComicK
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as MangaProvider)}
          className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground/90 outline-none focus:ring-2 focus:ring-violet-500/50"
        >
          {PROVIDERS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search manga..."
            className="flex-1 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground/90 placeholder:text-muted-foreground/70 outline-none focus:ring-2 focus:ring-violet-500/50"
          />
          <button
            type="submit"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="rounded-lg bg-black/5 dark:bg-white/5 px-3 py-2 text-sm text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground transition-colors"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        {!searchQuery && (
          <div className="flex gap-1 rounded-lg bg-black/5 dark:bg-white/5 p-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
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

        <button
          onClick={() => setEnglishOnly(!englishOnly)}
          className={`rounded-lg px-3 py-2 text-xs font-medium border transition-all ${
            englishOnly
              ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
              : "bg-black/5 dark:bg-white/5 border-border text-muted-foreground hover:text-foreground/70"
          }`}
        >
          {englishOnly ? "EN Only" : "All Languages"}
        </button>

        <div className="flex gap-1 rounded-lg bg-black/5 dark:bg-white/5 p-0.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                statusFilter === f.value
                  ? "bg-violet-600 text-white"
                  : "text-muted-foreground hover:text-foreground/70"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {!loading && items.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-muted-foreground">
            {filteredItems.length} titles{statusFilter !== "all" ? ` (${statusFilter})` : ""}
          </span>
        </div>
      )}

      {searchQuery && (
        <p className="mb-4 text-sm text-muted-foreground">
          Search results for &quot;{searchQuery}&quot;
        </p>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 mb-6">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={() => fetchPage(page, false)}
            className="mt-2 text-xs text-red-300 underline hover:text-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/3] w-full rounded-xl bg-black/5 dark:bg-white/5" />
              <Skeleton className="h-4 w-3/4 bg-black/5 dark:bg-white/5" />
              <Skeleton className="h-3 w-1/2 bg-black/5 dark:bg-white/5" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground">No manga found</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Try a different provider or search term
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredItems.map((item) => (
              <Link
                key={item.id}
                href={`/manga/${provider}/${item.id}`}
                className="group space-y-2"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted ring-1 ring-black/5 dark:ring-white/5 transition-all group-hover:ring-2 group-hover:ring-violet-500/40 group-hover:shadow-lg group-hover:shadow-violet-500/10">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-950 to-fuchsia-950">
                      <span className="text-xs text-muted-foreground">No Image</span>
                    </div>
                  )}
                  {item.status && (
                    <span className="absolute bottom-2 left-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-zinc-300 backdrop-blur-sm">
                      {item.status}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-medium text-foreground/90 line-clamp-2 group-hover:text-violet-300 transition-colors">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>

          <div ref={sentinelRef} className="mt-8 flex justify-center py-4">
            {loadingMore && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                Loading more...
              </div>
            )}
            {!hasMore && filteredItems.length > 0 && (
              <p className="text-xs text-muted-foreground/70">No more results</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
