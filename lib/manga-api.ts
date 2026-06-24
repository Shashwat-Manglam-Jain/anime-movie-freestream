import { cached } from "./cache";

const MANGADEX_API = "https://api.mangadex.org";
const COMICK_API = "https://comick.art/api";

export interface MangaItem {
  id: string;
  title: string;
  image?: string;
  status?: string;
  description?: string;
}

export interface MangaDetail {
  id: string;
  title: string;
  image?: string;
  cover?: string;
  description?: string;
  genres?: string[];
  status?: string;
  authors?: string[];
  releaseDate?: string | number;
  chapters: ChapterItem[];
}

export interface ChapterItem {
  id: string;
  title?: string;
  chapterNumber?: string | number;
  volumeNumber?: string | number;
  pages?: number;
  releaseDate?: string;
}

export interface ChapterPage {
  img: string;
  page: number;
}

// ── MangaDex ──

function mangadexCoverUrl(mangaId: string, fileName: string): string {
  return `https://mangadex.org/covers/${mangaId}/${fileName}`;
}

function extractCover(manga: any): string | undefined {
  const coverRel = manga.relationships?.find((r: any) => r.type === "cover_art");
  if (!coverRel?.attributes?.fileName) return undefined;
  return mangadexCoverUrl(manga.id, coverRel.attributes.fileName);
}

function extractTitle(attrs: any): string {
  const t = attrs.title || {};
  return t.en || Object.values(t)[0] as string || "Untitled";
}

function extractDesc(attrs: any): string | undefined {
  const d = attrs.description;
  if (!d) return undefined;
  if (typeof d === "string") return d;
  return d.en || Object.values(d)[0] as string || undefined;
}

function mapMangaDexStatus(s: string | undefined): string {
  switch (s) {
    case "ongoing": return "Ongoing";
    case "completed": return "Completed";
    case "hiatus": return "Hiatus";
    case "cancelled": return "Cancelled";
    default: return s || "Unknown";
  }
}

function mapMangaDexList(data: any[]): MangaItem[] {
  return data.map((m) => ({
    id: m.id,
    title: extractTitle(m.attributes),
    image: extractCover(m),
    status: mapMangaDexStatus(m.attributes.status),
    description: extractDesc(m.attributes),
  }));
}

const MDX_INCLUDES = "includes[]=cover_art&includes[]=author&includes[]=artist";
const MDX_CONTENT = "contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica";

export function searchMangaDex(query: string, page = 1, englishOnly = true): Promise<MangaItem[]> {
  const langParam = englishOnly ? "&availableTranslatedLanguage[]=en" : "";
  return cached(`mdx-search-${query}-${page}-${englishOnly}`, async () => {
    const limit = 20;
    const offset = (page - 1) * limit;
    const res = await fetch(
      `${MANGADEX_API}/manga?title=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&order[relevance]=desc&hasAvailableChapters=true&${MDX_INCLUDES}${langParam}`
    );
    if (!res.ok) throw new Error("MangaDex search failed");
    const data = await res.json();
    return mapMangaDexList(data.data || []);
  });
}

export function getMangaDexPopular(page = 1, englishOnly = true): Promise<MangaItem[]> {
  const langParam = englishOnly ? "&availableTranslatedLanguage[]=en" : "";
  return cached(`mdx-popular-${page}-${englishOnly}`, async () => {
    const limit = 20;
    const offset = (page - 1) * limit;
    const res = await fetch(
      `${MANGADEX_API}/manga?${MDX_INCLUDES}&order[followedCount]=desc&${MDX_CONTENT}&hasAvailableChapters=true&limit=${limit}&offset=${offset}${langParam}`
    );
    if (!res.ok) throw new Error("MangaDex popular fetch failed");
    const data = await res.json();
    return mapMangaDexList(data.data || []);
  });
}

export function getMangaDexLatest(page = 1, englishOnly = true): Promise<MangaItem[]> {
  const langParam = englishOnly ? "&availableTranslatedLanguage[]=en" : "";
  return cached(`mdx-latest-${page}-${englishOnly}`, async () => {
    const limit = 20;
    const offset = (page - 1) * limit;
    const res = await fetch(
      `${MANGADEX_API}/manga?${MDX_INCLUDES}&order[latestUploadedChapter]=desc&${MDX_CONTENT}&hasAvailableChapters=true&limit=${limit}&offset=${offset}${langParam}`
    );
    if (!res.ok) throw new Error("MangaDex latest fetch failed");
    const data = await res.json();
    return mapMangaDexList(data.data || []);
  }, 3 * 60 * 1000);
}

export function getMangaDexRecentlyAdded(page = 1, englishOnly = true): Promise<MangaItem[]> {
  const langParam = englishOnly ? "&availableTranslatedLanguage[]=en" : "";
  return cached(`mdx-recent-${page}-${englishOnly}`, async () => {
    const limit = 20;
    const offset = (page - 1) * limit;
    const res = await fetch(
      `${MANGADEX_API}/manga?${MDX_INCLUDES}&${MDX_CONTENT}&order[createdAt]=desc&hasAvailableChapters=true&limit=${limit}&offset=${offset}${langParam}`
    );
    if (!res.ok) throw new Error("MangaDex recently added fetch failed");
    const data = await res.json();
    return mapMangaDexList(data.data || []);
  }, 3 * 60 * 1000);
}

