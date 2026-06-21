import Link from "next/link";
import { getRecentAnime } from "@/lib/anikoto";
import { getTopAnime } from "@/lib/jikan";
import { AnimeInfiniteGrid } from "@/components/anime-infinite-grid";

type AnimeFilter = "all" | "top" | "series" | "movie";

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

export default async function AnimePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type: typeParam } = await searchParams;
  const filter: AnimeFilter =
    typeParam === "top" || typeParam === "series" || typeParam === "movie"
      ? typeParam
      : "all";

  const filters: { label: string; value: AnimeFilter }[] = [
    { label: "All", value: "all" },
    { label: "Top Rated", value: "top" },
    { label: "TV Series", value: "series" },
    { label: "Movies", value: "movie" },
  ];

  let initialItems: GridItem[] = [];
  let initialHasMore = false;

  if (filter === "all") {
    const data = await getRecentAnime(1, 24);
    initialItems = data.data.map((a) => ({
      id: String(a.id),
      title: a.title,
      poster: a.poster,
      score: a.score,
      year: a.year,
      genres: a.terms_by_type?.genre || [],
      href: `/anime/${a.id}`,
      hasSub: !!a.is_sub,
      hasDub: !!a.is_dub,
    }));
    initialHasMore = 1 < data.pagination.total_pages;
  } else {
    const jikanType =
      filter === "series" ? "tv" : filter === "movie" ? "movie" : undefined;
    const data = await getTopAnime(1, 24, jikanType);
    initialItems = data.data.map((a) => ({
      id: String(a.mal_id),
      title: a.title,
      poster: a.images.jpg.large_image_url,
      score: a.score,
      year: a.year,
      genres: a.genres.map((g) => g.name),
      href: `/watch/mal/${a.mal_id}/1/sub`,
      type: a.type || undefined,
    }));
    initialHasMore = data.pagination.has_next_page;
  }

  const headings: Record<AnimeFilter, { title: string; desc: string }> = {
    all: { title: "Anime", desc: "Browse recently updated anime series and movies" },
    top: { title: "Top Rated Anime", desc: "Highest rated anime of all time" },
    series: { title: "Anime TV Series", desc: "Top rated anime TV series" },
    movie: { title: "Anime Movies", desc: "Top rated anime movies" },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {headings[filter].title}
        </h1>
        <p className="mt-1 text-zinc-500">{headings[filter].desc}</p>
      </div>

      <div className="flex gap-1 rounded-lg bg-white/5 p-1 w-fit mb-6 overflow-x-auto">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={`/anime?type=${f.value}`}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
              filter === f.value
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <AnimeInfiniteGrid
        initialItems={initialItems}
        initialHasMore={initialHasMore}
        filterType={filter}
      />
    </div>
  );
}
