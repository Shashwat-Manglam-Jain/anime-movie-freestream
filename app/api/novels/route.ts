// Strategy: NovelFire (primary) → FreeWebNovel (fallback) → NovelBin (fallback)

import { NextRequest } from "next/server";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

function decodeEntities(text: string): string {
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
  text = text.replace(/&#(\d+);/g, (_m: string, code: string) => String.fromCharCode(Number(code)));
  text = text.replace(/&#x([0-9a-fA-F]+);/g, (_m: string, hex: string) => String.fromCharCode(parseInt(hex, 16)));
  return text;
}

// ═══════════════════════════════════════════════════════════════════
// Strategy 1: NovelFire (primary)
// ═══════════════════════════════════════════════════════════════════

const NF_BASE = "https://novelfire.net";

async function nfFetchHTML(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const text = await res.text();
    if (text.includes("Just a moment") && text.includes("challenge")) {
      throw new Error("Cloudflare challenge");
    }
    return text;
  } finally {
    clearTimeout(timer);
  }
}

async function nfSearchNovels(query: string) {
  const html = await nfFetchHTML(
    `${NF_BASE}/search?keyword=${encodeURIComponent(query)}`
  );
  const results: { id: string; title: string; image?: string }[] = [];

  const matches = html.matchAll(
    /<a[^>]*title="([^"]+)"[^>]*href="\/book\/([^"]+)"/g
  );
  for (const m of matches) {
    const title = m[1].trim();
    const slug = m[2];
    if (results.some((r) => r.id === slug)) continue;
    results.push({
      id: slug,
      title,
      image: `${NF_BASE}/server-1/${slug}.jpg`,
    });
  }

  if (results.length === 0) {
    const altMatches = html.matchAll(
      /href="\/book\/([^"]+)"[^>]*title="([^"]+)"/g
    );
    for (const m of altMatches) {
      const slug = m[1];
      const title = m[2].trim();
      if (results.some((r) => r.id === slug)) continue;
      results.push({
        id: slug,
        title,
        image: `${NF_BASE}/server-1/${slug}.jpg`,
      });
    }
  }

  return results;
}

async function nfGetNovelInfo(slug: string) {
  const html = await nfFetchHTML(`${NF_BASE}/book/${slug}`);

  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const descMatch = html.match(/class="summary"[^>]*>([\s\S]*?)<\/div>/);
  const imgMatch = html.match(
    /<img[^>]*(?:data-src|src)="([^"]+)"[^>]*alt="[^"]*"[^>]*>/
  );
  const statusMatch = html.match(
    /<strong[^>]*>([^<]+)<\/strong>\s*<small>Status<\/small>/i
  );
  const authorMatch = html.match(
    /Author:<\/span>\s*<a[^>]*class="property-item"[^>]*>(?:<span[^>]*>)?([^<]+)/i
  );
  const genreMatches = [
    ...html.matchAll(/class="property-item"[^>]*>([^<]+)<\/a>[\s\S]*?<\/li>/g),
  ];
  const genres = genreMatches
    .map((m) => m[1].trim())
    .filter((g) => g && !g.includes("Author") && !g.includes("http"));

  const coverImg = imgMatch?.[1]?.includes("logo")
    ? `${NF_BASE}/server-1/${slug}.jpg`
    : imgMatch?.[1] || `${NF_BASE}/server-1/${slug}.jpg`;

  return {
    id: slug,
    title: titleMatch ? stripHtml(titleMatch[1]) : slug,
    description: descMatch
      ? stripHtml(descMatch[1]).replace(/^Summary\s*/i, "").trim()
      : undefined,
    image: coverImg,
    author: authorMatch ? authorMatch[1].trim() : undefined,
    status: statusMatch ? statusMatch[1].trim() : undefined,
    genres,
    source: "novelfire" as const,
  };
}

