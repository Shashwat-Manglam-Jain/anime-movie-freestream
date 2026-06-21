import Link from "next/link";
import type { AnimeRelation } from "@/lib/jikan";

const SHOW_RELATIONS = ["Prequel", "Sequel", "Parent Story", "Full Story", "Alternative Version", "Spin-Off", "Side Story"];

interface AnimeRelationsProps {
  relations: AnimeRelation[];
  currentMalId: number;
}

export function AnimeRelations({ relations, currentMalId }: AnimeRelationsProps) {
  const animeRelations = relations
    .filter((r) => SHOW_RELATIONS.includes(r.relation))
    .flatMap((r) =>
      r.entry
        .filter((e) => e.type === "anime" && e.mal_id !== currentMalId)
        .map((e) => ({ ...e, relation: r.relation }))
    );

  if (animeRelations.length === 0) return null;

  const relationOrder = ["Prequel", "Sequel", "Parent Story", "Full Story", "Side Story", "Alternative Version", "Spin-Off"];
  animeRelations.sort(
    (a, b) => relationOrder.indexOf(a.relation) - relationOrder.indexOf(b.relation)
  );

  return (
    <div className="space-y-3 pt-4 border-t border-white/5">
      <h3 className="text-lg font-bold">Seasons & Related</h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {animeRelations.map((entry) => (
          <Link
            key={entry.mal_id}
            href={`/watch/mal/${entry.mal_id}/1/sub`}
            className="shrink-0 group"
          >
            <div className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-violet-500/30 px-4 py-3 transition-all min-w-[200px] max-w-[260px] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                {entry.relation}
              </span>
              <p className="text-sm font-medium text-white line-clamp-2 group-hover:text-violet-300 transition-colors">
                {entry.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
