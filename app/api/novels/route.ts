import { NextRequest } from "next/server";

const BASE = "https://novelbin.me";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchHTML(url: string, xhr = false): Promise<string> {
  const headers: Record<string, string> = { "User-Agent": UA };
  if (xhr) headers["X-Requested-With"] = "XMLHttpRequest";
  const res = await fetch(url, { headers, redirect: "follow" });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.text();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

async function searchNovels(query: string) {
  const html = await fetchHTML(
    `${BASE}/ajax/search-novel?keyword=${encodeURIComponent(query)}`,
    true
  );
  const results: { id: string; title: string; image?: string }[] = [];

  const matches = html.matchAll(
    /href="(?:https:\/\/novelbin\.me)?\/novel-book\/([^"]+)"[^>]*class="list-group-item"[^>]*title="([^"]+)"/g
  );
  for (const m of matches) {
    if (m[2].toLowerCase().includes("see more")) continue;
    results.push({ id: m[1], title: m[2].trim() });
  }

  if (results.length === 0) {
    const alt = html.matchAll(
      /href="(?:https:\/\/novelbin\.me)?\/novel-book\/([^"]+)"[^>]*title="([^"]+)"/g
    );
    for (const m of alt) {
      if (m[2].toLowerCase().includes("see more")) continue;
      results.push({ id: m[1], title: m[2].trim() });
    }
  }

  // Fallback: if AJAX search returned nothing, try fetching the novel page
  // directly using a slug constructed from the query
  if (results.length === 0) {
    const slug = query
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    try {
      const pageHtml = await fetchHTML(`${BASE}/novel-book/${slug}`);
      // Check if the page is a valid novel page (has a title element)
      const titleMatch = pageHtml.match(
        /<h3[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/h3>/
      );
      if (titleMatch) {
        const title = stripHtml(titleMatch[1]);
        results.push({ id: slug, title });
      }
    } catch {
      // Page doesn't exist or fetch failed — that's fine, return empty results
    }
  }

  // Fetch images for results
  for (const r of results) {
    r.image = `https://images.novelbin.me/novel/${r.id}.jpg`;
  }

  return results;
}

async function getNovelInfo(slug: string) {
  const html = await fetchHTML(`${BASE}/novel-book/${slug}`);

  const titleMatch = html.match(
    /<h3[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/h3>/
  );
  const descMatch = html.match(
    /class="desc-text"[^>]*>([\s\S]*?)<\/div>/
  );
  const imgMatch = html.match(
    /(?:data-src|src)="(https:\/\/images\.novelbin[^"]+)"/
  );
  const authorMatch = html.match(
    /Author[^<]*<\/span>\s*<a[^>]*>([^<]+)/i
  );
  const statusMatch = html.match(
    /Status[^<]*<\/span>\s*<a[^>]*>([^<]+)/i
  );
  const genreMatches = [
    ...html.matchAll(/class="[^"]*genre[^"]*"[^>]*>([^<]+)</g),
  ];

  return {
    id: slug,
    title: titleMatch ? stripHtml(titleMatch[1]) : slug,
    description: descMatch ? stripHtml(descMatch[1]) : undefined,
    image: imgMatch ? imgMatch[1] : undefined,
    author: authorMatch ? authorMatch[1].trim() : undefined,
    status: statusMatch ? statusMatch[1].trim() : undefined,
    genres: genreMatches.map((m) => m[1].trim()).filter(Boolean),
  };
}

async function getNovelId(slug: string): Promise<string> {
  const html = await fetchHTML(`${BASE}/novel-book/${slug}`);
  const idMatch = html.match(/data-novel-id="([^"]+)"/)
    || html.match(/novelId\s*[:=]\s*["']?(\d+)["']?/)
    || html.match(/id="rating"\s+data-novel-id="([^"]+)"/)
    || html.match(/\/ajax\/chapter-archive\?novelId=([^"&]+)/);
  return idMatch ? idMatch[1] : slug;
}

async function getChapters(slug: string) {
  const novelId = await getNovelId(slug);
  const html = await fetchHTML(
    `${BASE}/ajax/chapter-archive?novelId=${novelId}`,
    true
  );
  const chapters: { id: string; title: string; url: string }[] = [];

  const matches = html.matchAll(
    /href="(?:https?:\/\/novelbin\.\w+)?\/(?:novel-book|b)\/([^"]+\/chapter[^"]*)"[^>]*(?:title="([^"]*)"|>([^<]*))/g
  );
  for (const m of matches) {
    const chId = m[1];
    const chTitle = (m[2] || m[3] || "").trim() || chId.split("/").pop()?.replace(/-/g, " ") || "Chapter";
    if (chTitle.toLowerCase().includes("see more")) continue;
    chapters.push({ id: chId, title: chTitle, url: chId });
  }

  if (chapters.length === 0) {
    const altMatches = html.matchAll(
      /href="([^"]*chapter[^"]*)"[^>]*>([^<]*)</g
    );
    for (const m of altMatches) {
      const url = m[1];
      const title = m[2].trim();
      if (!title || title.toLowerCase().includes("see more")) continue;
      const pathMatch = url.match(/\/(?:novel-book|b)\/(.+)/);
      const chId = pathMatch ? pathMatch[1] : url;
      chapters.push({ id: chId, title, url: chId });
    }
  }

  return chapters;
}

async function readChapter(chapterId: string) {
  const html = await fetchHTML(`${BASE}/novel-book/${chapterId}`);

  const titleMatch = html.match(
    /<a[^>]*class="[^"]*chr-title[^"]*"[^>]*>([^<]+)/
  ) || html.match(/<h2[^>]*>([^<]*chapter[^<]*)<\/h2>/i);

  const contentMatch = html.match(
    /id="chr-content"[^>]*>([\s\S]*?)<\/div>/
  );
  if (!contentMatch) {
    return { title: "Chapter", content: "Content not available." };
  }

  let text = contentMatch[1];

  // Remove any embedded <script> tags and their content
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");

  // Remove ads / promotional text patterns
  text = text.replace(/visit\s+novelbin[.\w]*\s+for\s+(?:the\s+)?(?:latest\s+)?updates?[.!]?/gi, "");
  text = text.replace(/read\s+(?:the\s+)?latest\s+chapters\s+at\s+[\w.]+[.!]?/gi, "");
  text = text.replace(/(?:please\s+)?(?:visit|check\s+out|go\s+to)\s+novelbin[.\w]*[^.\n]*[.!]?/gi, "");
  text = text.replace(/this\s+(?:chapter|novel)\s+(?:is\s+)?(?:uploaded|updated|available)\s+(?:by|at|on)\s+[\w.]+[.!]?/gi, "");
  text = text.replace(/(?:search|find)\s+["'\w]*novelbin["'\w]*\s+[^.\n]*[.!]?/gi, "");

  // Convert HTML to plain text
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#x27;/g, "'");
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&#8220;/g, "“");
  text = text.replace(/&#8221;/g, "”");
  text = text.replace(/&#8216;/g, "‘");
  text = text.replace(/&#8217;/g, "’");
  text = text.replace(/&#8211;/g, "–");
  text = text.replace(/&#8212;/g, "—");
  text = text.replace(/&#8230;/g, "…");
  text = text.replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(Number(code)));
  text = text.replace(/&#x([0-9a-fA-F]+);/g, (_m, hex) => String.fromCharCode(parseInt(hex, 16)));

  // Clean up whitespace
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.replace(/[ \t]+$/gm, "");
  text = text.trim();

  // Prev/next links can be on novelbin.me/novel-book/ or novelbin.com/b/
  function extractChapterSlug(pattern: RegExp): string | null {
    const m = html.match(pattern);
    if (!m) return null;
    const url = m[1];
    // novelbin.com/b/slug/chapter-N → slug/chapter-N
    const comMatch = url.match(/novelbin\.com\/b\/([^"]+)/);
    if (comMatch) return comMatch[1];
    // novelbin.me/novel-book/slug/chapter-N → slug/chapter-N
    const meMatch = url.match(/novelbin\.me\/novel-book\/([^"]+)/);
    if (meMatch) return meMatch[1];
    return url;
  }

  const prevChapter = extractChapterSlug(/class="[^"]*prev[^"]*"[^>]*href="([^"]+)"/i)
    || extractChapterSlug(/prev[^>]*href="([^"]*chapter[^"]*)"/i);
  const nextChapter = extractChapterSlug(/class="[^"]*next[^"]*"[^>]*href="([^"]+)"/i)
    || extractChapterSlug(/next[^>]*href="([^"]*chapter[^"]*)"/i);

  // Extract chapter title from breadcrumb or heading
  const chTitle = titleMatch?.[1]?.trim()
    || html.match(/class="[^"]*chr-text[^"]*"[^>]*>([^<]+)/)?.[1]?.trim()
    || html.match(/<title>([^#<]+)/)?.[1]?.trim()
    || "Chapter";

  // Remove duplicate chapter header at the start of content (e.g. "Chapter 1" or "Chapter 1: Title")
  const chapterHeaderPattern = /^(chapter\s+\d+[^\n]*)\n+/i;
  const headerMatch = text.match(chapterHeaderPattern);
  if (headerMatch) {
    const headerText = headerMatch[1].trim();
    // Remove if it closely matches the title or is a generic "Chapter N" header
    if (
      chTitle.toLowerCase().includes(headerText.toLowerCase()) ||
      headerText.toLowerCase().includes(chTitle.toLowerCase()) ||
      /^chapter\s+\d+$/i.test(headerText)
    ) {
      text = text.replace(chapterHeaderPattern, "").trim();
    }
  }

  return {
    title: chTitle,
    content: text,
    prevChapter,
    nextChapter,
  };
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const action = sp.get("action");

  try {
    switch (action) {
      case "search": {
        const q = sp.get("q");
        if (!q) return Response.json({ error: "Missing q" }, { status: 400 });
        return Response.json(await searchNovels(q));
      }

      case "info": {
        const id = sp.get("id");
        if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
        return Response.json(await getNovelInfo(id));
      }

      case "chapters": {
        const id = sp.get("id");
        if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
        return Response.json(await getChapters(id));
      }

      case "read": {
        const id = sp.get("id");
        if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
        return Response.json(await readChapter(id));
      }

      default:
        return Response.json(
          { error: "Invalid action", actions: ["search", "info", "chapters", "read"] },
          { status: 400 }
        );
    }
  } catch (e: any) {
    return Response.json({ error: e.message || "Failed" }, { status: 502 });
  }
}