async function nfGetChapters(slug: string) {
  const chapters: { id: string; title: string; url: string; source: string }[] = [];
  let page = 1;
  const maxPages = 20;

  while (page <= maxPages) {
    const url = page === 1
      ? `${NF_BASE}/book/${slug}/chapters`
      : `${NF_BASE}/book/${slug}/chapters?page=${page}`;
    const html = await nfFetchHTML(url);

    const matches = html.matchAll(
      /<a[^>]*href="\/book\/([^"]+\/chapter-[^"]+)"[^>]*>([\s\S]*?)<\/a>/g
    );
    let foundAny = false;
    for (const m of matches) {
      foundAny = true;
      const chId = m[1];
      const rawHtml = m[2];
      const strongMatch = rawHtml.match(/<strong[^>]*>([^<]+)<\/strong>/);
      let title = strongMatch
        ? strongMatch[1].trim()
        : stripHtml(rawHtml.replace(/<span[^>]*>[\s\S]*?<\/span>/g, "").replace(/<time[^>]*>[\s\S]*?<\/time>/g, ""));
      if (!title) {
        const numMatch = chId.match(/chapter-(\d+)/);
        title = numMatch ? `Chapter ${numMatch[1]}` : "Chapter";
      }
      if (chapters.some((c) => c.id === chId)) continue;
      chapters.push({ id: chId, title, url: chId, source: "novelfire" });
    }

    const nextPageExists = html.includes(`page=${page + 1}`);
    if (!foundAny || !nextPageExists) break;
    page++;
  }

  chapters.sort((a, b) => {
    const numA = parseInt(a.id.match(/chapter-(\d+)/)?.[1] || "0", 10);
    const numB = parseInt(b.id.match(/chapter-(\d+)/)?.[1] || "0", 10);
    return numA - numB;
  });

  return chapters;
}

async function nfReadChapter(chapterId: string) {
  const html = await nfFetchHTML(`${NF_BASE}/book/${chapterId}`);

  const titleMatch = html.match(/class="chapter-title"[^>]*>([^<]+)/);

  let rawContent: string | null = null;
  const contentIdx = html.indexOf('id="content"');
  if (contentIdx !== -1) {
    const startIdx = html.indexOf(">", contentIdx);
    if (startIdx !== -1) {
      let depth = 1;
      let i = startIdx + 1;
      while (i < html.length && depth > 0) {
        if (html[i] === "<") {
          if (html.substring(i, i + 4) === "<div") depth++;
          else if (html.substring(i, i + 6) === "</div>") {
            depth--;
            if (depth === 0) { rawContent = html.substring(startIdx + 1, i); break; }
          }
        }
        i++;
      }
    }
  }
  if (!rawContent) {
    return { title: "Chapter", content: "Content not available.", source: "novelfire" };
  }

  let text = rawContent;
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<div[^>]*>/gi, "");
  text = text.replace(/<\/div>/gi, "");

  text = text.replace(/(?:please\s+)?(?:visit|check\s+out|go\s+to)\s+novelfire[.\w]*[^.\n]*[.!]?/gi, "");
  text = text.replace(/this\s+(?:chapter|novel)\s+(?:is\s+)?(?:uploaded|updated|available)\s+(?:by|at|on)\s+[\w.]+[.!]?/gi, "");
  text = text.replace(/source\s*:\s*[\w.]+/gi, "");

  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<[^>]+>/g, "");
  text = decodeEntities(text);
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.replace(/[ \t]+$/gm, "");
  text = text.replace(/^Restore scroll position\s*/i, "");
  text = text.trim();

  function extractNavSlug(cls: string): string | null {
    const pattern = new RegExp(`class="[^"]*${cls}[^"]*"[^>]*href="([^"]+)"`, "i");
    const m = html.match(pattern);
    if (!m || m[1] === "javascript:;" || m[1] === "#") return null;
    const pathMatch = m[1].match(/\/book\/(.+)/);
    return pathMatch ? pathMatch[1] : null;
  }

  const prevChapter = extractNavSlug("prevchap");
  const nextChapter = extractNavSlug("nextchap");

  const chTitle = titleMatch?.[1]?.trim()
    || html.match(/<title>([^<]+)/)?.[1]?.replace(/ - Novel Fire.*/, "").trim()
    || "Chapter";

  return {
    title: chTitle,
    content: text,
    prevChapter,
    nextChapter,
    source: "novelfire",
  };
}

// ═══════════════════════════════════════════════════════════════════
// Strategy 2: FreeWebNovel (fallback)
// ═══════════════════════════════════════════════════════════════════

