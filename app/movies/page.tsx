import type { Metadata } from "next";
import { TOP_MOVIES } from "@/lib/curated";
import { CuratedGrid } from "@/components/curated-grid";

export const metadata: Metadata = {
  title: "Movies — Stream Free",
  description:
    "Stream top-rated movies for free with multiple servers. No sign-up required.",
};

export default function MoviesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Movies</h1>
        <p className="mt-1 text-zinc-500">
          {TOP_MOVIES.length} movies available to stream — click any title to watch
        </p>
      </div>

      <CuratedGrid items={TOP_MOVIES} type="movie" perPage={24} />
    </div>
  );
}
