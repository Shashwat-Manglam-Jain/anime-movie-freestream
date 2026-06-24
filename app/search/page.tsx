"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { TOP_MOVIES, TOP_TV_SHOWS } from "@/lib/curated";
import { searchMangaDex, searchComicK, type MangaItem } from "@/lib/manga-api";

type Filter = "all" | "anime" | "movie" | "tv" | "manga" | "comics" | "novels";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "anime", label: "Anime" },
  { key: "movie", label: "Movies" },
  { key: "tv", label: "TV Shows" },
  { key: "manga", label: "Manga" },
  { key: "comics", label: "Comics" },
  { key: "novels", label: "Light Novels" },
];

interface JikanAnime {
  mal_id: number;
  title: string;
  title_english?: string;
  type: string;
  score: number;
  year: number;
  images: { webp?: { large_image_url: string }; jpg: { large_image_url: string } };
  genres?: { name: string }[];
}

interface NovelResult {
  mal_id: number;
  title: string;
  title_english?: string;
  score?: number;
  images: { jpg: { large_image_url: string; image_url: string } };
  volumes?: number;
  status?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  const filter = (searchParams.get("filter") as Filter) || "all";

  const [searchInput, setSearchInput] = useState(q);
  const [loading, setLoading] = useState(false);

  const [animeSeries, setAnimeSeries] = useState<JikanAnime[]>([]);
  const [animeMovies, setAnimeMovies] = useState<JikanAnime[]>([]);
  const [mangaResults, setMangaResults] = useState<MangaItem[]>([]);
  const [comicResults, setComicResults] = useState<MangaItem[]>([]);
  const [novelResults, setNovelResults] = useState<NovelResult[]>([]);

  const [animePage, setAnimePage] = useState(1);
  const [animeHasMore, setAnimeHasMore] = useState(false);
  const [mangaPage, setMangaPage] = useState(1);
  const [mangaHasMore, setMangaHasMore] = useState(false);
  const [comicHasMore, setComicHasMore] = useState(false);
  const [novelPage, setNovelPage] = useState(1);
  const [novelHasMore, setNovelHasMore] = useState(false);

