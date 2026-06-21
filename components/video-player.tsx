"use client";

import { useState, useEffect } from "react";

interface VideoPlayerProps {
  src: string;
  onTryNext?: () => void;
  hasNextServer?: boolean;
}

export function VideoPlayer({ src, onTryNext, hasNextServer }: VideoPlayerProps) {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setShowHelp(false);
    const timer = setTimeout(() => setShowHelp(true), 12000);
    return () => clearTimeout(timer);
  }, [src]);

  return (
    <div className="space-y-3">
      {/* Player container */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black ring-1 ring-white/10 shadow-2xl shadow-black/50">
        <iframe
          key={src}
          src={src}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          referrerPolicy="origin"
        />
      </div>

      {/* Player toolbar */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Quality: use player&apos;s gear icon for 360p–4K
          </span>
        </div>

        <div className="flex items-center gap-2">
          {showHelp && hasNextServer && onTryNext && (
            <button
              onClick={() => { onTryNext(); setShowHelp(false); }}
              className="flex items-center gap-1.5 text-[11px] text-violet-400 hover:text-violet-300 transition-colors font-medium"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Switch Server
            </button>
          )}
          <button
            onClick={() => {
              const iframe = document.querySelector("iframe");
              if (iframe) {
                const currentSrc = iframe.src;
                iframe.src = "";
                requestAnimationFrame(() => { iframe.src = currentSrc; });
              }
            }}
            className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Reload player"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reload
          </button>
        </div>
      </div>

      {/* Trouble banner */}
      {showHelp && (
        <div className="rounded-xl bg-zinc-900/80 border border-white/5 px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-yellow-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span className="text-xs text-zinc-400">
              Stream not loading?
            </span>
          </div>
          <div className="flex gap-2">
            {hasNextServer && onTryNext && (
              <button
                onClick={() => { onTryNext(); setShowHelp(false); }}
                className="rounded-lg bg-violet-600 hover:bg-violet-500 px-4 py-1.5 text-xs font-medium text-white transition-colors"
              >
                Try Next Server
              </button>
            )}
            <button
              onClick={() => {
                const iframe = document.querySelector("iframe");
                if (iframe) {
                  const currentSrc = iframe.src;
                  iframe.src = "";
                  requestAnimationFrame(() => { iframe.src = currentSrc; });
                }
                setShowHelp(false);
              }}
              className="rounded-lg bg-white/5 hover:bg-white/10 px-4 py-1.5 text-xs font-medium text-zinc-300 transition-colors"
            >
              Reload
            </button>
          </div>
          <p className="text-[10px] text-zinc-600 w-full">
            If this server is down, switch to another one above. Quality options (360p–4K) are inside the player&apos;s built-in settings.
          </p>
        </div>
      )}
    </div>
  );
}
