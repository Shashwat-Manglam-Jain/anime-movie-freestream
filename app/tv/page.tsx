import type { Metadata } from "next";
import { TOP_TV_SHOWS } from "@/lib/curated";
import { CuratedGrid } from "@/components/curated-grid";

export const metadata: Metadata = {
  title: "TV Shows — Stream Free",
  description:
    "Stream popular TV shows for free with multiple servers. No sign-up required.",
};

export default function TvPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">TV Shows</h1>
        <p className="mt-1 text-zinc-500">
          {TOP_TV_SHOWS.length} series available to stream — click any title to watch
        </p>
      </div>

      <CuratedGrid items={TOP_TV_SHOWS} type="tv" perPage={24} />
    </div>
  );
}
