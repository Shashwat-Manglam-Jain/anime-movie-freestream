"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { use } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { type MangaProvider, type MangaDetail, getMangaInfo } from "@/lib/manga-api";
import { updateContinueWatching, getContinueWatching } from "@/lib/watchlist";

const CHAPTERS_PER_PAGE = 50;

export default function MangaDetailPage({
  params,
}: {
  params: Promise<{ provider: string; id: string[] }>;
}) {
  const { provider: rawProvider, id: idSegments } = use(params);
  const provider = (rawProvider === "ComicK" ? "ComicK" : "MangaDex") as MangaProvider;
  const id = idSegments.join("/");

  const [manga, setManga] = useState<MangaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [chapterSearch, setChapterSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(CHAPTERS_PER_PAGE);
  const [sortAsc, setSortAsc] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMangaInfo(id, provider)
      .then((data) => setManga(data))
      .catch(() => setManga(null))
      .finally(() => setLoading(false));
  }, [id, provider]);

  const chapters = manga?.chapters ?? [];

  const filteredChapters = useMemo(() => {
    let list = chapters;
    if (chapterSearch.trim()) {
      const q = chapterSearch.toLowerCase();
      list = list.filter(
        (ch) =>
          (ch.title || "").toLowerCase().includes(q) ||
          String(ch.chapterNumber || "").includes(q)
      );
    }
    if (sortAsc) list = [...list].reverse();
    return list;
  }, [chapters, chapterSearch, sortAsc]);

  const visibleChapters = useMemo(
    () => filteredChapters.slice(0, visibleCount),
    [filteredChapters, visibleCount]
  );

  const hasMore = visibleCount < filteredChapters.length;

  useEffect(() => {
    setVisibleCount(CHAPTERS_PER_PAGE);
  }, [chapterSearch, sortAsc]);

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + CHAPTERS_PER_PAGE, filteredChapters.length));
  }, [filteredChapters.length]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const continueReading = useMemo(() => {
    const items = getContinueWatching();
    return items.find((i) => i.id === `manga-${provider}-${id}`);
  }, [id, provider]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="animate-pulse flex flex-col md:flex-row gap-6">
          <div className="w-48 shrink-0 aspect-[2/3] rounded-xl bg-black/5 dark:bg-white/5" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-2/3 rounded bg-black/5 dark:bg-white/5" />
            <div className="h-4 w-1/3 rounded bg-black/5 dark:bg-white/5" />
            <div className="h-24 rounded bg-black/5 dark:bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Manga Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          Could not load manga details. The provider may be unavailable.
        </p>
        <Link
          href="/manga"
          className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
        >
          Back to Browse
        </Link>
      </div>
    );
  }

  const coverImage = manga.cover || manga.image;
  const description =
    typeof manga.description === "string"
      ? manga.description.replace(/<[^>]*>/g, "")
      : undefined;

  return (
    <div>
      {/* Banner */}
      <div className="relative h-48 md:h-64 w-full overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt=""
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-violet-950 to-fuchsia-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16">
        <div className="flex flex-col md:flex-row gap-6 -mt-32 relative z-10">
          {/* Cover */}
          <div className="shrink-0">
            <div className="relative w-40 md:w-48 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              {manga.image ? (
                <img
                  src={manga.image}
                  alt={manga.title}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-950 to-fuchsia-950">
                  <span className="text-xs text-muted-foreground">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4 pt-2">
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                {manga.title}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              {manga.status && (
                <Badge variant="outline" className="border-border">
                  {manga.status}
                </Badge>
              )}
              {manga.releaseDate && (
                <Badge variant="outline" className="border-border">
                  {manga.releaseDate}
                </Badge>
              )}
              {chapters.length > 0 && (
                <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20">
                  {chapters.length} chapters
                </Badge>
              )}
            </div>

            {manga.authors && manga.authors.length > 0 && (
              <p className="text-sm text-muted-foreground">
                <span className="text-muted-foreground">Author:</span>{" "}
                {manga.authors.join(", ")}
              </p>
            )}

            {manga.genres && manga.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {manga.genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="bg-black/5 dark:bg-white/5 text-foreground/70 text-xs"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            {description && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                {description}
              </p>
            )}

            <div className="flex gap-2">
              {chapters.length > 0 && (
                <Link
                  href={`/manga/read/${provider}/${chapters[chapters.length - 1].id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 px-4 py-2 text-xs font-medium text-white transition-colors"
                >
                  Start Reading Ch 1
                </Link>
              )}
              {continueReading && (
                <Link
                  href={continueReading.watchUrl}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-medium text-white transition-colors"
                >
                  Continue {continueReading.episodeInfo}
                </Link>
              )}
              <Link
                href="/manga"
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-black/5 dark:bg-white/5 px-3 py-1.5 text-sm text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground transition-colors"
              >
                &larr; Browse
              </Link>
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <div className="mt-12 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight">
              Chapters
              {chapters.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({chapters.length})
                </span>
              )}
            </h2>

            {chapters.length > 10 && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={chapterSearch}
                    onChange={(e) => setChapterSearch(e.target.value)}
                    placeholder={`Search ${chapters.length} chapters...`}
                    className="w-full rounded-lg border border-border bg-black/5 dark:bg-white/5 pl-9 pr-3 py-2 text-sm text-foreground/90 placeholder:text-muted-foreground/70 outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
                <button
                  onClick={() => setSortAsc(!sortAsc)}
                  className="shrink-0 rounded-lg border border-border bg-black/5 dark:bg-white/5 px-3 py-2 text-xs text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground transition-colors"
                >
                  {sortAsc ? "Oldest First" : "Newest First"}
                </button>
              </div>
            )}
          </div>

          {chapters.length === 0 ? (
            <p className="text-sm text-muted-foreground">No chapters available.</p>
          ) : (
            <>
              {chapterSearch && (
                <p className="text-xs text-muted-foreground">
                  {filteredChapters.length} of {chapters.length} chapters match
                </p>
              )}
              <div className="rounded-xl border border-border bg-black/[0.02] dark:bg-white/[0.02]">
                {visibleChapters.map((ch, idx) => {
                  const chapterLabel =
                    ch.chapterNumber != null
                      ? `Chapter ${ch.chapterNumber}`
                      : ch.title || `Chapter ${idx + 1}`;
                  const chapterTitle =
                    ch.title && ch.chapterNumber != null ? ch.title : null;
                  return (
                    <Link
                      key={ch.id}
                      href={`/manga/read/${provider}/${ch.id}`}
                      className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5 last:border-b-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="shrink-0 w-10 text-right text-xs text-muted-foreground/70 tabular-nums">
                          {ch.chapterNumber ?? idx + 1}
                        </span>
                        <div className="min-w-0">
                          <span className="text-foreground/90 font-medium">
                            {chapterLabel}
                          </span>
                          {chapterTitle && (
                            <span className="ml-2 text-muted-foreground truncate">
                              - {chapterTitle}
                            </span>
                          )}
                        </div>
                      </div>
                      {ch.pages != null && (
                        <span className="shrink-0 text-xs text-muted-foreground/70">
                          {ch.pages}p
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {hasMore && (
                <div ref={loaderRef} className="flex justify-center py-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Showing {visibleCount} of {filteredChapters.length}...
                  </div>
                </div>
              )}

              {!hasMore && filteredChapters.length > CHAPTERS_PER_PAGE && (
                <p className="text-center text-xs text-muted-foreground/70 py-3">
                  All {filteredChapters.length} chapters shown
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
