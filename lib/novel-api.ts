import { cached } from "@/lib/cache";

// ── AniList GraphQL helpers ──────────────────────────────────────────

const ANILIST_URL = "https://graphql.anilist.co";

interface AniListNovel {
  id: number;
  title: { english: string | null; romaji: string | null };
  description: string | null;
  coverImage: { large: string } | null;
  status: string | null;
  chapters: number | null;
  genres: string[];
  averageScore: number | null;
}

export interface NormalizedNovel {
  id: string;
  title: string;
  titleAlt?: string | null;
  image: string | null;
  score: number | null;
  chapters: number | null;
  status: string | null;
  description: string | null;
  genres: string[];
  source: "anilist" | "novelbin" | "novelfire";
}

async function anilistQuery<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`AniList error: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message || "AniList query failed");
  return json.data;
}

function normalizeAniList(media: AniListNovel): NormalizedNovel {
  return {
    id: String(media.id),
    title: media.title.english || media.title.romaji || "Unknown",
    titleAlt: media.title.romaji && media.title.english && media.title.romaji !== media.title.english
      ? media.title.romaji
      : null,
    image: media.coverImage?.large || null,
    score: media.averageScore ? media.averageScore / 10 : null,
    chapters: media.chapters,
    status: media.status,
    description: media.description
      ? media.description.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")
      : null,
    genres: media.genres || [],
    source: "anilist",
  };
}

const MEDIA_FIELDS = `
  id
  title { english romaji }
  description
  coverImage { large }
  status
  chapters
  genres
  averageScore
`;

export async function searchNovels(query: string): Promise<NormalizedNovel[]> {
  return cached(`anilist-search:${query}`, async () => {
    const data = await anilistQuery<{
      Page: { media: AniListNovel[] };
    }>(
      `query ($search: String) {
        Page(page: 1, perPage: 20) {
          media(search: $search, type: MANGA, format: NOVEL, sort: SEARCH_MATCH) {
            ${MEDIA_FIELDS}
          }
        }
      }`,
      { search: query }
    );
    return (data.Page.media || []).map(normalizeAniList);
  });
}

export async function getPopularNovels(): Promise<NormalizedNovel[]> {
  return cached("anilist-popular", async () => {
    const data = await anilistQuery<{
      Page: { media: AniListNovel[] };
    }>(
      `query {
        Page(page: 1, perPage: 20) {
          media(type: MANGA, format: NOVEL, sort: TRENDING_DESC) {
            ${MEDIA_FIELDS}
          }
        }
      }`
    );
    return (data.Page.media || []).map(normalizeAniList);
  });
}

export async function getPopularNovelsPaginated(page: number): Promise<{ novels: NormalizedNovel[]; hasNext: boolean }> {
  const perPage = 30;
  const data = await anilistQuery<{
    Page: { media: AniListNovel[]; pageInfo: { hasNextPage: boolean } };
  }>(
    `query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { hasNextPage }
        media(type: MANGA, format: NOVEL, sort: POPULARITY_DESC) {
          ${MEDIA_FIELDS}
        }
      }
    }`,
    { page, perPage }
  );
  return {
    novels: (data.Page.media || []).map(normalizeAniList),
    hasNext: data.Page.pageInfo.hasNextPage,
  };
}

export async function getNovelInfo(id: string): Promise<NormalizedNovel | null> {
  return cached(`anilist-info:${id}`, async () => {
    const data = await anilistQuery<{
      Media: AniListNovel | null;
    }>(
      `query ($id: Int) {
        Media(id: $id, type: MANGA, format: NOVEL) {
          ${MEDIA_FIELDS}
        }
      }`,
      { id: Number(id) }
    );
    return data.Media ? normalizeAniList(data.Media) : null;
  });
}

// ── NovelBin helpers (proxy through /api/novels) ─────────────────────

export interface NovelBinResult {
  id: string;
  title: string;
  image?: string;
}

export interface NovelBinInfo {
  id: string;
  title: string;
  description?: string;
  image?: string;
  author?: string;
  status?: string;
  genres: string[];
}

export interface NovelBinChapter {
  id: string;
  title: string;
  url: string;
}

export interface ChapterContent {
  title: string;
  content: string;
  prevChapter: string | null;
  nextChapter: string | null;
}

export function toNovelBinSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function searchNovelBin(query: string): Promise<NovelBinResult[]> {
  return cached(`novelbin-search:${query}`, async () => {
    const res = await fetch(`/api/novels?action=search&q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  });
}

export async function getNovelBinInfo(slug: string): Promise<NovelBinInfo | null> {
  return cached(`novelbin-info:${slug}`, async () => {
    const res = await fetch(`/api/novels?action=info&id=${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.error ? null : data;
  });
}

export async function getNovelBinChapters(slug: string): Promise<NovelBinChapter[]> {
  return cached(`novelbin-chapters:${slug}`, async () => {
    const res = await fetch(`/api/novels?action=chapters&id=${encodeURIComponent(slug)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  });
}

export async function readNovelBinChapter(chapterId: string): Promise<ChapterContent> {
  const res = await fetch(`/api/novels?action=read&id=${encodeURIComponent(chapterId)}`);
  if (!res.ok) throw new Error("Failed to load chapter");
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// ── Merged search ────────────────────────────────────────────────────

export async function searchAllSources(
  query: string
): Promise<NormalizedNovel[]> {
  const [anilistResults, novelBinResults] = await Promise.allSettled([
    searchNovels(query),
    searchNovelBin(query),
  ]);

  const results: NormalizedNovel[] = [];

  if (anilistResults.status === "fulfilled") {
    results.push(...anilistResults.value);
  }

  if (novelBinResults.status === "fulfilled") {
    const nbResults = novelBinResults.value;
    // Add NovelBin results that don't overlap with AniList
    const anilistTitles = new Set(
      results.map((r) => r.title.toLowerCase().replace(/[^a-z0-9]/g, ""))
    );
    for (const nb of nbResults) {
      const normalized = nb.title.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!anilistTitles.has(normalized)) {
        results.push({
          id: `novelbin/${nb.id}`,
          title: nb.title,
          image: nb.image || null,
          score: null,
          chapters: null,
          status: null,
          description: null,
          genres: [],
          source: "novelfire",
        });
      }
    }
  }

  return results;
}

// ── Find NovelBin match from AniList title ───────────────────────────

function bestMatch(results: NovelBinResult[], query: string): NovelBinResult | null {
  if (results.length === 0) return null;
  const qNorm = query.toLowerCase().replace(/[^a-z0-9]/g, "");

  return (
    results.find((r) => r.title.toLowerCase().replace(/[^a-z0-9]/g, "") === qNorm) ||
    results.find((r) => {
      const rNorm = r.title.toLowerCase().replace(/[^a-z0-9]/g, "");
      return rNorm.includes(qNorm) || qNorm.includes(rNorm);
    }) ||
    null
  );
}

export async function findNovelBinMatch(
  title: string,
  titleAlt?: string | null
): Promise<NovelBinResult | null> {
  const results = await searchNovelBin(title);
  const match = bestMatch(results, title);
  if (match) return match;

  if (titleAlt) {
    const altResults = await searchNovelBin(titleAlt);
    const altMatch = bestMatch(altResults, titleAlt);
    if (altMatch) return altMatch;
  }

  return results[0] || null;
}
