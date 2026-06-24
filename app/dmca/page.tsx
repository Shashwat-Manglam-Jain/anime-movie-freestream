import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA & Legal Notice",
  description:
    "DMCA takedown procedures, legal notices, and copyright information for smjStreamz.",
};

export default function DmcaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      {/* ── Header ── */}
      <div className="flex flex-col items-center text-center mb-14">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-violet-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          DMCA & Legal Notice
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground leading-relaxed">
          This page outlines how smjStreamz operates, its relationship with
          third-party content providers, and the procedures for addressing
          copyright concerns.
        </p>
      </div>

      {/* ── Key Statement Banner ── */}
      <div className="mb-10 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/15">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-violet-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-violet-300">
              Key Statement
            </h2>
            <ul className="space-y-2 text-sm text-foreground/70 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                smjStreamz is a{" "}
                <strong className="text-foreground">
                  search engine and aggregator
                </strong>{" "}
                that indexes freely available public APIs.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                It does{" "}
                <strong className="text-foreground">
                  NOT host, store, upload, or distribute
                </strong>{" "}
                any copyrighted content on its servers.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                <strong className="text-foreground">No revenue</strong> is generated
                from copyrighted content — the project is entirely
                non-commercial.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {/* ── How smjStreamz Works ── */}
        <section className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.06] dark:bg-white/[0.06]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              How smjStreamz Works
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            smjStreamz functions like a search engine. It does not host any
            content — it indexes and presents data from publicly accessible
            sources. Here is exactly what happens under the hood:
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/[0.06] dark:bg-white/[0.06] text-[10px] font-bold text-violet-400">
                1
              </span>
              <span>
                All media streams are served by{" "}
                <strong className="text-foreground/90">
                  third-party embed providers
                </strong>{" "}
                — not by smjStreamz servers. Video players are loaded via
                iframes pointing to external domains.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/[0.06] dark:bg-white/[0.06] text-[10px] font-bold text-violet-400">
                2
              </span>
              <span>
                All metadata (titles, descriptions, cover images, episode
                listings) comes from{" "}
                <strong className="text-foreground/90">public APIs</strong> such as
                AniList, Jikan, MangaDex, and ComicK.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/[0.06] dark:bg-white/[0.06] text-[10px] font-bold text-violet-400">
                3
              </span>
              <span>
                No content is{" "}
                <strong className="text-foreground/90">
                  downloaded, cached, transcoded, or stored
                </strong>{" "}
                on smjStreamz infrastructure at any point.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/[0.06] dark:bg-white/[0.06] text-[10px] font-bold text-violet-400">
                4
              </span>
              <span>
                There is{" "}
                <strong className="text-foreground/90">
                  no database, no user accounts, and no data collection
                </strong>
                . The application is entirely stateless on the server side.
              </span>
            </li>
          </ul>
        </section>

        {/* ── Third-Party Services ── */}
        <section className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.06] dark:bg-white/[0.06]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.04a4.5 4.5 0 00-1.242-7.244l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Third-Party Services
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            smjStreamz integrates with the following independently operated
            third-party services. smjStreamz has no affiliation with, control
            over, or responsibility for the content served by these providers.
          </p>

          {/* Metadata Providers */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-violet-400">
              Metadata Providers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  name: "AniList GraphQL",
                  desc: "Anime & manga catalog, trending, and metadata",
                },
                {
                  name: "Jikan / MAL API",
                  desc: "MyAnimeList data for search, charts, and schedules",
                },
                {
                  name: "MangaDex API",
                  desc: "Manga chapter listings and reader data",
                },
                {
                  name: "ComicK API",
                  desc: "Manga metadata and chapter sources",
                },
              ].map((s) => (
                <div
                  key={s.name}
                  className="rounded-lg border border-border bg-black/[0.02] dark:bg-white/[0.02] p-4"
                >
                  <p className="text-sm font-medium text-foreground/90">
                    {s.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Streaming Embed Providers */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-violet-400">
              Streaming Embed Providers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  name: "MegaPlay",
                  desc: "Anime video embed player",
                },
                {
                  name: "AnimPlay",
                  desc: "Anime video embed player",
                },
                {
                  name: "Videasy",
                  desc: "Movie & TV video embed player",
                },
                {
                  name: "VidSrc",
                  desc: "Movie & TV video embed player",
                },
                {
                  name: "VidLink Pro",
                  desc: "Movie & TV video embed player",
                },
                {
                  name: "AutoEmbed",
                  desc: "Movie & TV video embed player",
                },
              ].map((s) => (
                <div
                  key={s.name}
                  className="rounded-lg border border-border bg-black/[0.02] dark:bg-white/[0.02] p-4"
                >
                  <p className="text-sm font-medium text-foreground/90">
                    {s.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Content Providers */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-violet-400">
              Content Providers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-black/[0.02] dark:bg-white/[0.02] p-4">
                <p className="text-sm font-medium text-foreground/90">NovelBin</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Light novel chapter content (proxied for CORS only — no
                  content is stored)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── DMCA Takedown Procedure ── */}
        <section className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.06] dark:bg-white/[0.06]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              DMCA Takedown Procedure
            </h2>
          </div>

          <div className="rounded-lg border border-amber-500/10 bg-amber-500/[0.04] p-4">
            <p className="text-sm text-amber-200/80 leading-relaxed">
              Since smjStreamz does{" "}
              <strong className="text-amber-200">not host any content</strong>,
              it cannot remove specific videos, streams, or media files.
              Takedown requests must be directed to the actual content hosting
              providers listed above.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground/90">
              Content providers to contact for takedowns:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              {[
                "megaplay.buzz",
                "animplay.lol",
                "videasy.net",
                "vidsrc.cc",
                "vidlink.pro",
                "autoembed.cc",
                "novelbin.com",
              ].map((domain) => (
                <div
                  key={domain}
                  className="flex items-center gap-2 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] px-3 py-2 border border-border"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                  <span className="font-mono text-xs text-muted-foreground">
                    {domain}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground/90">
              To request a provider be removed from smjStreamz:
            </h3>
            <ol className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              {[
                "Verify that the content in question is hosted by one of the third-party providers listed above, not by smjStreamz itself.",
                "Contact the hosting provider directly to request removal of the infringing content from their servers.",
                "If you wish for smjStreamz to remove a specific provider from its configuration entirely, file an issue on the project's GitHub repository with proof of copyright ownership.",
                "Include your full legal name, contact information, a description of the copyrighted work, and the specific provider you want removed.",
                "smjStreamz will review the request and, if valid, remove the provider integration within a reasonable timeframe.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-[10px] font-bold text-violet-400 border border-violet-500/20">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── No Revenue / No Commercial Use ── */}
        <section className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.06] dark:bg-white/[0.06]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              No Revenue / No Commercial Use
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            smjStreamz is a non-commercial, open-source project. It does not
            generate any revenue from copyrighted content or any other means.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/60" />
              <span>
                <strong className="text-foreground/90">No advertisements</strong> —
                no ad networks, banners, pop-ups, or sponsored content of any
                kind.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/60" />
              <span>
                <strong className="text-foreground/90">
                  No subscriptions or paywalls
                </strong>{" "}
                — the application is entirely free to use.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/60" />
              <span>
                <strong className="text-foreground/90">
                  Open source & educational
                </strong>{" "}
                — the project exists as a demonstration of public API
                aggregation techniques.
              </span>
            </li>
          </ul>
        </section>

        {/* ── Fair Use & Legal Basis ── */}
        <section className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.06] dark:bg-white/[0.06]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Fair Use & Legal Basis
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This application is intended for{" "}
            <strong className="text-foreground/90">
              educational and personal use
            </strong>{" "}
            only. It serves as a technical demonstration of how public APIs can
            be aggregated into a unified interface. The following principles
            underpin its legal basis:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed ml-1">
            {[
              "Does not store, cache, or redistribute any copyrighted content",
              "Does not modify or transcode any video streams",
              "Does not circumvent any DRM or access controls",
              "Links only to publicly accessible, freely available API endpoints",
              "Demonstrates public API aggregation as an educational exercise",
              "Operates analogously to search engines that index publicly available content",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-0.5 h-4 w-4 shrink-0 text-violet-400/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── User Responsibility ── */}
        <section className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.06] dark:bg-white/[0.06]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              User Responsibility
            </h2>
          </div>
          <div className="rounded-lg border border-border bg-black/[0.02] dark:bg-white/[0.02] p-5 space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Users of smjStreamz are{" "}
              <strong className="text-foreground/90">solely responsible</strong> for
              ensuring that their use of this application complies with the laws
              and regulations of their respective jurisdictions.
            </p>
            <p>
              smjStreamz does{" "}
              <strong className="text-foreground/90">
                not encourage, promote, or condone
              </strong>{" "}
              piracy, copyright infringement, or any illegal activity. The
              application is provided as-is for educational and personal use,
              and users assume all responsibility for how they choose to use it.
            </p>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="rounded-xl border border-violet-500/10 bg-violet-500/[0.04] p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-foreground">Contact</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For DMCA-related inquiries, provider removal requests, or legal
            questions, you can reach us through the following channels:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-black/[0.03] dark:bg-white/[0.03] p-4 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 shrink-0 text-violet-400/70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground/90">
                  dmca@smjstreamz.com
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-black/[0.03] dark:bg-white/[0.03] p-4 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 shrink-0 text-violet-400/70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                />
              </svg>
              <div>
                <p className="text-xs text-muted-foreground">GitHub Issues</p>
                <p className="text-sm font-medium text-foreground/90">
                  github.com/smjstreamz/issues
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Legal Precedent Note ── */}
        <section className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.06] dark:bg-white/[0.06]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Legal Precedent & Position
            </h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              The practice of linking to and indexing publicly available content
              has been{" "}
              <strong className="text-foreground/90">
                upheld in various jurisdictions
              </strong>{" "}
              as lawful activity. Courts in multiple countries have ruled that
              search engines and link aggregators that do not host infringing
              content themselves are not liable for the content hosted by third
              parties.
            </p>
            <p>
              smjStreamz operates in a manner{" "}
              <strong className="text-foreground/90">
                analogous to a search engine
              </strong>{" "}
              — it indexes publicly available API endpoints and presents the
              results in a unified interface. It does not copy, store, or
              redistribute any copyrighted material.
            </p>
            <p>
              No legal action can be taken against an aggregator that does not
              host, store, or distribute copyrighted content. Any copyright
              claims must be directed to the{" "}
              <strong className="text-foreground/90">
                actual hosting providers
              </strong>{" "}
              who serve the content in question.
            </p>
          </div>
        </section>

        {/* ── Footer divider ── */}
        <div className="border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground/70">
            Last updated: June 2025 &middot; smjStreamz &middot; This page does
            not constitute legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
