import { getRecentAnime } from "@/lib/anikoto";
import { getTopAnime } from "@/lib/jikan";
import { TOP_MOVIES, TOP_TV_SHOWS } from "@/lib/curated";
import { FeaturedCarousel, type FeaturedItem } from "@/components/featured-carousel";
import { ContentCard } from "@/components/content-card";
import { ContentRow } from "@/components/content-row";
import { ContinueWatching } from "@/components/continue-watching";
import { HomeReadingRows } from "@/components/home-reading-rows";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";

async function fetchWithRetry(url: string, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok || i === retries) return res;
    } catch (e) {
      if (i === retries) throw e;
    }
  }
  throw new Error("fetch failed");
}

async function getTmdbTrending(type: "movie" | "tv", page = 1): Promise<FeaturedItem[]> {
  const key = process.env.TMDB_API_KEY;
  if (!key) return [];
  try {
    const res = await fetchWithRetry(`${TMDB_BASE}/trending/${type}/week?api_key=${key}&page=${page}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).slice(0, 10).map((item: any) => ({
      title: type === "tv" ? (item.name || item.original_name) : (item.title || item.original_title),
      year: type === "tv"
        ? (item.first_air_date ? new Date(item.first_air_date).getFullYear() : 0)
        : (item.release_date ? new Date(item.release_date).getFullYear() : 0),
      rating: item.vote_average ? item.vote_average.toFixed(1) : "N/A",
      genre: "",
      poster: item.backdrop_path ? `${IMG_ORIGINAL}${item.backdrop_path}` : (item.poster_path ? `${IMG_ORIGINAL}${item.poster_path}` : ""),
      href: type === "movie" ? `/movie/${item.id}` : `/tv-show/${item.id}`,
      type: type as "movie" | "tv",
    })).filter((item: FeaturedItem) => item.poster);
  } catch {
    return [];
  }
}

async function getTmdbPopular(type: "movie" | "tv"): Promise<{ id: number; title: string; poster: string; rating: string; year: number }[]> {
  const key = process.env.TMDB_API_KEY;
  if (!key) return [];
  try {
    const res = await fetchWithRetry(`${TMDB_BASE}/${type}/popular?api_key=${key}&page=1`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((item: any) => ({
      id: item.id,
      title: type === "tv" ? (item.name || item.original_name) : (item.title || item.original_title),
      poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
      rating: item.vote_average ? item.vote_average.toFixed(1) : "0",
      year: type === "tv"
        ? (item.first_air_date ? new Date(item.first_air_date).getFullYear() : 0)
        : (item.release_date ? new Date(item.release_date).getFullYear() : 0),
    })).filter((item: any) => item.poster);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [recentAnimeResult, topAnimeResult, trendingMoviesResult, trendingTVResult, popularMoviesResult, popularTVResult] =
    await Promise.allSettled([
      getRecentAnime(1, 12),
      getTopAnime(1, 12),
      getTmdbTrending("movie"),
      getTmdbTrending("tv"),
      getTmdbPopular("movie"),
      getTmdbPopular("tv"),
    ]);

  const recentAnime = recentAnimeResult.status === "fulfilled" ? recentAnimeResult.value : { data: [] };
  const topAnime = topAnimeResult.status === "fulfilled" ? topAnimeResult.value : { data: [] };

  const featured: FeaturedItem[] = [];

  if (topAnime.data.length > 0) {
    for (const a of topAnime.data.slice(0, 3)) {
      featured.push({
        title: a.title_english || a.title,
        year: a.year || 0,
        rating: String(a.score || "N/A"),
        genre: a.genres?.map((g) => g.name).join(", ") || "",
        poster: a.images.webp?.large_image_url || a.images.jpg.large_image_url,
        href: `/watch/mal/${a.mal_id}/1/sub`,
        type: "anime",
      });
    }
  }

  if (trendingMoviesResult.status === "fulfilled") featured.push(...trendingMoviesResult.value);
  if (trendingTVResult.status === "fulfilled") featured.push(...trendingTVResult.value);

  if (featured.length <= 3) {
    for (const m of [...TOP_MOVIES].sort((a, b) => b.year - a.year).slice(0, 4)) {
      const posterPath = m.poster.split("/w500/")[1];
      featured.push({
        title: m.title, year: m.year, rating: m.rating, genre: m.genre,
        poster: posterPath ? `${IMG_ORIGINAL}/${posterPath}` : m.poster,
        href: `/movie/${m.tmdbId}`, type: "movie",
      });
    }
  }

  const popularMovies = popularMoviesResult.status === "fulfilled" ? popularMoviesResult.value : [];
  const popularTV = popularTVResult.status === "fulfilled" ? popularTVResult.value : [];

  const movieItems = popularMovies.length > 0
    ? popularMovies
    : TOP_MOVIES.map((m) => ({ id: m.tmdbId, title: m.title, poster: m.poster, rating: m.rating, year: m.year }));

  const tvItems = popularTV.length > 0
    ? popularTV
    : TOP_TV_SHOWS.map((s) => ({ id: s.tmdbId, title: s.title, poster: s.poster, rating: s.rating, year: s.year }));

  return (
    <div>
      <FeaturedCarousel items={featured} />

      <div className="mx-auto max-w-7xl px-4 space-y-14 pb-20 -mt-2">
        <ContinueWatching />

        {topAnime.data.length > 0 && (
          <ContentRow title="Top Anime Charts" href="/anime">
            {topAnime.data.map((anime) => (
              <ContentCard
                key={anime.mal_id}
                title={anime.title_english || anime.title}
                poster={
                  anime.images.webp?.large_image_url ||
                  anime.images.jpg.large_image_url
                }
                score={anime.score}
                year={anime.year}
                genres={anime.genres?.map((g) => g.name)}
                href={`/watch/mal/${anime.mal_id}/1/sub`}
              />
            ))}
          </ContentRow>
        )}

        {recentAnime.data.length > 0 && (
          <ContentRow title="Recently Updated Anime" href="/anime">
            {recentAnime.data.map((anime) => (
              <ContentCard
                key={anime.id}
                title={anime.title}
                poster={anime.poster}
                score={anime.score}
                year={anime.year}
                genres={anime.terms_by_type?.genre}
                href={`/anime/${anime.id}`}
                hasSub={!!anime.is_sub}
                hasDub={!!anime.is_dub}
              />
            ))}
          </ContentRow>
        )}

        <HomeReadingRows />

        <ContentRow title="Trending Movies" href="/movies">
          {movieItems.slice(0, 18).map((movie) => (
            <ContentCard
              key={movie.id}
              title={movie.title}
              poster={movie.poster}
              score={movie.rating}
              year={movie.year}
              type="Movie"
              href={`/movie/${movie.id}`}
            />
          ))}
        </ContentRow>

        <ContentRow title="Popular TV Shows" href="/tv">
          {tvItems.slice(0, 18).map((show) => (
            <ContentCard
              key={show.id}
              title={show.title}
              poster={show.poster}
              score={show.rating}
              year={show.year}
              type="TV"
              href={`/tv-show/${show.id}`}
            />
          ))}
        </ContentRow>
      </div>
    </div>
  );
}
