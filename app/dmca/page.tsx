import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA & Copyright",
};

export default function DmcaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        DMCA & Copyright Notice
      </h1>

      <div className="space-y-8 text-sm text-zinc-400 leading-relaxed">
        <section className="rounded-xl bg-white/[0.03] border border-white/5 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">
            Content Disclaimer
          </h2>
          <p>
            smjStreamz does <strong className="text-zinc-200">not</strong> host,
            upload, store, or distribute any video content, media files, or
            copyrighted material on its servers. All video streams are provided
            by third-party APIs and embed services that are publicly available on
            the internet.
          </p>
          <p>
            smjStreamz functions solely as a{" "}
            <strong className="text-zinc-200">search engine and aggregator</strong>
            — it retrieves metadata (titles, descriptions, posters) from public
            APIs and displays third-party video players in embedded iframes.
          </p>
        </section>

        <section className="rounded-xl bg-white/[0.03] border border-white/5 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">
            Third-Party Services
          </h2>
          <p>
            smjStreamz integrates with these independently operated third-party
            services:
          </p>
          <ul className="space-y-2 ml-5 list-disc">
            <li><strong className="text-zinc-300">Anikoto API</strong> — Anime catalog and episode metadata</li>
            <li><strong className="text-zinc-300">Jikan API</strong> — MyAnimeList data for anime search and charts</li>
            <li><strong className="text-zinc-300">MegaPlay / AnimPlay</strong> — Anime video embed players</li>
            <li><strong className="text-zinc-300">Videasy</strong> — Movie and TV video embed player</li>
            <li><strong className="text-zinc-300">VidSrc</strong> — Movie and TV video embed player</li>
            <li><strong className="text-zinc-300">VidLink Pro</strong> — Movie and TV video embed player</li>
            <li><strong className="text-zinc-300">AutoEmbed</strong> — Movie and TV video embed player</li>
          </ul>
        </section>

        <section className="rounded-xl bg-white/[0.03] border border-white/5 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">
            DMCA Takedown Requests
          </h2>
          <p>
            Since smjStreamz does not host any content, we cannot remove specific
            videos or streams. If you believe content accessible through one of
            the embedded players infringes your copyright, please contact the
            respective third-party service directly.
          </p>
          <p>
            If you are a copyright holder and would like a specific provider
            to be removed from smjStreamz&apos;s configuration, you may request
            this by filing an issue on the project&apos;s repository.
          </p>
        </section>

        <section className="rounded-xl bg-white/[0.03] border border-white/5 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">
            Fair Use & Legal Basis
          </h2>
          <p>
            This application is intended for{" "}
            <strong className="text-zinc-200">educational and personal use</strong>{" "}
            only. It demonstrates how public APIs can be aggregated into a
            unified interface. The application:
          </p>
          <ul className="space-y-2 ml-5 list-disc">
            <li>Does not store, cache, or redistribute any copyrighted content</li>
            <li>Does not modify or transcode any video streams</li>
            <li>Does not circumvent any DRM or access controls</li>
            <li>Links only to publicly accessible, freely available API endpoints</li>
            <li>Provides proper attribution to all data sources</li>
          </ul>
        </section>

        <section className="rounded-xl bg-violet-500/5 border border-violet-500/10 p-6">
          <p className="text-zinc-400">
            <strong className="text-violet-400">Important:</strong> Users are
            responsible for ensuring their use of this application complies with
            the laws and regulations of their jurisdiction.
          </p>
        </section>
      </div>
    </div>
  );
}
