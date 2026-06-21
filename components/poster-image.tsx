"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

interface PosterImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

const TMDB_SIZES = ["w500", "w780", "w342", "original"];

function buildFallbacks(src: string): string[] {
  if (!src) return [];
  const match = src.match(
    /^https:\/\/image\.tmdb\.org\/t\/p\/(w\d+|original)(\/.*)/
  );
  if (!match) return [src];
  const [, currentSize, path] = match;
  return TMDB_SIZES.filter((s) => s !== currentSize).map(
    (s) => `https://image.tmdb.org/t/p/${s}${path}`
  );
}

export function PosterImage({
  src,
  alt,
  fill,
  sizes,
  className,
  priority,
}: PosterImageProps) {
  const fallbacks = useMemo(() => buildFallbacks(src), [src]);
  const [fallbackIndex, setFallbackIndex] = useState(-1);
  const [failed, setFailed] = useState(false);

  const currentSrc =
    fallbackIndex === -1 ? src : fallbacks[fallbackIndex] ?? null;

  if (failed || !currentSrc) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-800/50">
        <svg
          className="h-10 w-10 text-zinc-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      onError={() => {
        const nextIndex = fallbackIndex + 1;
        if (nextIndex < fallbacks.length) {
          setFallbackIndex(nextIndex);
        } else {
          setFailed(true);
        }
      }}
      unoptimized
    />
  );
}
