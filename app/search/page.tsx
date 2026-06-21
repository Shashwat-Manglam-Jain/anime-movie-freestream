import type { Metadata } from "next";
import Link from "next/link";
import { searchAnime } from "@/lib/jikan";
import { ContentCard } from "@/components/content-card";
import { TOP_MOVIES, TOP_TV_SHOWS } from "@/lib/curated";

export const metadata: Metadata = {
  title: "Search",
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "anime", label: "Anime" },
  { key: "movie", label: "Movies" },
  { key: "tv", label: "TV Shows" },
];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>;
}) {
  const { q, filter } = await searchParams;

  if (!q) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="mx-auto max-w-md space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-violet-500/10">
            <svg className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Search</h1>
          <p className="text-zinc-500">
            Search for anime, movies, and TV shows using the search bar above.
          </p>
        </div>
      </div>
    );
  }

  const activeFilter = filter || "all";
  const query = q.toLowerCase();

  const needsJikan = activeFilter === "all" || activeFilter === "anime" || activeFilter === "movie";

  let allJikanResults: any[] = [];
  if (needsJikan) {
    try {
      const jikanData = await searchAnime(q);
      allJikanResults = jikanData.data || [];
    } catch {
      // keep empty
    }
  }

  const animeSeries = allJikanResults.filter(
    (a) => a.type !== "Movie"
  );
  const animeMovies = allJikanResults.filter(
    (a) => a.type === "Movie"
  );

  const showAnime = activeFilter === "all" || activeFilter === "anime";
  const showMovies = activeFilter === "all" || activeFilter === "movie";
  const showTv = activeFilter === "all" || activeFilter === "tv";

  const curatedMovies = showMovies
    ? TOP_MOVIES.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.genre.toLowerCase().includes(query)
      )
    : [];

  const tvResults = showTv
    ? TOP_TV_SHOWS.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.genre.toLowerCase().includes(query)
      )
    : [];

  const hasAnimeSeries = showAnime && animeSeries.length > 0;
  const hasMovies = showMovies && (animeMovies.length > 0 || curatedMovies.length > 0);
  const hasTv = showTv && tvResults.length > 0;
  const hasAny = hasAnimeSeries || hasMovies || hasTv;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Results for &quot;{q}&quot;
        </h1>
      </div>

      <div className="flex gap-1 rounded-xl bg-white/5 p-1 w-fit mb-8">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={`/search?q=${encodeURIComponent(q)}&filter=${f.key}`}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeFilter === f.key
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {!hasAny && (
        <div className="text-center py-20">
          <p className="text-zinc-500">
            No results found for &quot;{q}&quot;
            {activeFilter !== "all" ? ` in ${activeFilter}` : ""}.
            Try a different search term
            {activeFilter !== "all" ? " or filter" : ""}.
          </p>
        </div>
      )}

      {/* Anime Series (TV, OVA, ONA, Special — NOT Movie) */}
      {hasAnimeSeries && (
        <section className="mb-12">
          <h2 className="text-lg font-bold text-violet-400 mb-4 flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-violet-500" />
            Anime Series
            <span className="text-sm font-normal text-zinc-500">
              ({animeSeries.length})
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {animeSeries.map((anime: any) => (
              <ContentCard
                key={anime.mal_id}
                title={anime.title_english || anime.title}
                poster={
                  anime.images.webp?.large_image_url ||
                  anime.images.jpg.large_image_url
                }
                score={anime.score}
                year={anime.year}
                type={anime.type}
                genres={anime.genres?.map((g: any) => g.name)}
                href={`/watch/mal/${anime.mal_id}/1/sub`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Movies (curated + anime movies from Jikan) */}
      {hasMovies && (
        <section className="mb-12">
          <h2 className="text-lg font-bold text-fuchsia-400 mb-4 flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-fuchsia-500" />
            Movies
            <span className="text-sm font-normal text-zinc-500">
              ({curatedMovies.length + animeMovies.length})
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
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
            {animeMovies.map((anime: any) => (
              <ContentCard
                key={`a-${anime.mal_id}`}
                title={anime.title_english || anime.title}
                poster={
                  anime.images.webp?.large_image_url ||
                  anime.images.jpg.large_image_url
                }
                score={anime.score}
                year={anime.year}
                type="Anime Movie"
                genres={anime.genres?.map((g: any) => g.name)}
                href={`/watch/mal/${anime.mal_id}/1/sub`}
              />
            ))}
          </div>
        </section>
      )}

      {hasTv && (
        <section className="mb-12">
          <h2 className="text-lg font-bold text-pink-400 mb-4 flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-pink-500" />
            TV Shows
            <span className="text-sm font-normal text-zinc-500">
              ({tvResults.length})
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
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
          </div>
        </section>
      )}
    </div>
  );
}
