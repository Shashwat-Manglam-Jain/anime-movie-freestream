import { NextRequest, NextResponse } from "next/server";

interface NormalizedItem {
  id: string;
  title: string;
  poster: string;
  score: number | string | null;
  year: number | string | null;
  genres: string[];
  href: string;
  type?: string;
  hasSub?: boolean;
  hasDub?: boolean;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type") || "all";
  const page = Number(searchParams.get("page")) || 1;

  try {
    if (type === "all") {
      const res = await fetch(
        `https://anikotoapi.site/recent-anime?page=${page}&per_page=24`,
        { next: { revalidate: 300 } }
      );
      if (!res.ok) throw new Error("Anikoto fetch failed");
      const data = await res.json();
      const items: NormalizedItem[] = data.data.map(
        (a: {
          id: number;
          title: string;
          poster: string;
          score: string;
          year: number;
          terms_by_type?: { genre?: string[] };
          is_sub?: number;
          is_dub?: number;
        }) => ({
          id: String(a.id),
          title: a.title,
          poster: a.poster,
          score: a.score,
          year: a.year,
          genres: a.terms_by_type?.genre || [],
          href: `/anime/${a.id}`,
          hasSub: !!a.is_sub,
          hasDub: !!a.is_dub,
        })
      );
      return NextResponse.json({
        items,
        hasMore: page < data.pagination.total_pages,
      });
    }

    const jikanType =
      type === "series" ? "&type=tv" : type === "movie" ? "&type=movie" : "";
    const res = await fetch(
      `https://api.jikan.moe/v4/top/anime?page=${page}&limit=24&sfw=true${jikanType}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error("Jikan fetch failed");
    const data = await res.json();
    const items: NormalizedItem[] = data.data.map(
      (a: {
        mal_id: number;
        title: string;
        images: { jpg: { large_image_url: string } };
        score: number | null;
        year: number | null;
        type: string | null;
        genres: { name: string }[];
      }) => ({
        id: String(a.mal_id),
        title: a.title,
        poster: a.images.jpg.large_image_url,
        score: a.score,
        year: a.year,
        genres: a.genres.map((g) => g.name),
        href: `/watch/mal/${a.mal_id}/1/sub`,
        type: a.type || undefined,
      })
    );
    return NextResponse.json({
      items,
      hasMore: data.pagination.has_next_page,
    });
  } catch {
    return NextResponse.json({ items: [], hasMore: false }, { status: 500 });
  }
}
