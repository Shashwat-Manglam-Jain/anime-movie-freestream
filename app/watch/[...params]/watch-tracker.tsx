"use client";

import { useEffect } from "react";
import { updateContinueWatching } from "@/lib/watchlist";

interface WatchTrackerProps {
  id: string;
  title: string;
  poster: string;
  watchUrl: string;
  episodeInfo?: string;
}

export function WatchTracker({
  id,
  title,
  poster,
  watchUrl,
  episodeInfo,
}: WatchTrackerProps) {
  useEffect(() => {
    updateContinueWatching({
      id,
      type: "anime",
      title,
      poster,
      watchUrl,
      episodeInfo,
      lastWatchedAt: Date.now(),
    });
  }, [id, title, poster, watchUrl, episodeInfo]);

  return null;
}
