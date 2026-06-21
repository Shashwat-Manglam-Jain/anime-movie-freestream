import Link from "next/link";
import Image from "next/image";
import { getSeries } from "@/lib/anikoto";
import { getAnimeById, getAnimeRelations, getAnimeRecommendations } from "@/lib/jikan";
import { Button } from "@/components/ui/button";
import { EpisodeList } from "@/components/episode-list";
import { MalEpisodeGrid } from "@/components/mal-episode-grid";
import { AnimeRelations } from "@/components/anime-relations";
import { SimilarAnime } from "@/components/similar-anime";
import { AnimeWatchPlayer } from "./anime-watch-player";
import { WatchTracker } from "./watch-tracker";
import { ExpandableText } from "@/components/expandable-text";

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ params: string[] }>;
  searchParams: Promise<{ anime?: string; ep?: string }>;
}) {
  const { params: segments } = await params;
  const { anime: animeId, ep: currentEp } = await searchParams;

  const type = segments[0];

  if (type !== "anikoto" && type !== "mal") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Invalid stream URL</h1>
        <p className="mt-2 text-zinc-500">The requested video could not be found.</p>
        <Link href="/" className="mt-4 inline-block">
          <Button className="bg-violet-600 hover:bg-violet-500 text-white">Go Home</Button>
        </Link>
      </div>
    );
  }

  const lang = type === "anikoto" ? (segments[2] || "sub") : (segments[3] || "sub");
  const otherLang = lang === "sub" ? "dub" : "sub";
  const embedId = type === "anikoto" ? segments[1] : null;
  const malId = type === "mal" ? segments[1] : null;
  const malEp = type === "mal" ? segments[2] : null;

  let langToggleHref: string;
  if (type === "anikoto") {
    langToggleHref = `/watch/anikoto/${segments[1]}/${otherLang}${animeId ? `?anime=${animeId}&ep=${currentEp}` : ""}`;
  } else {
    langToggleHref = `/watch/mal/${segments[1]}/${segments[2]}/${otherLang}`;
  }

  let prevHref: string | null = null;
  let nextHref: string | null = null;

  let seriesData = null;
  if (animeId) {
    try {
      seriesData = await getSeries(Number(animeId));
    } catch {
      // optional
    }
  }

  // Fetch Jikan data + relations + recommendations for MAL-based streams
  let jikanAnime = null;
  let relations: Awaited<ReturnType<typeof getAnimeRelations>> = [];
  let recommendations: Awaited<ReturnType<typeof getAnimeRecommendations>> = [];
  if (type === "mal" && malId) {
    const malIdNum = Number(malId);
    const [animeResult, relationsResult, recsResult] = await Promise.allSettled([
      getAnimeById(malIdNum),
      getAnimeRelations(malIdNum),
      getAnimeRecommendations(malIdNum),
    ]);
    if (animeResult.status === "fulfilled") jikanAnime = animeResult.value;
    if (relationsResult.status === "fulfilled") relations = relationsResult.value;
    if (recsResult.status === "fulfilled") recommendations = recsResult.value;
  }

  if (type === "mal" && malEp) {
    const epNum = Number(malEp);
    if (epNum > 1) {
      prevHref = `/watch/mal/${segments[1]}/${epNum - 1}/${lang}`;
    }
    const totalEps = seriesData
      ? seriesData.data.episodes.length
      : jikanAnime?.episodes || null;
    if (totalEps && epNum < totalEps) {
      nextHref = `/watch/mal/${segments[1]}/${epNum + 1}/${lang}`;
    } else if (!totalEps) {
      nextHref = `/watch/mal/${segments[1]}/${epNum + 1}/${lang}`;
    }
  }

  if (type === "anikoto" && seriesData) {
    const episodes = seriesData.data.episodes;
    const currentIndex = episodes.findIndex((ep) => ep.episode_embed_id === segments[1]);
    if (currentIndex > 0) {
      const prev = episodes[currentIndex - 1];
      prevHref = `/watch/anikoto/${prev.episode_embed_id}/${lang}?anime=${animeId}&ep=${prev.number}`;
    }
    if (currentIndex >= 0 && currentIndex < episodes.length - 1) {
      const next = episodes[currentIndex + 1];
      nextHref = `/watch/anikoto/${next.episode_embed_id}/${lang}?anime=${animeId}&ep=${next.number}`;
    }
  }

  const title = seriesData?.data.anime.title || jikanAnime?.title || "Anime";
  const poster = seriesData?.data.anime.poster || jikanAnime?.images.jpg.large_image_url || "";
  const synopsis = seriesData?.data.anime.description || jikanAnime?.synopsis || "";
  const displayEp = currentEp || malEp || "1";

  const malTotalEps = jikanAnime?.episodes || 24;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <AnimeWatchPlayer
        embedId={embedId}
        malId={malId}
        malEp={malEp}
        lang={lang as "sub" | "dub"}
      />

      <div className="flex flex-wrap items-center gap-2">
        {prevHref && (
          <Link href={prevHref}>
            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
              ← Previous
            </Button>
          </Link>
        )}
        {nextHref && (
          <Link href={nextHref}>
            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
              Next →
            </Button>
          </Link>
        )}

        <Link href={langToggleHref}>
          <Button
            variant="secondary"
            size="sm"
            className={
              lang === "sub"
                ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
            }
          >
            Switch to {otherLang.toUpperCase()}
          </Button>
        </Link>

        {animeId && (
          <Link href={`/anime/${animeId}`}>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              ← Back to Details
            </Button>
          </Link>
        )}

        <span className="ml-auto text-sm text-zinc-500">
          Episode {displayEp} · {lang.toUpperCase()}
        </span>
      </div>

      <WatchTracker
        id={`anime-${animeId || segments[1]}`}
        title={title}
        poster={poster}
        watchUrl={`/watch/${segments.join("/")}`}
        episodeInfo={`Episode ${displayEp}`}
      />

      {/* Anime info section */}
      {(seriesData || jikanAnime) && (
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex gap-4">
            {poster && (
              <div className="shrink-0 relative w-20 aspect-[2/3] rounded-lg overflow-hidden ring-1 ring-white/10 hidden sm:block">
                <Image src={poster} alt={title} fill className="object-cover" sizes="80px" />
              </div>
            )}
            <div className="space-y-1 min-w-0">
              <h2 className="text-xl font-bold truncate">{title}</h2>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                {jikanAnime?.score && <span className="text-yellow-400">★ {jikanAnime.score}</span>}
                {jikanAnime?.type && <span>{jikanAnime.type}</span>}
                {jikanAnime?.year && <span>{jikanAnime.year}</span>}
                {jikanAnime?.episodes && <span>{jikanAnime.episodes} eps</span>}
              </div>
              {synopsis && (
                <ExpandableText text={synopsis} maxLines={2} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Related seasons / sequels / prequels */}
      {relations.length > 0 && malId && (
        <AnimeRelations relations={relations} currentMalId={Number(malId)} />
      )}

      {/* Anikoto episode list */}
      {seriesData && (
        <div className="space-y-4 pt-4 border-t border-white/5">
          <h3 className="text-lg font-bold">Episodes</h3>
          <EpisodeList
            episodes={seriesData.data.episodes}
            animeId={seriesData.data.anime.id}
            currentEpisode={embedId || undefined}
          />
        </div>
      )}

      {/* MAL episode grid with season tabs */}
      {type === "mal" && !seriesData && malId && (
        <MalEpisodeGrid
          malId={malId}
          totalEpisodes={malTotalEps}
          currentEpisode={Number(malEp) || 1}
          lang={lang}
        />
      )}

      {/* Similar anime recommendations */}
      {recommendations.length > 0 && (
        <SimilarAnime recommendations={recommendations} />
      )}
    </div>
  );
}
