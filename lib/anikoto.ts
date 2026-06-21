import { AnikotoRecentResponse, AnikotoSeriesResponse } from "./types";

const BASE_URL = "https://anikotoapi.site";

export async function getRecentAnime(
  page: number = 1,
  perPage: number = 20
): Promise<AnikotoRecentResponse> {
  const res = await fetch(
    `${BASE_URL}/recent-anime?page=${page}&per_page=${perPage}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error("Failed to fetch recent anime");
  return res.json();
}

export async function getSeries(id: number): Promise<AnikotoSeriesResponse> {
  const res = await fetch(`${BASE_URL}/series/${id}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Failed to fetch series");
  return res.json();
}
