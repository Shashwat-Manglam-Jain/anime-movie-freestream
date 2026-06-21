import Image from "next/image";
import { getSeries } from "@/lib/anikoto";
import { Badge } from "@/components/ui/badge";
import { EpisodeList } from "@/components/episode-list";
import { WatchlistButton } from "@/components/watchlist-button";

export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await getSeries(Number(id));
  const { anime, episodes } = data;

  return (
    <div>
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        {anime.background_image ? (
          <Image
            src={anime.background_image}
            alt=""
            fill
            className="object-cover"
            preload
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-violet-950 to-fuchsia-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/70 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16">
        <div className="flex flex-col md:flex-row gap-6 -mt-36 relative z-10">
          <div className="shrink-0">
            <div className="relative w-44 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image
                src={anime.poster}
                alt={anime.title}
                fill
                className="object-cover"
                sizes="176px"
                preload
              />
            </div>
          </div>

          <div className="flex-1 space-y-4 pt-2">
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                {anime.title}
              </h1>
              {anime.alternative && anime.alternative !== anime.title && (
                <p className="text-sm text-zinc-500 mt-1">
                  {anime.alternative}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {anime.score && Number(anime.score) > 0 && (
                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                  ★ {anime.score}
                </Badge>
              )}
              <Badge variant="outline" className="border-white/10">
                {anime.status}
              </Badge>
              {anime.year > 0 && (
                <Badge variant="outline" className="border-white/10">
                  {anime.year}
                </Badge>
              )}
              {anime.rating && (
                <Badge variant="outline" className="border-white/10">
                  {anime.rating}
                </Badge>
              )}
              {anime.duration && (
                <Badge variant="outline" className="border-white/10">
                  {anime.duration} min
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {anime.is_sub && (
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  SUB ({anime.is_sub} eps)
                </Badge>
              )}
              {anime.is_dub && (
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                  DUB ({anime.is_dub} eps)
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {anime.terms_by_type?.genre?.map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="bg-white/5 text-zinc-300 text-xs"
                >
                  {genre}
                </Badge>
              ))}
            </div>

            {anime.terms_by_type?.studios &&
              anime.terms_by_type.studios.length > 0 && (
                <p className="text-sm text-zinc-500">
                  <span className="text-zinc-400">Studio:</span>{" "}
                  {anime.terms_by_type.studios.join(", ")}
                </p>
              )}

            <WatchlistButton
              item={{
                id: `anime-${anime.id}`,
                type: "anime",
                title: anime.title,
                poster: anime.poster,
                addedAt: Date.now(),
              }}
            />

            {anime.description && (
              <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
                {anime.description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-12">
          <EpisodeList episodes={episodes} animeId={anime.id} />
        </div>
      </div>
    </div>
  );
}
