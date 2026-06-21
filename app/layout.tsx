import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "smjStreamz — Free Anime, Movies & TV Streaming",
    template: "%s | smjStreamz",
  },
  description:
    "Watch anime, movies, and TV shows for free. Multiple streaming servers, sub & dub, no sign-up required.",
  keywords: [
    "anime streaming",
    "free anime",
    "watch anime online",
    "free movies",
    "free tv shows",
    "anime sub dub",
    "megaplay",
    "vidlink",
    "videasy",
    "vidsrc",
  ],
  openGraph: {
    title: "smjStreamz — Free Anime, Movies & TV Streaming",
    description:
      "Stream anime, movies, and TV shows for free with multiple servers. No sign-up required.",
    type: "website",
    siteName: "smjStreamz",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>

        <footer className="border-t border-white/5 bg-black/60 mt-16">
          <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white font-black text-[10px]">
                    SJ
                  </div>
                  <span className="text-sm font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    smjStreamz
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  smjStreamz does not host, store, or distribute any video content.
                  All streams are provided by third-party embed APIs. We are not
                  responsible for the content served by these services.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Browse
                </h4>
                <nav className="flex flex-col gap-1.5 text-sm text-zinc-500">
                  <Link href="/anime" className="hover:text-zinc-300 transition-colors">Anime</Link>
                  <Link href="/movies" className="hover:text-zinc-300 transition-colors">Movies</Link>
                  <Link href="/tv" className="hover:text-zinc-300 transition-colors">TV Shows</Link>
                  <Link href="/watchlist" className="hover:text-zinc-300 transition-colors">My Watchlist</Link>
                </nav>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Legal & Info
                </h4>
                <nav className="flex flex-col gap-1.5 text-sm text-zinc-500">
                  <Link href="/docs" className="hover:text-zinc-300 transition-colors">API Docs</Link>
                  <Link href="/dmca" className="hover:text-zinc-300 transition-colors">DMCA</Link>
                  <Link href="/settings" className="hover:text-zinc-300 transition-colors">Settings</Link>
                </nav>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-[11px] text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                Disclaimer: This site does not store any files on its server.
                All content is provided by non-affiliated third-party streaming
                APIs. If you have any legal concerns, please contact the
                respective media file owners or the hosting providers directly.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