async function fetchMangaDexChapters(mangaId: string): Promise<ChapterItem[]> {
  const chapters: ChapterItem[] = [];
  let offset = 0;
  const limit = 96;

  while (true) {
    const res = await fetch(
      `${MANGADEX_API}/manga/${mangaId}/feed?offset=${offset}&limit=${limit}&order[volume]=desc&order[chapter]=desc&translatedLanguage[]=en`
    );
    if (!res.ok) break;
    const data = await res.json();
    const items = data.data || [];
    if (items.length === 0) break;

    for (const ch of items) {
      const a = ch.attributes;
      chapters.push({
        id: ch.id,
        title: a.title || undefined,
        chapterNumber: a.chapter,
        volumeNumber: a.volume,
        pages: a.pages,
        releaseDate: a.publishAt,
      });
    }

    if (items.length < limit) break;
    offset += limit;
    if (offset > 500) break;
  }

  return chapters;
}

export function getMangaDexInfo(mangaId: string): Promise<MangaDetail> {
  return cached(`mdx-info-${mangaId}`, () => _getMangaDexInfo(mangaId), 10 * 60 * 1000);
}

async function _getMangaDexInfo(mangaId: string): Promise<MangaDetail> {
  const [infoRes, chapters] = await Promise.all([
    fetch(`${MANGADEX_API}/manga/${mangaId}?${MDX_INCLUDES}`),
    fetchMangaDexChapters(mangaId),
  ]);

  if (!infoRes.ok) throw new Error("MangaDex info fetch failed");
  const info = await infoRes.json();
  const manga = info.data;
  const attrs = manga.attributes;

  const authors = manga.relationships
    ?.filter((r: any) => r.type === "author" || r.type === "artist")
    .map((r: any) => r.attributes?.name)
    .filter(Boolean) as string[];

  return {
    id: manga.id,
    title: extractTitle(attrs),
    image: extractCover(manga),
    cover: extractCover(manga),
    description: extractDesc(attrs),
    genres: attrs.tags?.map((t: any) => t.attributes?.name?.en).filter(Boolean) || [],
    status: mapMangaDexStatus(attrs.status),
    authors: [...new Set(authors)],
    releaseDate: attrs.year,
    chapters,
  };
}

export async function readMangaDexChapter(chapterId: string): Promise<ChapterPage[]> {
  const res = await fetch(`${MANGADEX_API}/at-home/server/${chapterId}`);
  if (!res.ok) throw new Error("MangaDex reader fetch failed");
  const data = await res.json();
  const baseUrl = data.baseUrl;
  const hash = data.chapter?.hash;
  const files = data.chapter?.data || [];

  return files.map((filename: string, i: number) => ({
    img: `${baseUrl}/data/${hash}/${filename}`,
    page: i,
  }));
}

// ── ComicK ──

function stripHtml(html: string | undefined | null): string | undefined {
  if (!html || typeof html !== "string") return undefined;
  return html.replace(/<[^>]*>/g, "").trim() || undefined;
}

function comickStatus(status: number | undefined): string {
  switch (status) {
    case 1: return "Ongoing";
    case 2: return "Completed";
    case 3: return "Cancelled";
    case 4: return "Hiatus";
    default: return "Unknown";
  }
}

function comickCoverUrl(key: string | undefined): string | undefined {
  if (!key) return undefined;
  const raw = key.startsWith("http") ? key : `https://meo.comick.pictures/${key}`;
  return `/api/img-proxy?url=${encodeURIComponent(raw)}`;
}

export async function getComicKBrowse(cursor?: string): Promise<{ items: MangaItem[]; nextCursor: string | null }> {
  const params = new URLSearchParams({ page: "1", limit: "30" });
  if (cursor) params.set("cursor", cursor);
  const res = await fetch(`${COMICK_API}/search?${params}`);
  if (!res.ok) throw new Error("ComicK browse failed");
  const raw = await res.json();
  const data = raw.data || [];
  const items: MangaItem[] = (Array.isArray(data) ? data : []).map((c: any) => ({
    id: c.slug || c.hid,
    title: c.title || c.slug || "Untitled",
    image: comickCoverUrl(c.default_thumbnail || c.md_covers?.[0]?.b2key),
    status: comickStatus(c.status),
    description: stripHtml(c.parsed_description || c.description),
  }));
  return { items, nextCursor: raw.next_cursor || null };
}

export function searchComicK(query: string): Promise<MangaItem[]> {
  return cached(`ck-search-${query}`, () => _searchComicK(query));
}

