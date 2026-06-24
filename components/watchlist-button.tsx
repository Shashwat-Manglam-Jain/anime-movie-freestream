"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  type WatchlistItem,
} from "@/lib/watchlist";

interface WatchlistButtonProps {
  item: WatchlistItem;
}

export function WatchlistButton({ item }: WatchlistButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isInWatchlist(item.id));
  }, [item.id]);

  function toggle() {
    if (saved) {
      removeFromWatchlist(item.id);
      setSaved(false);
    } else {
      addToWatchlist(item);
      setSaved(true);
    }
  }

  return (
    <Button
      variant={saved ? "default" : "outline"}
      size="sm"
      onClick={toggle}
      className={
        saved
          ? "bg-violet-600 hover:bg-violet-500 text-white"
          : "border-border hover:bg-black/5 dark:hover:bg-white/5"
      }
    >
      {saved ? (
        <>
          <svg className="h-4 w-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          In Watchlist
        </>
      ) : (
        <>
          <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Add to Watchlist
        </>
      )}
    </Button>
  );
}
