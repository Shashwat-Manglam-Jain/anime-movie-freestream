"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PosterImage } from "@/components/poster-image";

export interface FeaturedItem {
  title: string;
  year: number;
  rating: string;
  genre: string;
  poster: string;
  href: string;
  type: "movie" | "tv" | "anime";
}

interface FeaturedCarouselProps {
  items: FeaturedItem[];
}

export function FeaturedCarousel({ items }: FeaturedCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [paused, next, current, items.length]);

  if (items.length === 0) return null;

  const item = items[current];

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0">
        <PosterImage
          key={item.poster}
          src={item.poster}
          alt=""
          fill
          className="object-cover object-top"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-black/40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 min-h-[380px] md:min-h-[420px] flex items-center">
        <div className="max-w-xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1 text-xs font-medium text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            {item.type === "tv" ? "TV Show" : item.type === "anime" ? "Anime" : "Movie"}
          </div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-white drop-shadow-xl">
            {item.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-md font-bold text-sm backdrop-blur-sm">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {item.rating}
            </span>
            <span className="text-white/60 text-sm font-medium">{item.year}</span>
            <span className="text-white/30">|</span>
            <span className="text-white/60 text-sm">{item.genre}</span>
          </div>

          <div className="flex gap-3 pt-1">
            <Link
              href={item.href}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-7 py-3.5 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-violet-500/30 hover:scale-[1.02]"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Now
            </Link>
            <Link
              href={item.href}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10 px-6 py-3.5 text-sm font-medium text-white transition-all"
            >
              Details
            </Link>
          </div>
        </div>
      </div>

      {items.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0">
          <div className="mx-auto max-w-7xl px-4 flex items-center justify-between">
            <div className="flex gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="relative h-1 rounded-full overflow-hidden transition-all"
                  style={{ width: i === current ? 36 : 14 }}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full" />
                  {i === current && (
                    <div
                      key={`p-${current}`}
                      className="absolute inset-0 bg-violet-400 rounded-full carousel-progress-bar"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-1.5">
              <button
                onClick={prev}
                className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
