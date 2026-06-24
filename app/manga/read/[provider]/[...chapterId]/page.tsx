"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { use } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { type MangaProvider, type ChapterPage, readChapter } from "@/lib/manga-api";
import { updateContinueWatching } from "@/lib/watchlist";

export default function MangaReaderPage({
  params,
}: {
  params: Promise<{ provider: string; chapterId: string[] }>;
}) {
  const { provider: rawProvider, chapterId: chapterIdSegments } = use(params);
  const provider = (rawProvider === "ComicK" ? "ComicK" : "MangaDex") as MangaProvider;
  const chapterId = chapterIdSegments.join("/");

  const [pages, setPages] = useState<ChapterPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchChapter = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLoadedImages(new Set());
    try {
      const result = await readChapter(chapterId, provider);
      if (!result || result.length === 0) {
        setError("No pages returned from the provider. The chapter may be unavailable.");
      }
      setPages(result);
    } catch (e: unknown) {
      console.error("Chapter fetch error:", e);
      setError(e instanceof Error ? e.message : "Failed to load chapter");
      setPages([]);
    } finally {
      setLoading(false);
    }
  }, [chapterId, provider]);

  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);

  useEffect(() => {
    if (pages.length === 0) return;
    const slug = chapterId.split("/")[0] || chapterId;
    const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    updateContinueWatching({
      id: `manga-${provider}-${slug}`,
      type: "manga",
      title,
      poster: "",
      watchUrl: `/manga/read/${provider}/${chapterId}`,
      episodeInfo: `Ch ${chapterId.split("chapter-")[1]?.split("-")[0] || "?"}`,
      lastWatchedAt: Date.now(),
    });
  }, [pages, chapterId, provider]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        window.scrollBy({
          top: -window.innerHeight * 0.8,
          behavior: "smooth",
        });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleImageLoad(index: number) {
    setLoadedImages((prev) => new Set(prev).add(index));
  }

  const totalPages = pages.length;
  const loadedCount = loadedImages.size;

  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link
            href="/manga"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            &larr; Browse
          </Link>

          <div className="text-sm text-zinc-500">
            {loading
              ? "Loading..."
              : totalPages > 0
                ? `${loadedCount} of ${totalPages} pages loaded`
                : "No pages"}
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            Top
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={fetchChapter}
              className="mt-2 text-xs text-red-300 underline hover:text-red-200"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="mx-auto max-w-4xl space-y-2 px-4 py-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="aspect-[2/3] w-full rounded-lg bg-white/5"
            />
          ))}
        </div>
      )}

      {!loading && pages.length > 0 && (
        <div ref={containerRef} className="mx-auto max-w-4xl px-0 sm:px-4">
          {pages.map((pg, idx) => (
            <div key={idx} className="relative w-full min-h-[100px]">
              <img
                src={pg.img}
                alt={`Page ${pg.page + 1}`}
                className="w-full select-none"
                onLoad={() => handleImageLoad(idx)}
                onError={() => handleImageLoad(idx)}
                loading={idx < 5 ? "eager" : "lazy"}
                referrerPolicy="no-referrer"
              />
              {!loadedImages.has(idx) && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                    <span className="text-xs text-zinc-600">
                      Page {pg.page + 1}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && pages.length === 0 && !error && (
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <p className="text-zinc-500">No pages found for this chapter.</p>
          <p className="mt-1 text-xs text-zinc-600">
            This provider may not support reading, or the chapter is unavailable.
          </p>
          <p className="mt-2 text-xs text-zinc-700">
            Provider: {provider} | Chapter: {chapterId}
          </p>
        </div>
      )}

      {!loading && pages.length > 0 && (
        <div className="border-t border-white/5 bg-zinc-950/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
            <Link
              href="/manga"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              &larr; Back to Browse
            </Link>

            <span className="text-sm text-zinc-500">
              {totalPages} pages
            </span>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
            >
              Back to Top
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