  const doSearch = useCallback(async (query: string, activeFilter: Filter) => {
    if (!query.trim()) return;
    setLoading(true);
    setAnimePage(1);
    setMangaPage(1);
    setNovelPage(1);

    const needAnime = activeFilter === "all" || activeFilter === "anime" || activeFilter === "movie";
    const needManga = activeFilter === "all" || activeFilter === "manga";
    const needComics = activeFilter === "all" || activeFilter === "comics";
    const needNovels = activeFilter === "all" || activeFilter === "novels";

    const promises: Promise<void>[] = [];

    if (needAnime) {
      promises.push(
        fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=25`)
          .then((r) => r.json())
          .then((data) => {
            const all = (data.data || []) as JikanAnime[];
            setAnimeSeries(all.filter((a) => a.type !== "Movie"));
            setAnimeMovies(all.filter((a) => a.type === "Movie"));
            setAnimeHasMore(data.pagination?.has_next_page || false);
          })
          .catch(() => { setAnimeSeries([]); setAnimeMovies([]); })
      );
    }

    if (needManga) {
      promises.push(
        searchMangaDex(query)
          .then((r) => { setMangaResults(r); setMangaHasMore(r.length >= 20); })
          .catch(() => setMangaResults([]))
      );
    }

    if (needComics) {
      promises.push(
        searchComicK(query)
          .then((r) => { setComicResults(r); setComicHasMore(false); })
          .catch(() => setComicResults([]))
      );
    }

    if (needNovels) {
      promises.push(
        fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&type=lightnovel&limit=24`)
          .then((r) => r.json())
          .then((data) => { setNovelResults(data.data || []); setNovelHasMore(data.pagination?.has_next_page || false); })
          .catch(() => setNovelResults([]))
      );
    }

    await Promise.allSettled(promises);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (q) doSearch(q, filter);
  }, [q, filter, doSearch]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchInput.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchInput.trim())}&filter=${filter}`);
  }

  function setFilter(f: Filter) {
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}&filter=${f}`);
  }

  const queryLower = q.toLowerCase();
  const showAnime = filter === "all" || filter === "anime";
  const showMovies = filter === "all" || filter === "movie";
  const showTv = filter === "all" || filter === "tv";
  const showManga = filter === "all" || filter === "manga";
  const showComics = filter === "all" || filter === "comics";
  const showNovels = filter === "all" || filter === "novels";

  const curatedMovies = showMovies
    ? TOP_MOVIES.filter((m) => m.title.toLowerCase().includes(queryLower) || m.genre.toLowerCase().includes(queryLower))
    : [];

  const tvResults = showTv
    ? TOP_TV_SHOWS.filter((s) => s.title.toLowerCase().includes(queryLower) || s.genre.toLowerCase().includes(queryLower))
    : [];

  const loadMoreAnime = useCallback(async () => {
    if (!q || !animeHasMore) return;
    const nextPage = animePage + 1;
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=25&page=${nextPage}`);
      const data = await res.json();
      const all = (data.data || []) as JikanAnime[];
      setAnimeSeries((prev) => [...prev, ...all.filter((a) => a.type !== "Movie")]);
      setAnimeMovies((prev) => [...prev, ...all.filter((a) => a.type === "Movie")]);
      setAnimeHasMore(data.pagination?.has_next_page || false);
      setAnimePage(nextPage);
    } catch { /* ignore */ }
  }, [q, animePage, animeHasMore]);

  const loadMoreManga = useCallback(async () => {
    if (!q || !mangaHasMore) return;
    const nextPage = mangaPage + 1;
    try {
      const results = await searchMangaDex(q, nextPage);
      setMangaResults((prev) => [...prev, ...results]);
      setMangaHasMore(results.length >= 20);
      setMangaPage(nextPage);
    } catch { /* ignore */ }
  }, [q, mangaPage, mangaHasMore]);

  const loadMoreNovels = useCallback(async () => {
    if (!q || !novelHasMore) return;
    const nextPage = novelPage + 1;
    try {
      const res = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(q)}&type=lightnovel&limit=24&page=${nextPage}`);
      const data = await res.json();
      setNovelResults((prev) => [...prev, ...(data.data || [])]);
      setNovelHasMore(data.pagination?.has_next_page || false);
      setNovelPage(nextPage);
    } catch { /* ignore */ }
  }, [q, novelPage, novelHasMore]);

  if (!q) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="mx-auto max-w-md space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-violet-500/10">
            <svg className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Search Everything</h1>
          <p className="text-muted-foreground">
            Search anime, movies, TV shows, manga, comics, and light novels.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 mt-6">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search..."
              className="flex-1 rounded-lg border border-border bg-black/5 dark:bg-white/5 px-4 py-2.5 text-sm text-foreground/90 placeholder:text-muted-foreground outline-none focus:border-violet-500/50 transition-colors"
              autoFocus
            />
            <button
              type="submit"
              className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    );
  }

  const hasAnime = showAnime && animeSeries.length > 0;
  const hasMovies = showMovies && (animeMovies.length > 0 || curatedMovies.length > 0);
  const hasTv = showTv && tvResults.length > 0;
  const hasManga = showManga && mangaResults.length > 0;
  const hasComics = showComics && comicResults.length > 0;
  const hasNovels = showNovels && novelResults.length > 0;
  const hasAny = hasAnime || hasMovies || hasTv || hasManga || hasComics || hasNovels;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search everything..."
          className="flex-1 rounded-lg border border-border bg-black/5 dark:bg-white/5 px-4 py-2.5 text-sm text-foreground/90 placeholder:text-muted-foreground outline-none focus:border-violet-500/50 transition-colors"
        />
        <button
          type="submit"
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
        >
          Search
        </button>
      </form>

      <div className="flex gap-1 rounded-xl bg-black/5 dark:bg-white/5 p-1 w-fit mb-8 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all whitespace-nowrap ${
              filter === f.key
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] rounded-xl bg-black/5 dark:bg-white/5" />
              <div className="mt-2 h-3 w-3/4 rounded bg-black/5 dark:bg-white/5" />
            </div>
          ))}
        </div>
      )}

      {!loading && !hasAny && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">
            No results found for &quot;{q}&quot;
            {filter !== "all" ? ` in ${filter}` : ""}.
          </p>
        </div>
      )}

      {!loading && hasAnime && (
        <SearchSection title="Anime Series" count={animeSeries.length} color="text-violet-400" dotColor="bg-violet-500" hasMore={animeHasMore} onLoadMore={loadMoreAnime}>
          {animeSeries.map((anime) => (
            <ContentCard
              key={anime.mal_id}
              title={anime.title_english || anime.title}
              poster={anime.images.webp?.large_image_url || anime.images.jpg.large_image_url}
              score={anime.score}
              year={anime.year}
              type={anime.type}
              genres={anime.genres?.map((g) => g.name)}
              href={`/watch/mal/${anime.mal_id}/1/sub`}
            />
          ))}
        </SearchSection>
      )}

      {!loading && hasMovies && (
        <SearchSection title="Movies" count={curatedMovies.length + animeMovies.length} color="text-fuchsia-400" dotColor="bg-fuchsia-500">
          {curatedMovies.map((movie) => (
            <ContentCard
              key={`c-${movie.tmdbId}`}
              title={movie.title}
              poster={movie.poster}
              score={movie.rating}
              year={movie.year}
              genres={movie.genre.split(", ")}
              type="Movie"
              href={`/movie/${movie.tmdbId}`}
            />
          ))}
          {animeMovies.map((anime) => (
            <ContentCard
              key={`a-${anime.mal_id}`}
              title={anime.title_english || anime.title}
              poster={anime.images.webp?.large_image_url || anime.images.jpg.large_image_url}
              score={anime.score}
              year={anime.year}
              type="Anime Movie"
              genres={anime.genres?.map((g) => g.name)}
              href={`/watch/mal/${anime.mal_id}/1/sub`}
            />
          ))}
        </SearchSection>
      )}

      {!loading && hasTv && (
        <SearchSection title="TV Shows" count={tvResults.length} color="text-pink-400" dotColor="bg-pink-500">
          {tvResults.map((show) => (
            <ContentCard
              key={show.tmdbId}
              title={show.title}
              poster={show.poster}
              score={show.rating}
              year={show.year}
              genres={show.genre.split(", ")}
              type="TV"
              href={`/tv-show/${show.tmdbId}`}
            />
          ))}
        </SearchSection>
      )}

      {!loading && hasManga && (
        <SearchSection title="Manga" count={mangaResults.length} color="text-emerald-400" dotColor="bg-emerald-500" hasMore={mangaHasMore} onLoadMore={loadMoreManga}>
          {mangaResults.map((manga) => (
            <Link key={manga.id} href={`/manga/MangaDex/${manga.id}`} className="group block">
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted ring-1 ring-black/5 dark:ring-white/5 transition-all group-hover:ring-violet-500/40">
                {manga.image ? (
                  <img src={manga.image} alt={manga.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-950 to-teal-950">
                    <span className="text-xs text-muted-foreground">No Cover</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                <span className="absolute top-2 left-2 rounded bg-emerald-500/80 px-1.5 py-0.5 text-[9px] font-bold text-white">MANGA</span>
                {manga.status && <span className="absolute bottom-8 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-zinc-300">{manga.status}</span>}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-xs font-semibold text-white line-clamp-2">{manga.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </SearchSection>
      )}

      {!loading && hasComics && (
        <SearchSection title="Comics" count={comicResults.length} color="text-cyan-400" dotColor="bg-cyan-500">
          {comicResults.map((comic) => (
            <Link key={comic.id} href={`/manga/ComicK/${comic.id}`} className="group block">
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted ring-1 ring-black/5 dark:ring-white/5 transition-all group-hover:ring-violet-500/40">
                {comic.image ? (
                  <img src={comic.image} alt={comic.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-cyan-950 to-blue-950">
                    <span className="text-xs text-muted-foreground">No Cover</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                <span className="absolute top-2 left-2 rounded bg-cyan-500/80 px-1.5 py-0.5 text-[9px] font-bold text-white">COMIC</span>
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-xs font-semibold text-white line-clamp-2">{comic.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </SearchSection>
      )}

      {!loading && hasNovels && (
        <SearchSection title="Light Novels" count={novelResults.length} color="text-amber-400" dotColor="bg-amber-500" hasMore={novelHasMore} onLoadMore={loadMoreNovels}>
          {novelResults.map((novel) => (
            <Link key={novel.mal_id} href={`/light-novels/${novel.mal_id}`} className="group block">
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted ring-1 ring-black/5 dark:ring-white/5 transition-all group-hover:ring-violet-500/40">
                <img src={novel.images.jpg.large_image_url || novel.images.jpg.image_url} alt={novel.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                <span className="absolute top-2 left-2 rounded bg-amber-500/80 px-1.5 py-0.5 text-[9px] font-bold text-white">NOVEL</span>
                {novel.score && (
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px]">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white">{novel.score}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-xs font-semibold text-white line-clamp-2">{novel.title_english || novel.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </SearchSection>
      )}
    </div>
  );
}

function SearchSection({
  title,
  count,
  color,
  dotColor,
  children,
  hasMore,
  onLoadMore,
}: {
  title: string;
  count: number;
  color: string;
  dotColor: string;
  children: React.ReactNode;
  hasMore?: boolean;
  onLoadMore?: () => void;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          setLoadingMore(true);
          Promise.resolve(onLoadMore()).finally(() => setLoadingMore(false));
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, loadingMore]);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-bold ${color} flex items-center gap-2`}>
          <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
          {title}
          <span className="text-sm font-normal text-muted-foreground">({count})</span>
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {children}
      </div>
      {hasMore && onLoadMore && (
        <div ref={sentinelRef} className="flex justify-center py-4 mt-2">
          {loadingMore && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
              Loading more...
            </div>
          )}
        </div>
      )}
    </section>
  );
}
