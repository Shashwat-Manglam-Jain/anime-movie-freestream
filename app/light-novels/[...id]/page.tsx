"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { use } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getContinueWatching } from "@/lib/watchlist";
import {
  getNovelInfo,
  getNovelBinInfo,
  getNovelBinChapters,
  findNovelBinMatch,
  type NormalizedNovel,
  type NovelBinChapter,
} from "@/lib/novel-api";

const CHAPTERS_PER_PAGE = 50;

export default function LightNovelDetailPage({
  params,
}: {
  params: Promise<{ id: string[] }>;
}) {
  const { id: segments } = use(params);

  const isNovelBin = segments[0] === "novelbin";
  const anilistId = isNovelBin ? null : segments[0];
  const novelBinSlugFromUrl = isNovelBin ? segments.slice(1).join("/") : null;

  const [novel, setNovel] = useState<NormalizedNovel | null>(null);
  const [novelBinSlug, setNovelBinSlug] = useState<string | null>(
    novelBinSlugFromUrl
  );
  const [chapters, setChapters] = useState<NovelBinChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [chaptersError, setChaptersError] = useState<string | null>(null);

  const [chapterSearch, setChapterSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(CHAPTERS_PER_PAGE);
  const [sortAsc, setSortAsc] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (isNovelBin && novelBinSlugFromUrl) {
      getNovelBinInfo(novelBinSlugFromUrl)
        .then((info) => {
          if (!info) {
            setError("Novel not found on NovelBin");
            return;
          }
          setNovel({
            id: `novelbin/${info.id}`,
            title: info.title,
            image: info.image || null,
            score: null,
            chapters: null,
            status: info.status || null,
            description: info.description || null,
            genres: info.genres || [],
            source: "novelbin",
          });
        })
        .catch(() => setError("Failed to load novel"))
        .finally(() => setLoading(false));
    } else if (anilistId) {
      getNovelInfo(anilistId)
        .then((info) => {
          if (!info) {
            setError("Novel not found");
            return;
          }
          setNovel(info);
        })
        .catch(() => setError("Failed to load novel info"))
        .finally(() => setLoading(false));
    } else {
      setError("Invalid novel URL");
      setLoading(false);
    }
  }, [isNovelBin, anilistId, novelBinSlugFromUrl]);

  useEffect(() => {
    if (!novel) return;

    setChaptersLoading(true);
    setChaptersError(null);

    async function loadChapters() {
      try {
        if (novelBinSlug) {
          const chaps = await getNovelBinChapters(novelBinSlug);
          setChapters(chaps);
          if (chaps.length === 0) {
            setChaptersError("No free chapters available for this novel");
          }
        } else if (novel) {
          const match = await findNovelBinMatch(novel.title, novel.titleAlt);
          if (match) {
            setNovelBinSlug(match.id);
            const chaps = await getNovelBinChapters(match.id);
            setChapters(chaps);
            if (chaps.length === 0) {
              setChaptersError("No free chapters available for this novel");
            }
          } else {
            setChaptersError("No free chapters available for this novel");
          }
        }
      } catch {
        setChaptersError("Failed to load chapters");
      } finally {
        setChaptersLoading(false);
      }
    }

    loadChapters();
  }, [novel, novelBinSlug]);

  const filteredChapters = useMemo(() => {
    let list = chapters;
    if (chapterSearch.trim()) {
      const q = chapterSearch.toLowerCase();
      list = list.filter(
        (ch) =>
          ch.title.toLowerCase().includes(q) || ch.id.toLowerCase().includes(q)
      );
    }
    if (!sortAsc) {
      list = [...list].reverse();
    }
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
    setVisibleCount((c) =>
      Math.min(c + CHAPTERS_PER_PAGE, filteredChapters.length)
    );
  }, [filteredChapters.length]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const continueReading = useMemo(() => {
    const items = getContinueWatching();
    const key = novelBinSlug
      ? `novel-${novelBinSlug}`
      : `novel-${anilistId}`;
    return items.find((i) => i.id === key);
  }, [novelBinSlug, anilistId]);

  if (loading) {
    return (
      <div>
        <div className="h-48 md:h-64 w-full bg-gradient-to-r from-violet-950/50 to-fuchsia-950/50 animate-pulse" />
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row gap-6 -mt-32 relative z-10">
            <div className="w-40 md:w-48 shrink-0 aspect-[2/3] rounded-xl bg-black/5 dark:bg-white/5 animate-pulse" />
            <div className="flex-1 space-y-3 pt-2">
              <div className="h-8 w-2/3 rounded bg-black/5 dark:bg-white/5 animate-pulse" />
              <div className="h-4 w-1/3 rounded bg-black/5 dark:bg-white/5 animate-pulse" />
              <div className="h-20 rounded bg-black/5 dark:bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !novel) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Novel Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          {error || "Could not load novel details."}
        </p>
        <Link
          href="/light-novels"
          className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
        >
          Back to Browse
        </Link>
      </div>
    );
  }

  const coverImage = novel.image;

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
            <div className="relative w-40 md:w-48 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={novel.title}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-950 to-fuchsia-950">
                  <span className="text-xs text-zinc-500 px-4 text-center">{novel.title}</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4 pt-2">
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                {novel.title}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                className={
                  novel.source === "anilist"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }
              >
                {novel.source === "anilist" ? "AniList" : "NovelBin"}
              </Badge>
              {novel.score && (
                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                  ★ {novel.score.toFixed(1)}
                </Badge>
              )}
              {novel.status && (
                <Badge variant="outline" className="border-border">
                  {novel.status}
                </Badge>
              )}
              {novel.chapters && (
                <Badge variant="outline" className="border-border">
                  {novel.chapters} chapters
                </Badge>
              )}
              {chapters.length > 0 && (
                <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20">
                  {chapters.length} free chapters
                </Badge>
              )}
            </div>

            {novel.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {novel.genres.map((g) => (
                  <Badge
                    key={g}
                    variant="secondary"
                    className="bg-black/5 dark:bg-white/5 text-foreground/70 text-xs"
                  >
                    {g}
                  </Badge>
                ))}
              </div>
            )}

            {novel.description && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl line-clamp-4">
                {novel.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {chapters.length > 0 && (
                <Link
                  href={`/light-novels/read/${chapters[0].id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 px-4 py-2 text-xs font-medium text-white transition-colors"
                >
                  Start Reading
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </Link>
              )}
              {continueReading && (
                <Link
                  href={continueReading.watchUrl}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-medium text-white transition-colors"
                >
                  Continue · {continueReading.episodeInfo}
                </Link>
              )}
              <Link
                href="/light-novels"
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-black/5 dark:bg-white/5 px-3 py-1.5 text-xs text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground transition-colors"
              >
                ← Browse
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
                  {sortAsc ? "Ch 1 →" : "→ Ch 1"}
                </button>
              </div>
            )}
          </div>

          {chaptersLoading && (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse h-10 rounded-lg bg-black/5 dark:bg-white/5" />
              ))}
            </div>
          )}

          {chaptersError && !chaptersLoading && (
            <div className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              <p>{chaptersError}</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                This novel may not be available for free reading on NovelBin.
              </p>
            </div>
          )}

          {!chaptersLoading && chapters.length > 0 && (
            <>
              {chapterSearch && (
                <p className="mb-2 text-xs text-muted-foreground">
                  {filteredChapters.length} of {chapters.length} chapters match
                </p>
              )}
              <div className="rounded-xl border border-border bg-black/[0.02] dark:bg-white/[0.02]">
                {visibleChapters.map((ch, idx) => (
                  <Link
                    key={ch.id}
                    href={`/light-novels/read/${ch.id}`}
                    className="flex items-center gap-3 border-b border-border px-4 py-3 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5 last:border-b-0"
                  >
                    <span className="shrink-0 w-10 text-right text-xs text-muted-foreground/70 tabular-nums">
                      {sortAsc ? idx + 1 : filteredChapters.length - idx}
                    </span>
                    <span className="text-foreground/90 font-medium truncate">
                      {ch.title}
                    </span>
                  </Link>
                ))}
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

          {!chaptersLoading && chapters.length === 0 && !chaptersError && (
            <p className="text-sm text-muted-foreground">No chapters available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
