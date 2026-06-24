import { NextRequest } from "next/server";

const MANGADEX_API = "https://api.mangadex.org";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const upstream = `${MANGADEX_API}/${path.join("/")}`;
  const url = new URL(upstream);
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.append(k, v));

  try {
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "AnimeApp/1.0" },
    });
    const data = await res.arrayBuffer();
    return new Response(data, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch {
    return Response.json({ error: "MangaDex fetch failed" }, { status: 502 });
  }
}
