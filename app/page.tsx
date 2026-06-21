import { getRecentAnime } from "@/lib/anikoto";
import { getTopAnime } from "@/lib/jikan";
import { TOP_MOVIES, TOP_TV_SHOWS } from "@/lib/curated";
import { FeaturedCarousel, type FeaturedItem } from "@/components/featured-carousel";
import { ContentCard } from "@/components/content-card";
import { ContentRow } from "@/components/content-row";
import { ContinueWatching } from "@/components/continue-watching";

const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";

export default async function HomePage() {
  let recentAnime;
  try {
    recentAnime = await getRecentAnime(1, 12);
  } catch {
    recentAnime = { data: [] };
  }

  let topAnime;
  try {
    topAnime = await getTopAnime(1, 12);
  } catch {
    topAnime = { data: [] };
  }

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

  const recentMovies = [...TOP_MOVIES]
    .sort((a, b) => b.year - a.year)
    .slice(0, 2);
  for (const m of recentMovies) {
    const posterPath = m.poster.split("/w500/")[1];
    featured.push({
      title: m.title,
      year: m.year,
      rating: m.rating,
      genre: m.genre,
      poster: posterPath ? `${IMG_ORIGINAL}/${posterPath}` : m.poster,
      href: `/movie/${m.tmdbId}`,
      type: "movie",
    });
  }

  const recentTV = [...TOP_TV_SHOWS]
    .sort((a, b) => b.year - a.year)
    .slice(0, 2);
  for (const s of recentTV) {
    const posterPath = s.poster.split("/w500/")[1];
    featured.push({
      title: s.title,
      year: s.year,
      rating: s.rating,
      genre: s.genre,
      poster: posterPath ? `${IMG_ORIGINAL}/${posterPath}` : s.poster,
      href: `/tv-show/${s.tmdbId}`,
      type: "tv",
    });
  }

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

        <ContentRow title="Must Watch Movies" href="/movies">
          {TOP_MOVIES.slice(0, 12).map((movie) => (
            <ContentCard
              key={movie.tmdbId}
              title={movie.title}
              poster={movie.poster}
              score={movie.rating}
              year={movie.year}
              genres={movie.genre.split(", ")}
              type="Movie"
              href={`/movie/${movie.tmdbId}`}
            />
          ))}
        </ContentRow>

        <ContentRow title="Popular TV Shows" href="/tv">
          {TOP_TV_SHOWS.slice(0, 12).map((show) => (
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
        </ContentRow>
      </div>
    </div>
  );
}
