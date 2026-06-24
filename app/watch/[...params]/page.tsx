import Link from "next/link";
import Image from "next/image";
import { getSeries } from "@/lib/anikoto";
import { getAnimeById, getAnimeRelations, getAnimeRecommendations, getAnimeEpisodeCount, getAnimeSeasonChain } from "@/lib/jikan";
import type { SeasonEntry } from "@/lib/jikan";
import { Badge } from "@/components/ui/badge";
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
        <p className="mt-2 text-muted-foreground">The requested video could not be found.</p>
        <Link href="/" className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors">
          Go Home
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
    } catch {}
  }

  let jikanAnime = null;
  let relations: Awaited<ReturnType<typeof getAnimeRelations>> = [];
  let recommendations: Awaited<ReturnType<typeof getAnimeRecommendations>> = [];
  let seasonChain: SeasonEntry[] = [];
  if (type === "mal" && malId) {
    const malIdNum = Number(malId);
    const [animeResult, relationsResult, recsResult, seasonChainResult] = await Promise.allSettled([
      getAnimeById(malIdNum),
      getAnimeRelations(malIdNum),
      getAnimeRecommendations(malIdNum),
      getAnimeSeasonChain(malIdNum),
    ]);
    if (animeResult.status === "fulfilled") jikanAnime = animeResult.value;
    if (relationsResult.status === "fulfilled") relations = relationsResult.value;
    if (recsResult.status === "fulfilled") recommendations = recsResult.value;
    if (seasonChainResult.status === "fulfilled") seasonChain = seasonChainResult.value;
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

  const anime = seriesData?.data.anime;
  const title = anime?.title || jikanAnime?.title || "Anime";
  const poster = anime?.poster || jikanAnime?.images.jpg.large_image_url || "";
  const bannerImage = anime?.background_image || jikanAnime?.images.jpg.large_image_url || "";
  const synopsis = anime?.description || jikanAnime?.synopsis || "";
  const displayEp = currentEp || malEp || "1";

  let malTotalEps = jikanAnime?.episodes
    || (seriesData ? seriesData.data.episodes.length : 0)
    || 0;

  if (!malTotalEps && malId) {
    try {
      malTotalEps = await getAnimeEpisodeCount(Number(malId));
    } catch {}
  }
  if (!malTotalEps) {
    malTotalEps = Math.max(Number(malEp) || 1, 24);
  }

  let anilistId: string | null = seriesData?.data.anime.ani_id || null;
  if (!anilistId && malId) {
    try {
      const aniRes = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "query($malId:Int){Media(idMal:$malId,type:ANIME){id}}",
          variables: { malId: Number(malId) },
        }),
      });
      const aniData = await aniRes.json();
      const id = aniData?.data?.Media?.id;
      if (id) anilistId = String(id);
    } catch {}
  }

  const score = anime?.score || jikanAnime?.score;
  const status = anime?.status || jikanAnime?.status;
  const year = anime?.year || jikanAnime?.year;
  const genres = anime?.terms_by_type?.genre || jikanAnime?.genres?.map((g: any) => g.name) || [];

  return (
    <div>
      {/* Banner */}
      <div className="relative h-48 md:h-64 w-full overflow-hidden">
        {bannerImage ? (
          <Image
            src={bannerImage}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-violet-950 to-fuchsia-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16">
        <div className="flex flex-col md:flex-row gap-6 -mt-32 relative z-10">
          {/* Cover */}
          <div className="shrink-0">
            <div className="relative w-40 md:w-48 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
              {poster ? (
                <Image src={poster} alt={title} fill className="object-cover" sizes="192px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-950 to-fuchsia-950">
                  <span className="text-xs text-muted-foreground">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4 pt-2">
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                {title}
              </h1>
              {anime?.alternative && anime.alternative !== title && (
                <p className="text-sm text-muted-foreground mt-1">{anime.alternative}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20">
                Episode {displayEp} · {lang.toUpperCase()}
              </Badge>
              {score && Number(score) > 0 && (
                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                  ★ {score}
                </Badge>
              )}
              {status && (
                <Badge variant="outline" className="border-border">
                  {status}
                </Badge>
              )}
              {year && Number(year) > 0 && (
                <Badge variant="outline" className="border-border">
                  {year}
                </Badge>
              )}
              {jikanAnime?.type && (
                <Badge variant="outline" className="border-border">
                  {jikanAnime.type}
                </Badge>
              )}
              {jikanAnime?.episodes && (
                <Badge variant="outline" className="border-border">
                  {jikanAnime.episodes} eps
                </Badge>
              )}
              {anime?.rating && (
                <Badge variant="outline" className="border-border">
                  {anime.rating}
                </Badge>
              )}
            </div>

            {anime && (
              <div className="flex flex-wrap gap-1.5">
                {anime.is_sub && (
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    SUB ({anime.is_sub} eps)
                  </Badge>
                )}
                {anime.is_dub && (
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                    DUB ({anime.is_dub} eps)
                  </Badge>
                )}
              </div>
            )}

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {genres.map((genre: string) => (
                  <Badge key={genre} variant="secondary" className="bg-black/5 dark:bg-white/5 text-foreground/70 text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            {synopsis && (
              <ExpandableText text={synopsis} maxLines={3} />
            )}

            <div className="flex flex-wrap gap-2">
              {prevHref && (
                <Link href={prevHref} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-black/5 dark:bg-white/5 px-4 py-2 text-xs font-medium text-foreground/70 hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground transition-colors">
                  ← Previous
                </Link>
              )}
              {nextHref && (
                <Link href={nextHref} className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 px-4 py-2 text-xs font-medium text-white transition-colors">
                  Next Episode →
                </Link>
              )}
              <Link href={langToggleHref} className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-colors ${lang === "sub" ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20" : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"}`}>
                Switch to {otherLang.toUpperCase()}
              </Link>
              {animeId && (
                <Link href={`/anime/${animeId}`} className="inline-flex items-center gap-1 rounded-lg border border-border bg-black/5 dark:bg-white/5 px-3 py-1.5 text-xs text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground transition-colors">
                  ← Back to Details
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Player */}
        <div className="mt-8">
          <AnimeWatchPlayer
            embedId={embedId}
            malId={malId}
            malEp={malEp}
            lang={lang as "sub" | "dub"}
            anilistId={anilistId}
          />
        </div>

        <WatchTracker
          id={`anime-${animeId || segments[1]}`}
          title={title}
          poster={poster}
          watchUrl={`/watch/${segments.join("/")}`}
          episodeInfo={`Episode ${displayEp}`}
        />

        {/* Related seasons */}
        {relations.length > 0 && malId && (
          <div className="mt-12">
            <AnimeRelations relations={relations} currentMalId={Number(malId)} seasonChain={seasonChain} />
          </div>
        )}

        {/* Anikoto episode list */}
        {seriesData && (
          <div className="mt-12">
            <EpisodeList
              episodes={seriesData.data.episodes}
              animeId={seriesData.data.anime.id}
              currentEpisode={embedId || undefined}
            />
          </div>
        )}

        {/* MAL episode grid with season tabs */}
        {type === "mal" && !seriesData && malId && (
          <div className="mt-12">
            <MalEpisodeGrid
              malId={malId}
              totalEpisodes={malTotalEps}
              currentEpisode={Number(malEp) || 1}
              lang={lang}
            />
          </div>
        )}

        {/* Similar anime recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <SimilarAnime recommendations={recommendations} />
          </div>
        )}
      </div>
    </div>
  );
}