const FWN_BASE = "https://freewebnovel.com";

async function fwnFetchHTML(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const text = await res.text();
    if (text.includes("Just a moment") && text.includes("challenge")) {
      throw new Error("Cloudflare challenge");
    }
    return text;
  } finally {
    clearTimeout(timer);
  }
}

async function fwnSearchNovels(query: string) {
  const html = await fwnFetchHTML(
    `${FWN_BASE}/search/?searchkey=${encodeURIComponent(query)}`
  );
  const results: { id: string; title: string; image?: string }[] = [];

  const altRegex = /<h3 class="tit"><a[^>]*href="\/novel\/([^"]+)"[^>]*title="([^"]+)"/gi;
  let match;
  while ((match = altRegex.exec(html)) !== null) {
    const slug = match[1];
    const title = match[2].trim();
    if (results.some((r) => r.id === slug)) continue;
    results.push({ id: slug, title });
  }

  if (results.length === 0) {
    const slug = query.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    try {
      const pageHtml = await fwnFetchHTML(`${FWN_BASE}/novel/${slug}`);
      const titleMatch = pageHtml.match(/<h1[^>]*>([^<]+)<\/h1>/);
      if (titleMatch) {
        results.push({ id: slug, title: stripHtml(titleMatch[1]) });
      }
    } catch {}
  }

  return results;
}

async function fwnGetNovelInfo(slug: string) {
  const html = await fwnFetchHTML(`${FWN_BASE}/novel/${slug}`);

  const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  const descMatch = html.match(/class="inner"[^>]*>([\s\S]*?)<\/div>/)
    || html.match(/class="content"[^>]*>([\s\S]*?)<\/div>/);
  const imgMatch = html.match(/<img[^>]*src="([^"]+)"[^>]*class="[^"]*"/);
  const authorMatch = html.match(/Author[^<]*<\/span>\s*<a[^>]*>([^<]+)/i)
    || html.match(/Author[^<]*<\/label>\s*<a[^>]*>([^<]+)/i);
  const statusMatch = html.match(/Status[^<]*<\/span>\s*<a[^>]*>([^<]+)/i)
    || html.match(/Status[^<]*<\/label>\s*<a[^>]*>([^<]+)/i);

  return {
    id: slug,
    title: titleMatch ? stripHtml(titleMatch[1]) : slug,
    description: descMatch ? stripHtml(descMatch[1]) : undefined,
    image: imgMatch ? (imgMatch[1].startsWith("http") ? imgMatch[1] : `${FWN_BASE}${imgMatch[1]}`) : undefined,
    author: authorMatch ? authorMatch[1].trim() : undefined,
    status: statusMatch ? statusMatch[1].trim() : undefined,
    genres: [] as string[],
    source: "freewebnovel" as const,
  };
}

async function fwnGetChapters(slug: string) {
  const html = await fwnFetchHTML(`${FWN_BASE}/novel/${slug}`);
  const chapters: { id: string; title: string; url: string; source: string }[] = [];

  const chapterRegex = /<a[^>]*href="\/novel\/[^"]*\/chapter-(\d+)"[^>]*title="([^"]*)"[^>]*class="con"[^>]*>[^<]*<\/a>/gi;
  let match;
  while ((match = chapterRegex.exec(html)) !== null) {
    const num = match[1];
    const title = match[2].trim() || `Chapter ${num}`;
    const chId = `${slug}/chapter-${num}`;
    if (chapters.some((c) => c.id === chId)) continue;
    chapters.push({ id: chId, title, url: chId, source: "freewebnovel" });
  }

  if (chapters.length === 0) {
    const altRegex = /href="\/novel\/([^"]*chapter-\d+[^"]*)"[^>]*(?:title="([^"]*)"|>([^<]*))/gi;
    while ((match = altRegex.exec(html)) !== null) {
      const path = match[1];
      const title = (match[2] || match[3] || "").trim() || path.split("/").pop()?.replace(/-/g, " ") || "Chapter";
      const chId = path;
      if (chapters.some((c) => c.id === chId)) continue;
      chapters.push({ id: chId, title, url: chId, source: "freewebnovel" });
    }
  }

  const seen = new Set<string>();
  const unique = chapters.filter((ch) => {
    if (seen.has(ch.id)) return false;
    seen.add(ch.id);
    return true;
  });
  unique.sort((a, b) => {
    const numA = parseInt(a.id.match(/chapter-(\d+)/)?.[1] || "0", 10);
    const numB = parseInt(b.id.match(/chapter-(\d+)/)?.[1] || "0", 10);
    return numA - numB;
  });

  return unique;
}

