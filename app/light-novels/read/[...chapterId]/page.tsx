"use client";

import { useState, useEffect, useCallback } from "react";
import { use } from "react";
import Link from "next/link";
import { updateContinueWatching } from "@/lib/watchlist";

interface ChapterData {
  title: string;
  content: string;
  prevChapter: string | null;
  nextChapter: string | null;
}

export default function NovelReaderPage({
  params,
}: {
  params: Promise<{ chapterId: string[] }>;
}) {
  const { chapterId: segments } = use(params);
  const chapterId = segments.join("/");

  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);

  const fetchChapter = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/novels?action=read&id=${encodeURIComponent(chapterId)}`
      );
      if (!res.ok) throw new Error("Failed to load chapter");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setChapter(data);
      window.scrollTo({ top: 0 });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load chapter");
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);

  useEffect(() => {
    if (!chapter) return;
    const novelSlug = chapterId.split("/")[0];
    const novelTitle = novelSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    updateContinueWatching({
      id: `novel-${novelSlug}`,
      type: "novel",
      title: novelTitle,
      poster: `https://images.novelbin.me/novel/${novelSlug}.jpg`,
      watchUrl: `/light-novels/read/${chapterId}`,
      episodeInfo: chapter.title,
      lastWatchedAt: Date.now(),
    });
  }, [chapter, chapterId]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        window.scrollBy({ top: -window.innerHeight * 0.8, behavior: "smooth" });
      } else if (e.key === "ArrowRight" && chapter?.nextChapter) {
        window.location.href = `/light-novels/read/${chapter.nextChapter}`;
      } else if (e.key === "ArrowLeft" && chapter?.prevChapter) {
        window.location.href = `/light-novels/read/${chapter.prevChapter}`;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [chapter]);

  const novelSlug = chapterId.split("/")[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link
            href="/light-novels"
            className="rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            &larr; Novels
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFontSize((s) => Math.max(14, s - 2))}
              className="rounded border border-border bg-muted px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
              title="Decrease font"
            >
              A-
            </button>
            <span className="text-xs text-muted-foreground w-8 text-center">{fontSize}</span>
            <button
              onClick={() => setFontSize((s) => Math.min(28, s + 2))}
              className="rounded border border-border bg-muted px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
              title="Increase font"
            >
              A+
            </button>
            <button
              onClick={() => setLineHeight((h) => (h >= 2.2 ? 1.4 : h + 0.2))}
              className="rounded border border-border bg-muted px-2 py-1 text-xs text-muted-foreground hover:bg-accent ml-1"
              title="Toggle line height"
            >
              ↕
            </button>
          </div>

          {chapter?.nextChapter ? (
            <Link
              href={`/light-novels/read/${chapter.nextChapter}`}
              className="rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              Next &rarr;
            </Link>
          ) : (
            <div className="w-16" />
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-1/3 rounded bg-white/5" />
            <div className="h-4 w-full rounded bg-white/5" />
            <div className="h-4 w-5/6 rounded bg-white/5" />
            <div className="h-4 w-full rounded bg-white/5" />
            <div className="h-4 w-4/5 rounded bg-white/5" />
            <div className="h-4 w-full rounded bg-white/5" />
            <div className="h-4 w-3/4 rounded bg-white/5" />
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="mx-auto max-w-3xl px-4 py-16">
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

      {/* Chapter content */}
      {chapter && !loading && (
        <div className="mx-auto max-w-3xl px-4 py-8">
          <h1 className="text-xl font-bold text-foreground mb-6">
            {chapter.title}
          </h1>

          <div
            className="text-foreground/80 whitespace-pre-line leading-relaxed"
            style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
          >
            {chapter.content}
          </div>

          {/* Bottom navigation */}
          <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
            {chapter.prevChapter ? (
              <Link
                href={`/light-novels/read/${chapter.prevChapter}`}
                className="rounded-lg bg-muted px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                &larr; Previous Chapter
              </Link>
            ) : (
              <div />
            )}

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Top
            </button>

            {chapter.nextChapter ? (
              <Link
                href={`/light-novels/read/${chapter.nextChapter}`}
                className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
              >
                Next Chapter &rarr;
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
