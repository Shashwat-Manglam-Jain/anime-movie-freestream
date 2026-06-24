export type ContentType = "anime" | "movie" | "tv" | "manga" | "novel" | "comic";

export interface WatchlistItem {
  id: string;
  type: ContentType;
  title: string;
  poster: string;
  addedAt: number;
}

export interface ContinueWatchingItem {
  id: string;
  type: ContentType;
  title: string;
  poster: string;
  watchUrl: string;
  episodeInfo?: string;
  lastWatchedAt: number;
}

const WATCHLIST_KEY = "anistream-watchlist";
const CONTINUE_KEY = "anistream-continue";
const PROVIDERS_KEY = "anistream-providers";

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addToWatchlist(item: WatchlistItem) {
  const list = getWatchlist().filter((i) => i.id !== item.id);
  list.unshift(item);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
}

export function removeFromWatchlist(id: string) {
  const list = getWatchlist().filter((i) => i.id !== id);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
}

export function isInWatchlist(id: string): boolean {
  return getWatchlist().some((i) => i.id === id);
}

export function getContinueWatching(): ContinueWatchingItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CONTINUE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function updateContinueWatching(item: ContinueWatchingItem) {
  const list = getContinueWatching().filter((i) => i.id !== item.id);
  list.unshift(item);
  if (list.length > 50) list.length = 50;
  localStorage.setItem(CONTINUE_KEY, JSON.stringify(list));
}

export function removeContinueWatching(id: string) {
  const list = getContinueWatching().filter((i) => i.id !== id);
  localStorage.setItem(CONTINUE_KEY, JSON.stringify(list));
}

export function getProviderPrefs(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PROVIDERS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function setProviderPrefs(prefs: Record<string, boolean>) {
  localStorage.setItem(PROVIDERS_KEY, JSON.stringify(prefs));
}

const SERVER_KEY = "anistream-preferred-server";

export function getPreferredServer(type: "anime" | "movie" | "tv"): string | null {
  if (typeof window === "undefined") return null;
  try {
    const prefs = JSON.parse(localStorage.getItem(SERVER_KEY) || "{}");
    return prefs[type] || null;
  } catch {
    return null;
  }
}

export function setPreferredServer(type: "anime" | "movie" | "tv", providerId: string) {
  try {
    const prefs = JSON.parse(localStorage.getItem(SERVER_KEY) || "{}");
    prefs[type] = providerId;
    localStorage.setItem(SERVER_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}
