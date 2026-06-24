import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "meo.comick.pictures",
  "comicknew.pictures",
  "comick.pictures",
  "comic.comick.pictures",
];

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.some((h) => parsed.hostname === h || parsed.hostname.endsWith("." + h))) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  try {
    const res = await fetch(url, {
      headers: { Referer: "https://comick.art" },
    });

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