async function fwnReadChapter(chapterId: string) {
  const html = await fwnFetchHTML(`${FWN_BASE}/novel/${chapterId}`);

  const h4Match = html.match(/<h4>([^<]+)<\/h4>/);

  let rawContent: string | null = null;
  const txtIdx = html.indexOf('class="txt');
  if (txtIdx !== -1) {
    const startIdx = html.indexOf(">", txtIdx);
    if (startIdx !== -1) {
      let depth = 1;
      let i = startIdx + 1;
      while (i < html.length && depth > 0) {
        if (html[i] === "<") {
          if (html.substring(i, i + 4) === "<div") depth++;
          else if (html.substring(i, i + 6) === "</div>") {
            depth--;
            if (depth === 0) { rawContent = html.substring(startIdx + 1, i); break; }
          }
        }
        i++;
      }
    }
  }
  if (!rawContent) {
    return { title: "Chapter", content: "Content not available.", source: "freewebnovel" };
  }

  let text = rawContent;
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<div[^>]*>/gi, "");
  text = text.replace(/<\/div>/gi, "");
  text = text.replace(/<h4>[^<]*<\/h4>/gi, "");

  text = text.replace(/read\s+(?:the\s+)?latest\s+(?:chapter|chapters)\s+at\s+[\w.]+[.!]?/gi, "");
  text = text.replace(/(?:please\s+)?(?:visit|check\s+out|go\s+to)\s+freewebnovel[.\w]*[^.\n]*[.!]?/gi, "");
  text = text.replace(/this\s+(?:chapter|novel)\s+(?:is\s+)?(?:uploaded|updated|available)\s+(?:by|at|on)\s+[\w.]+[.!]?/gi, "");
  text = text.replace(/source\s*:\s*[\w.]+/gi, "");

  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<[^>]+>/g, "");
  text = decodeEntities(text);
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.replace(/[ \t]+$/gm, "");
  text = text.trim();

  function extractNavSlug(pattern: RegExp): string | null {
    const m = html.match(pattern);
    if (!m) return null;
    const url = m[1];
    const pathMatch = url.match(/\/novel\/(.+)/);
    return pathMatch ? pathMatch[1] : null;
  }

  const prevChapter = extractNavSlug(/href="([^"]+)"[^>]*id="prev_url"/i)
    || extractNavSlug(/id="prev_url"[^>]*href="([^"]+)"/i);
  const nextChapter = extractNavSlug(/href="([^"]+)"[^>]*id="next_url"/i)
    || extractNavSlug(/id="next_url"[^>]*href="([^"]+)"/i);

  const chTitle = h4Match?.[1]?.trim()
    || html.match(/<title>([^<]+)/)?.[1]?.replace(/ - FreeWebNovel.*/, "").trim()
    || "Chapter";

  return {
    title: chTitle,
    content: text,
    prevChapter,
    nextChapter,
    source: "freewebnovel",
  };
}

// ═══════════════════════════════════════════════════════════════════
// Strategy 3: NovelBin (fallback)
// ═══════════════════════════════════════════════════════════════════

const NOVELBIN_BASES = ["https://novelbin.me", "https://novelbin.com", "https://novelbin.net"];
let activeNBBase: string | null = null;

async function nbFetchHTML(url: string, xhr = false): Promise<string> {
  const headers: Record<string, string> = { "User-Agent": UA };
  if (xhr) headers["X-Requested-With"] = "XMLHttpRequest";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { headers, redirect: "follow", signal: controller.signal });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const text = await res.text();
    if (text.includes("window.location.replace") || text.includes("Just a moment")) {
      throw new Error("JS challenge detected");
    }
    return text;
  } finally {
    clearTimeout(timer);
  }
}