async function _searchComicK(query: string): Promise<MangaItem[]> {
  const res = await fetch(
    `${COMICK_API}/search?q=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("ComicK search failed");
  const raw = await res.json();
  const data = raw.data || raw;
  if (!Array.isArray(data)) return [];

  return data.map((c: any) => ({
    id: c.slug || c.hid,
    title: c.title || c.slug || "Untitled",
    image: comickCoverUrl(c.default_thumbnail || c.md_covers?.[0]?.b2key),
    status: comickStatus(c.status),
    description: stripHtml(c.parsed_description || c.description),
  }));
}

async function fetchComicKChapters(slug: string): Promise<ChapterItem[]> {
  const chapters: ChapterItem[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `${COMICK_API}/comics/${slug}/chapter-list?page=${page}`
    );
    if (!res.ok) break;
    const raw = await res.json();
    const items = raw.data || raw;
    if (!Array.isArray(items) || items.length === 0) break;

    for (const ch of items) {
      if (ch.lang && ch.lang !== "en") continue;
      chapters.push({
        id: `${slug}/${ch.hid}-chapter-${ch.chap}-${ch.lang || "en"}`,
        title: ch.title || undefined,
        chapterNumber: ch.chap,
        volumeNumber: ch.vol,
        releaseDate: ch.created_at,
      });
    }

    const pagination = raw.pagination;
    if (pagination && page >= pagination.last_page) break;
    if (!pagination && items.length < 50) break;
    page++;
    if (page > 30) break;
  }

  return chapters;
}

export function getComicKInfo(slug: string): Promise<MangaDetail> {
  return cached(`ck-info-${slug}`, () => _getComicKInfo(slug), 10 * 60 * 1000);
}

function slugToSearchQuery(slug: string): string {
  return slug.replace(/^\d+-/, "").replace(/-/g, " ");
}

async function _getComicKInfo(slug: string): Promise<MangaDetail> {
  const searchQuery = slugToSearchQuery(slug);

  const [searchRes, chapters] = await Promise.all([
    fetch(`${COMICK_API}/search?q=${encodeURIComponent(searchQuery)}`),
    fetchComicKChapters(slug),
  ]);

  let comic: any = null;
  if (searchRes.ok) {
    const raw = await searchRes.json();
    const data = raw.data || raw;
    if (Array.isArray(data)) {
      comic = data.find((c: any) => c.slug === slug) || data[0];
    }
  }

  if (!comic) {
    return {
      id: slug,
      title: slug.replace(/^\d+-/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      chapters,
    };
  }

  return {
    id: comic.slug || slug,
    title: comic.title || slug,
    image: comickCoverUrl(comic.default_thumbnail),
    cover: comickCoverUrl(comic.default_thumbnail),
    description: stripHtml(comic.parsed_description || comic.description),
    genres: comic.genres?.map((g: any) => typeof g === "string" ? g : g?.name).filter(Boolean) || [],
    status: comickStatus(comic.status),
    authors: typeof comic.author_names === "string"
      ? comic.author_names.split(",").map((s: string) => s.trim()).filter(Boolean)
      : comic.md_comic_md_authors?.map((a: any) => a.md_authors?.name).filter(Boolean) || [],
    releaseDate: comic.year,
    chapters,
  };
}

export async function readComicKChapter(chapterId: string): Promise<ChapterPage[]> {
  const res = await fetch(`${COMICK_API}/comics/${chapterId}`);
  if (!res.ok) throw new Error(`ComicK reader fetch failed (${res.status})`);
  const data = await res.json();
  const images = data.chapter?.images || data.chapter?.md_images || [];

  return images.map((img: any, i: number) => {
    let url = img.url || img.b2key;
    if (url && !url.startsWith("http")) {
      url = `https://meo.comick.pictures/${url}`;
    }
    return { img: `/api/img-proxy?url=${encodeURIComponent(url)}`, page: i };
  });
}

// ── Unified interface ──

export type MangaProvider = "MangaDex" | "ComicK";

export async function searchManga(query: string, page: number, provider: MangaProvider, englishOnly = true): Promise<MangaItem[]> {
  if (provider === "ComicK") return searchComicK(query);
  return searchMangaDex(query, page, englishOnly);
}

export async function getMangaInfo(id: string, provider: MangaProvider): Promise<MangaDetail> {
  if (provider === "ComicK") return getComicKInfo(id);
  return getMangaDexInfo(id);
}

export async function readChapter(chapterId: string, provider: MangaProvider): Promise<ChapterPage[]> {
  if (provider === "ComicK") return readComicKChapter(chapterId);
  return readMangaDexChapter(chapterId);
}

export async function getPopular(page: number, provider: MangaProvider, englishOnly = true): Promise<MangaItem[]> {
  if (provider === "ComicK") return searchComicK("popular");
  return getMangaDexPopular(page, englishOnly);
}

export async function getLatest(page: number, provider: MangaProvider, englishOnly = true): Promise<MangaItem[]> {
  if (provider === "ComicK") return searchComicK("latest");
  return getMangaDexLatest(page, englishOnly);
}

export async function getRecentlyAdded(page: number, provider: MangaProvider, englishOnly = true): Promise<MangaItem[]> {
  if (provider === "ComicK") return searchComicK("new");
  return getMangaDexRecentlyAdded(page, englishOnly);
}
