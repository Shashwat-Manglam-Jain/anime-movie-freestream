import Link from "next/link";
import Image from "next/image";
import type { AnimeRecommendation } from "@/lib/jikan";

interface SimilarAnimeProps {
  recommendations: AnimeRecommendation[];
}

export function SimilarAnime({ recommendations }: SimilarAnimeProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-3 pt-4 border-t border-white/5">
      <h3 className="text-lg font-bold">Similar Anime</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {recommendations.map((anime) => (
          <Link
            key={anime.mal_id}
            href={`/watch/mal/${anime.mal_id}/1/sub`}
            className="shrink-0 group w-[120px]"
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden ring-1 ring-white/5 group-hover:ring-violet-500/40 transition-all">
              <Image
                src={anime.images.webp?.large_image_url || anime.images.jpg.large_image_url}
                alt={anime.title}
                fill
                sizes="120px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/90 text-white">
                  <svg className="h-3.5 w-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="mt-1.5 text-xs font-medium text-zinc-300 line-clamp-2 group-hover:text-violet-300 transition-colors">
              {anime.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
