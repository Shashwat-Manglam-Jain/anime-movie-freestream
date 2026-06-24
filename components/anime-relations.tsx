import Link from "next/link";
import type { AnimeRelation, SeasonEntry } from "@/lib/jikan";

const SHOW_RELATIONS = ["Prequel", "Sequel", "Parent Story", "Full Story", "Alternative Version", "Spin-Off", "Side Story"];

interface AnimeRelationsProps {
  relations: AnimeRelation[];
  currentMalId: number;
  seasonChain?: SeasonEntry[];
}

export function AnimeRelations({ relations, currentMalId, seasonChain }: AnimeRelationsProps) {
  const animeRelations = relations
    .filter((r) => SHOW_RELATIONS.includes(r.relation))
    .flatMap((r) =>
      r.entry
        .filter((e) => e.type === "anime" && e.mal_id !== currentMalId)
        .map((e) => ({ ...e, relation: r.relation }))
    );

  const relationOrder = ["Prequel", "Sequel", "Parent Story", "Full Story", "Side Story", "Alternative Version", "Spin-Off"];
  animeRelations.sort(
    (a, b) => relationOrder.indexOf(a.relation) - relationOrder.indexOf(b.relation)
  );

  const hasSeasons = seasonChain && seasonChain.length > 1;
  const hasRelations = animeRelations.length > 0;

  if (!hasSeasons && !hasRelations) return null;

  return (
    <div className="space-y-6 pt-4 border-t border-border">
      {hasSeasons && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold">Seasons</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {seasonChain.map((entry) => (
              <Link
                key={entry.mal_id}
                href={`/watch/mal/${entry.mal_id}/1/sub`}
                className="shrink-0 group"
              >
                <div
                  className={`rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-4 py-3 transition-all min-w-[200px] max-w-[260px] space-y-1 ${
                    entry.position === "current"
                      ? "border-2 border-violet-500 ring-2 ring-violet-500/30"
                      : "border border-border hover:border-violet-500/30"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                    {entry.position === "current"
                      ? "Current"
                      : entry.position === "prequel"
                        ? "Prequel"
                        : "Sequel"}
                  </span>
                  <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-violet-300 transition-colors">
                    {entry.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {hasRelations && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold">Related</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {animeRelations.map((entry) => (
              <Link
                key={entry.mal_id}
                href={`/watch/mal/${entry.mal_id}/1/sub`}
                className="shrink-0 group"
              >
                <div className="rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-border hover:border-violet-500/30 px-4 py-3 transition-all min-w-[200px] max-w-[260px] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                    {entry.relation}
                  </span>
                  <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-violet-300 transition-colors">
                    {entry.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