async function nbFetchWithFallback(path: string, xhr = false): Promise<string> {
  if (activeNBBase) {
    try {
      return await nbFetchHTML(`${activeNBBase}${path}`, xhr);
    } catch {}
  }
  for (const base of NOVELBIN_BASES) {
    try {
      const html = await nbFetchHTML(`${base}${path}`, xhr);
      activeNBBase = base;
      return html;
    } catch {}
  }
  throw new Error("All NovelBin mirrors failed");
}

async function nbSearchNovels(query: string) {
  const html = await nbFetchWithFallback(
    `/ajax/search-novel?keyword=${encodeURIComponent(query)}`,
    true
  );
  const results: { id: string; title: string; image?: string }[] = [];

  const matches = html.matchAll(
    /href="(?:https:\/\/novelbin\.\w+)?\/novel-book\/([^"]+)"[^>]*class="list-group-item"[^>]*title="([^"]+)"/g
  );
  for (const m of matches) {
    if (m[2].toLowerCase().includes("see more")) continue;
    if (results.some((r) => r.id === m[1])) continue;
    results.push({ id: m[1], title: m[2].trim() });
  }

  if (results.length === 0) {
    const alt = html.matchAll(
      /href="(?:https:\/\/novelbin\.\w+)?\/novel-book\/([^"]+)"[^>]*title="([^"]+)"/g
    );
    for (const m of alt) {
      if (m[2].toLowerCase().includes("see more")) continue;
      if (results.some((r) => r.id === m[1])) continue;
      results.push({ id: m[1], title: m[2].trim() });
    }
  }

  for (const r of results) {
    r.image = `https://images.novelbin.me/novel/${r.id}.jpg`;
  }

  return results;
}

async function nbGetNovelInfo(slug: string) {
  const html = await nbFetchWithFallback(`/novel-book/${slug}`);

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
    source: "novelbin" as const,
  };
}

