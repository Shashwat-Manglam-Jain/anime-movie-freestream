"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ContentCard } from "@/components/content-card";

interface GridItem {
  id: string;
  title: string;
  poster: string;
  score: number | string | null;
  year: number | string | null;
  genres: string[];
  href: string;
  type?: string;
  hasSub?: boolean;
  hasDub?: boolean;
}

interface AnimeInfiniteGridProps {
  initialItems: GridItem[];
  initialHasMore: boolean;
  filterType: string;
}

export function AnimeInfiniteGrid({
  initialItems,
  initialHasMore,
  filterType,
}: AnimeInfiniteGridProps) {
  const [items, setItems] = useState<GridItem[]>(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(initialItems);
    setHasMore(initialHasMore);
    setPage(2);
  }, [initialItems, initialHasMore]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/anime?type=${filterType}&page=${page}`);
      const data = await res.json();
      if (data.items?.length) {
        setItems((prev) => [...prev, ...data.items]);
        setHasMore(data.hasMore);
        setPage((p) => p + 1);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, filterType]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {items.map((item, i) => (
          <ContentCard
            key={`${item.id}-${i}`}
            title={item.title}
            poster={item.poster}
            score={item.score}
            year={item.year}
            genres={item.genres}
            href={item.href}
            type={item.type}
            hasSub={item.hasSub}
            hasDub={item.hasDub}
          />
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-10">
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <svg
                className="h-5 w-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Loading more...
            </div>
          )}
        </div>
      )}

      {!hasMore && items.length > 24 && (
        <p className="text-center text-sm text-muted-foreground/70 py-6">
          You&apos;ve reached the end
        </p>
      )}
    </>
  );
}
