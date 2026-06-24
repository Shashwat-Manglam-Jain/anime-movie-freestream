"use client";

import { useRef, useState, useEffect, useCallback, type ReactNode } from "react";

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

export function HorizontalScroll({ children, className = "" }: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const check = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    check();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, [check]);

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: "smooth" });
  };

  return (
    <div className="relative group/scroll">
      {canLeft && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-0 bottom-0 z-10 w-9 flex items-center justify-center bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent opacity-0 group-hover/scroll:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      <div
        ref={scrollRef}
        className={`flex gap-3 overflow-x-auto pb-2 scrollbar-hide ${className}`}
      >
        {children}
      </div>
      {canRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-0 bottom-0 z-10 w-9 flex items-center justify-center bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent opacity-0 group-hover/scroll:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
