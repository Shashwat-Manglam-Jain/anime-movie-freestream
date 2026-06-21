"use client";

import Link from "next/link";
import { PosterImage } from "@/components/poster-image";
import type { MovieCollection as MovieCollectionType } from "@/lib/curated";

interface MovieCollectionProps {
  collection: MovieCollectionType;
  currentTmdbId: number;
}

export function MovieCollection({ collection, currentTmdbId }: MovieCollectionProps) {
  return (
    <div className="space-y-3 pt-4 border-t border-white/5">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <svg className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
        </svg>
        {collection.name} Collection
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {collection.movies.map((movie) => {
          const isCurrent = movie.tmdbId === currentTmdbId;
          return (
            <Link
              key={movie.tmdbId}
              href={`/movie/${movie.tmdbId}`}
              className={`shrink-0 group w-[120px] ${isCurrent ? "pointer-events-none" : ""}`}
            >
              <div className={`relative aspect-[2/3] rounded-lg overflow-hidden transition-all ${
                isCurrent
                  ? "ring-2 ring-violet-500 shadow-lg shadow-violet-500/20"
                  : "ring-1 ring-white/5 group-hover:ring-violet-500/40"
              }`}>
                <PosterImage
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  sizes="120px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {isCurrent && (
                  <div className="absolute inset-0 bg-violet-500/10 flex items-end justify-center pb-2">
                    <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      NOW PLAYING
                    </span>
                  </div>
                )}
                {!isCurrent && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/90 text-white">
                      <svg className="h-3.5 w-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-1.5 space-y-0.5">
                <p className={`text-xs font-medium line-clamp-2 transition-colors ${
                  isCurrent ? "text-violet-400" : "text-zinc-300 group-hover:text-violet-300"
                }`}>
                  {movie.title}
                </p>
                <p className="text-[10px] text-zinc-600">{movie.year}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
