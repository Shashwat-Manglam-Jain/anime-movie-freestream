"use client";

import Link from "next/link";
import { PosterImage } from "@/components/poster-image";
import { HorizontalScroll } from "@/components/horizontal-scroll";

interface SimilarItem {
  title: string;
  year: number;
  tmdbId: number;
  poster: string;
  rating: string;
  seasons?: number;
}

interface SimilarMoviesProps {
  movies: SimilarItem[];
  currentTmdbId: number;
  title?: string;
  hrefPrefix?: string;
}

export function SimilarMovies({
  movies,
  currentTmdbId,
  title = "Similar",
  hrefPrefix,
}: SimilarMoviesProps) {
  const similar = movies.filter((m) => m.tmdbId !== currentTmdbId);
  if (similar.length === 0) return null;

  const prefix =
    hrefPrefix || (similar[0]?.seasons != null ? "/tv-show" : "/movie");

  return (
    <div className="space-y-3 pt-4 border-t border-border">
      <h3 className="text-lg font-bold">{title}</h3>
      <HorizontalScroll>
        {similar.slice(0, 12).map((movie) => (
          <Link
            key={movie.tmdbId}
            href={`${prefix}/${movie.tmdbId}`}
            className="shrink-0 group w-[120px]"
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-white/5 group-hover:ring-violet-500/40 transition-all">
              <PosterImage
                src={movie.poster}
                alt={movie.title}
                fill
                sizes="120px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/90 text-white">
                  <svg
                    className="h-3.5 w-3.5 ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              {movie.rating && (
                <div className="absolute top-1 right-1 flex items-center gap-0.5 rounded bg-black/60 px-1 py-0.5 text-[10px]">
                  <span className="text-yellow-400">★</span>
                  <span className="text-white">{movie.rating}</span>
                </div>
              )}
            </div>
            <div className="mt-1.5 space-y-0.5">
              <p className="text-xs font-medium text-foreground/70 line-clamp-2 group-hover:text-violet-300 transition-colors">
                {movie.title}
              </p>
              <p className="text-[10px] text-muted-foreground/70">{movie.year}</p>
            </div>
          </Link>
        ))}
      </HorizontalScroll>
    </div>
  );
}
