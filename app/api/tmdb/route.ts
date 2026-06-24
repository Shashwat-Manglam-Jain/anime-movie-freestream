import { NextRequest } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

function getApiKey(): string | null {
  return process.env.TMDB_API_KEY || null;
}

async function fetchWithRetry(url: string, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok || i === retries) return res;
    } catch (e) {
      if (i === retries) throw e;
    }
  }
  throw new Error("fetch failed");
}

export async function GET(req: NextRequest) {
  const key = getApiKey();
  if (!key) {
    return Response.json(
      { error: "TMDB API key not configured", items: [], hasMore: false },
      { status: 200 }
    );
  }

  const sp = req.nextUrl.searchParams;
  const action = sp.get("action") || "popular";
  const type = sp.get("type") || "movie"; // "movie" or "tv"
  const page = sp.get("page") || "1";
  const query = sp.get("q") || "";

  try {
    if (action === "detail") {
      const id = sp.get("id");
      if (!id) return Response.json({ error: "Missing id" }, { status: 200 });
      const detailUrl = `${TMDB_BASE}/${type}/${id}?api_key=${key}&append_to_response=recommendations,similar,credits`;
      const res = await fetchWithRetry(detailUrl);
      if (!res.ok) return Response.json({ error: `TMDB ${res.status}` }, { status: 200 });
      const d = await res.json();
      const IMG_ORIG = "https://image.tmdb.org/t/p/original";
      return Response.json({
        id: d.id,
        title: type === "tv" ? (d.name || d.original_name) : (d.title || d.original_title),
        overview: d.overview || null,
        poster: d.poster_path ? `${IMG}${d.poster_path}` : null,
        backdrop: d.backdrop_path ? `${IMG_ORIG}${d.backdrop_path}` : null,
        rating: d.vote_average ? d.vote_average.toFixed(1) : null,
        year: type === "tv"
          ? (d.first_air_date ? new Date(d.first_air_date).getFullYear() : null)
          : (d.release_date ? new Date(d.release_date).getFullYear() : null),
        genres: (d.genres || []).map((g: any) => g.name),
        runtime: type === "tv" ? (d.episode_run_time?.[0] || d.last_episode_to_air?.runtime || null) : (d.runtime || null),
        status: d.status || null,
        seasons: type === "tv" ? (d.number_of_seasons || null) : null,
        episodes: type === "tv" ? (d.number_of_episodes || null) : null,
        seasonDetails: type === "tv" ? (d.seasons || []).filter((s: any) => s.season_number > 0).map((s: any) => ({
          seasonNumber: s.season_number,
          episodeCount: s.episode_count,
          name: s.name,
        })) : null,
        similar: ((type === "tv" ? d.recommendations?.results : d.recommendations?.results) || []).slice(0, 12).map((r: any) => ({
          id: r.id,
          title: type === "tv" ? (r.name || r.original_name) : (r.title || r.original_title),
          poster: r.poster_path ? `${IMG}${r.poster_path}` : null,
          rating: r.vote_average ? r.vote_average.toFixed(1) : null,
          year: type === "tv"
            ? (r.first_air_date ? new Date(r.first_air_date).getFullYear() : null)
            : (r.release_date ? new Date(r.release_date).getFullYear() : null),
        })).filter((r: any) => r.poster),
      });
    }

    let url: string;
    if (action === "search" && query) {
      url = `${TMDB_BASE}/search/${type}?api_key=${key}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
    } else if (action === "trending") {
      url = `${TMDB_BASE}/trending/${type}/week?api_key=${key}&page=${page}`;
    } else if (action === "top_rated") {
      url = `${TMDB_BASE}/${type}/top_rated?api_key=${key}&page=${page}`;
    } else {
      url = `${TMDB_BASE}/${type}/popular?api_key=${key}&page=${page}`;
    }

    const res = await fetchWithRetry(url);
    if (!res.ok) {
      const text = await res.text();
      return Response.json(
        {
          error: `TMDB error: ${res.status} - ${text}`,
          items: [],
          hasMore: false,
        },
        { status: 200 }
      );
    }

    const data = await res.json();
    const results = data.results || [];

    const items = results.map((item: any) => ({
      id: item.id,
      title:
        type === "tv"
          ? item.name || item.original_name || "Untitled"
          : item.title || item.original_title || "Untitled",
      year:
        type === "tv"
          ? item.first_air_date
            ? new Date(item.first_air_date).getFullYear()
            : null
          : item.release_date
            ? new Date(item.release_date).getFullYear()
            : null,
      rating: item.vote_average ? item.vote_average.toFixed(1) : null,
      poster: item.poster_path ? `${IMG}${item.poster_path}` : null,
      overview: item.overview || null,
      genreIds: item.genre_ids || [],
    }));

    return Response.json({
      items,
      page: data.page,
      totalPages: data.total_pages,
      hasMore: data.page < data.total_pages,
    });
  } catch (e: any) {
    return Response.json(
      { error: e.message || "TMDB fetch failed", items: [], hasMore: false },
      { status: 200 }
    );
  }
}
