import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PosterImage } from "@/components/poster-image";

interface ContentCardProps {
  title: string;
  poster: string;
  score?: number | string | null;
  year?: string | number | null;
  type?: string;
  genres?: string[];
  href: string;
  hasSub?: boolean;
  hasDub?: boolean;
}

export function ContentCard({
  title,
  poster,
  score,
  year,
  type,
  genres,
  href,
  hasSub,
  hasDub,
}: ContentCardProps) {
  const scoreNum = Number(score);

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/5 transition-all duration-300 group-hover:ring-violet-500/40 group-hover:shadow-lg group-hover:shadow-violet-500/10">
        <PosterImage
          src={poster}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        <div className="absolute top-2 left-2 flex gap-1">
          {hasSub && (
            <span className="rounded bg-blue-500/90 px-1.5 py-0.5 text-[10px] font-bold text-white">
              SUB
            </span>
          )}
          {hasDub && (
            <span className="rounded bg-purple-500/90 px-1.5 py-0.5 text-[10px] font-bold text-white">
              DUB
            </span>
          )}
          {type && !hasSub && !hasDub && (
            <span className="rounded bg-white/10 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">
              {type}
            </span>
          )}
        </div>

        {scoreNum > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-sm px-1.5 py-0.5 text-xs font-semibold">
            <span className="text-yellow-400">★</span>
            <span className="text-white">{scoreNum.toFixed(1)}</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-semibold leading-tight line-clamp-2 text-white drop-shadow-lg">
            {title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-300">
            {year && <span>{typeof year === "string" ? year.slice(0, 4) : year}</span>}
            {genres && genres.length > 0 && (
              <>
                <span className="text-zinc-600">·</span>
                <span className="line-clamp-1">{genres.slice(0, 2).join(", ")}</span>
              </>
            )}
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/90 backdrop-blur-sm text-white shadow-xl">
            <svg className="h-5 w-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
