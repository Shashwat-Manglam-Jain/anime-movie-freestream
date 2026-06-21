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