async function nbGetNovelId(slug: string): Promise<string> {
  const html = await nbFetchWithFallback(`/novel-book/${slug}`);
  const idMatch = html.match(/data-novel-id="([^"]+)"/)
    || html.match(/novelId\s*[:=]\s*["']?(\d+)["']?/)
    || html.match(/id="rating"\s+data-novel-id="([^"]+)"/)
    || html.match(/\/ajax\/chapter-archive\?novelId=([^"&]+)/);
  return idMatch ? idMatch[1] : slug;
}

async function nbGetChapters(slug: string) {
  const novelId = await nbGetNovelId(slug);
  const html = await nbFetchWithFallback(
    `/ajax/chapter-archive?novelId=${novelId}`,
    true
  );
  const chapters: { id: string; title: string; url: string; source: string }[] = [];

  const matches = html.matchAll(
    /href="(?:https?:\/\/novelbin\.\w+)?\/(?:novel-book|b)\/([^"]+\/chapter[^"]*)"[^>]*(?:title="([^"]*)"|>([^<]*))/g
  );
  for (const m of matches) {
    const chId = m[1];
    const chTitle = (m[2] || m[3] || "").trim() || chId.split("/").pop()?.replace(/-/g, " ") || "Chapter";
    if (chTitle.toLowerCase().includes("see more")) continue;
    if (chapters.some((c) => c.id === chId)) continue;
    chapters.push({ id: chId, title: chTitle, url: chId, source: "novelbin" });
  }

  return chapters;
}

async function nbReadChapter(chapterId: string) {
  const html = await nbFetchWithFallback(`/novel-book/${chapterId}`);

  const titleMatch = html.match(
    /<a[^>]*class="[^"]*chr-title[^"]*"[^>]*>([^<]+)/
  ) || html.match(/<h2[^>]*>([^<]*chapter[^<]*)<\/h2>/i);

  const contentMatch = html.match(
    /id="chr-content"[^>]*>([\s\S]*?)<\/div>/
  );
  if (!contentMatch) {
    return { title: "Chapter", content: "Content not available.", source: "novelbin" };
  }

  let text = contentMatch[1];
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");

  text = text.replace(/visit\s+novelbin[.\w]*\s+for\s+(?:the\s+)?(?:latest\s+)?updates?[.!]?/gi, "");
  text = text.replace(/read\s+(?:the\s+)?latest\s+chapters\s+at\s+[\w.]+[.!]?/gi, "");
  text = text.replace(/(?:please\s+)?(?:visit|check\s+out|go\s+to)\s+novelbin[.\w]*[^.\n]*[.!]?/gi, "");
  text = text.replace(/this\s+(?:chapter|novel)\s+(?:is\s+)?(?:uploaded|updated|available)\s+(?:by|at|on)\s+[\w.]+[.!]?/gi, "");
  text = text.replace(/(?:search|find)\s+["'\w]*novelbin["'\w]*\s+[^.\n]*[.!]?/gi, "");
  text = text.replace(/this\s+(?:chapter|content)\s+is\s+(?:taken|made)\s+from\s+[\w.]+[.!]?/gi, "");
  text = text.replace(/source\s*:\s*[\w.]+/gi, "");

  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<[^>]+>/g, "");
  text = decodeEntities(text);
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.replace(/[ \t]+$/gm, "");
  text = text.trim();

  function extractChapterSlug(pattern: RegExp): string | null {
    const m = html.match(pattern);
    if (!m) return null;
    const url = m[1];
    const comMatch = url.match(/novelbin\.com\/b\/([^"]+)/);
    if (comMatch) return comMatch[1];
    const meMatch = url.match(/novelbin\.\w+\/novel-book\/([^"]+)/);
    if (meMatch) return meMatch[1];
    const pathMatch = url.match(/\/(?:novel-book|b)\/([^"]+)/);
    if (pathMatch) return pathMatch[1];
    return url;
  }

  const prevChapter = extractChapterSlug(/class="[^"]*prev[^"]*"[^>]*href="([^"]+)"/i)
    || extractChapterSlug(/prev[^>]*href="([^"]*chapter[^"]*)"/i);
  const nextChapter = extractChapterSlug(/class="[^"]*next[^"]*"[^>]*href="([^"]+)"/i)
    || extractChapterSlug(/next[^>]*href="([^"]*chapter[^"]*)"/i);

  const chTitle = titleMatch?.[1]?.trim()
    || html.match(/class="[^"]*chr-text[^"]*"[^>]*>([^<]+)/)?.[1]?.trim()
    || html.match(/<title>([^#<]+)/)?.[1]?.trim()
    || "Chapter";

  return {
    title: chTitle,
    content: text,
    prevChapter,
    nextChapter,
    source: "novelbin",
  };
}

// ═══════════════════════════════════════════════════════════════════
// Combined functions — try NovelFire first, then fallbacks
// ═══════════════════════════════════════════════════════════════════

async function searchNovels(query: string) {
  try {
    const results = await nfSearchNovels(query);
    if (results.length > 0) return results;
  } catch {}
  try {
    const results = await fwnSearchNovels(query);
    if (results.length > 0) return results;
  } catch {}
  try {
    const results = await nbSearchNovels(query);
    if (results.length > 0) return results;
  } catch {}
  return [];
}

async function getNovelInfo(slug: string) {
  try {
    return await nfGetNovelInfo(slug);
  } catch {}
  try {
    return await fwnGetNovelInfo(slug);
  } catch {}
  try {
    return await nbGetNovelInfo(slug);
  } catch {}
  return { id: slug, title: slug, source: "none" };
}

async function getChapters(slug: string) {
  try {
    const chapters = await nfGetChapters(slug);
    if (chapters.length > 0) return chapters;
  } catch {}
  try {
    const chapters = await fwnGetChapters(slug);
    if (chapters.length > 0) return chapters;
  } catch {}
  try {
    const chapters = await nbGetChapters(slug);
    if (chapters.length > 0) return chapters;
  } catch {}
  return [];
}

async function readChapter(chapterId: string) {
  try {
    return await nfReadChapter(chapterId);
  } catch {}
  try {
    return await fwnReadChapter(chapterId);
  } catch {}
  try {
    return await nbReadChapter(chapterId);
  } catch {}
  return { title: "Chapter", content: "Content not available from any source.", source: "none" };
}

// ═══════════════════════════════════════════════════════════════════
// API Route Handler
// ═══════════════════════════════════════════════════════════════════

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
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed";
    return Response.json({ error: message }, { status: 502 });
  }
}
