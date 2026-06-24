import { JikanSearchResponse, JikanAnime } from "./types";

const BASE_URL = "https://api.jikan.moe/v4";

export async function searchAnime(
  query: string,
  page: number = 1,
  limit: number = 24
): Promise<JikanSearchResponse> {
  const res = await fetch(
    `${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&sfw=true`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to search anime");
  return res.json();
}

export async function getTopAnime(
  page: number = 1,
  limit: number = 24,
  type?: "tv" | "movie" | "ova" | "special"
): Promise<JikanSearchResponse> {
  const typeParam = type ? `&type=${type}` : "";
  const res = await fetch(
    `${BASE_URL}/top/anime?page=${page}&limit=${limit}&sfw=true${typeParam}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error("Failed to fetch top anime");
  return res.json();
}

export async function getAnimeById(malId: number): Promise<JikanAnime> {
  const res = await fetch(`${BASE_URL}/anime/${malId}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch anime details");
  const data = await res.json();
  return data.data;
}

export async function getAnimeEpisodeCount(malId: number): Promise<number> {
  const res = await fetch(`${BASE_URL}/anime/${malId}/episodes?page=1`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return 0;
  const data = await res.json();
  const lastPage = data.pagination?.last_visible_page || 1;
  if (lastPage <= 1) {
    return (data.data || []).length;
  }
  const lastRes = await fetch(`${BASE_URL}/anime/${malId}/episodes?page=${lastPage}`, {
    next: { revalidate: 3600 },
  });
  if (!lastRes.ok) return lastPage * 100;
  const lastData = await lastRes.json();
  return (lastPage - 1) * 100 + (lastData.data || []).length;
}

export interface AnimeRelation {
  relation: string;
  entry: { mal_id: number; type: string; name: string; url: string }[];
}

export async function getAnimeRelations(
  malId: number
): Promise<AnimeRelation[]> {
  const res = await fetch(`${BASE_URL}/anime/${malId}/relations`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export interface AnimeRecommendation {
  mal_id: number;
  title: string;
  images: { jpg: { large_image_url: string }; webp?: { large_image_url: string } };
  url: string;
}

export async function getAnimeRecommendations(
  malId: number
): Promise<AnimeRecommendation[]> {
  const res = await fetch(`${BASE_URL}/anime/${malId}/recommendations`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.data || []).slice(0, 12).map((r: any) => r.entry);
}

export interface SeasonEntry {
  mal_id: number;
  name: string;
  position: "prequel" | "current" | "sequel";
}

const SEASON_CHAIN_MAX_HOPS = 5;
const JIKAN_DELAY_MS = 300;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchRelationEntries(
  malId: number
): Promise<{ prequels: { mal_id: number; name: string }[]; sequels: { mal_id: number; name: string }[] }> {
  const res = await fetch(`${BASE_URL}/anime/${malId}/relations`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return { prequels: [], sequels: [] };
  const data = await res.json();
  const relations: AnimeRelation[] = data.data || [];

  const prequels: { mal_id: number; name: string }[] = [];
  const sequels: { mal_id: number; name: string }[] = [];

  for (const rel of relations) {
    if (rel.relation === "Prequel") {
      for (const e of rel.entry) {
        if (e.type === "anime") prequels.push({ mal_id: e.mal_id, name: e.name });
      }
    } else if (rel.relation === "Sequel") {
      for (const e of rel.entry) {
        if (e.type === "anime") sequels.push({ mal_id: e.mal_id, name: e.name });
      }
    }
  }

  return { prequels, sequels };
}

export async function getAnimeSeasonChain(malId: number): Promise<SeasonEntry[]> {
  const visited = new Set<number>();
  visited.add(malId);

  // Walk backward through prequels
  const prequelChain: { mal_id: number; name: string }[] = [];
  let currentId = malId;
  for (let hop = 0; hop < SEASON_CHAIN_MAX_HOPS; hop++) {
    await delay(JIKAN_DELAY_MS);
    const { prequels } = await fetchRelationEntries(currentId);
    const next = prequels.find((p) => !visited.has(p.mal_id));
    if (!next) break;
    visited.add(next.mal_id);
    prequelChain.unshift(next); // prepend so oldest is first
    currentId = next.mal_id;
  }

  // Walk forward through sequels
  const sequelChain: { mal_id: number; name: string }[] = [];
  currentId = malId;
  for (let hop = 0; hop < SEASON_CHAIN_MAX_HOPS; hop++) {
    await delay(JIKAN_DELAY_MS);
    const { sequels } = await fetchRelationEntries(currentId);
    const next = sequels.find((s) => !visited.has(s.mal_id));
    if (!next) break;
    visited.add(next.mal_id);
    sequelChain.push(next);
    currentId = next.mal_id;
  }

  // We need the name of the current anime for the chain
  let currentName = "";
  try {
    const res = await fetch(`${BASE_URL}/anime/${malId}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      currentName = data.data?.title || "";
    }
  } catch {}

  const chain: SeasonEntry[] = [
    ...prequelChain.map((e) => ({ mal_id: e.mal_id, name: e.name, position: "prequel" as const })),
    { mal_id: malId, name: currentName, position: "current" as const },
    ...sequelChain.map((e) => ({ mal_id: e.mal_id, name: e.name, position: "sequel" as const })),
  ];

  // Only return the chain if there is more than just the current entry
  return chain;
}
