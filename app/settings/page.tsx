"use client";

import { useState, useEffect } from "react";
import { ALL_PROVIDERS } from "@/lib/providers";
import { getProviderPrefs, setProviderPrefs } from "@/lib/watchlist";

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setPrefs(getProviderPrefs());
  }, []);

  function toggleProvider(id: string) {
    const provider = ALL_PROVIDERS.find((p) => p.id === id);
    if (!provider) return;

    const currentlyEnabled = prefs[id] ?? provider.enabled;
    const newPrefs = { ...prefs, [id]: !currentlyEnabled };
    setPrefs(newPrefs);
    setProviderPrefs(newPrefs);
  }

  function resetAll() {
    setPrefs({});
    setProviderPrefs({});
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage streaming providers and app preferences
        </p>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Streaming Providers</h2>
          <button
            onClick={resetAll}
            className="text-xs text-muted-foreground hover:text-foreground/70 transition-colors"
          >
            Reset to defaults
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          Enable or disable streaming providers. Enabled providers appear as
          server options on watch pages. Changes are saved to your browser.
        </p>

        <div className="space-y-3">
          {ALL_PROVIDERS.map((provider) => {
            const isEnabled = prefs[provider.id] ?? provider.enabled;

            return (
              <div
                key={provider.id}
                className={`rounded-xl border p-5 transition-all ${
                  isEnabled
                    ? "bg-black/[0.03] dark:bg-white/[0.03] border-violet-500/20"
                    : "bg-black/[0.01] dark:bg-white/[0.01] border-border opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{provider.name}</h3>
                      <div className="flex gap-1.5">
                        {provider.types.map((type) => (
                          <span
                            key={type}
                            className="rounded bg-black/5 dark:bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                      {provider.free ? (
                        <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-medium">
                          Free
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-500/10 text-yellow-400 px-2 py-0.5 text-[10px] font-medium">
                          Paid
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{provider.notes}</p>
                    <a
                      href={provider.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-violet-400/70 hover:text-violet-400 transition-colors"
                    >
                      {provider.url} ↗
                    </a>
                  </div>

                  <button
                    onClick={() => toggleProvider(provider.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                      isEnabled ? "bg-violet-600" : "bg-muted-foreground/30"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform mt-0.5 ${
                        isEnabled ? "translate-x-5 ml-0.5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-bold">How to Add a Provider</h2>
        <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-border p-6 text-sm text-muted-foreground space-y-3">
          <p>
            To add a new streaming provider to smjStreamz, edit{" "}
            <code className="rounded bg-black/5 dark:bg-white/5 px-1.5 py-0.5 text-violet-400">
              lib/providers.ts
            </code>{" "}
            and add a new entry to the{" "}
            <code className="rounded bg-black/5 dark:bg-white/5 px-1.5 py-0.5 text-violet-400">
              ALL_PROVIDERS
            </code>{" "}
            array.
          </p>
          <p>Each provider needs:</p>
          <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
            <li>
              <code className="text-violet-400/70">id</code> — Unique identifier
            </li>
            <li>
              <code className="text-violet-400/70">name</code> — Display name
            </li>
            <li>
              <code className="text-violet-400/70">types</code> — Array of
              &quot;movie&quot;, &quot;tv&quot;, or &quot;anime&quot;
            </li>
            <li>
              <code className="text-violet-400/70">buildMovieUrl</code> /
              <code className="text-violet-400/70">buildTvUrl</code> — Functions
              that take an ID and return the embed iframe URL
            </li>
          </ul>
          <p>
            See the{" "}
            <a href="/docs" className="text-violet-400 underline">
              API documentation
            </a>{" "}
            for full details and examples.
          </p>
        </div>
      </section>
    </div>
  );
}
