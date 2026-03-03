"use client";

import { useState } from "react";
import type { Track } from "@/types/track";
import { TrackCard } from "./TrackCard";

type DailyTracksSectionProps = {
  tracks: Track[];
  loading: boolean;
  error: string | null;
};

export function DailyTracksSection({
  tracks,
  loading,
  error,
}: DailyTracksSectionProps) {
  const [columns, setColumns] = useState<1 | 2>(2);
  if (loading) {
    return (
      <section aria-label="Músicas de hoje no Festival" className="space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Hoje no Festival
          </h2>
        </header>
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">
            Carregando músicas de hoje…
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section aria-label="Músicas de hoje no Festival" className="space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Hoje no Festival
          </h2>
        </header>
        <div
          className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
          role="alert"
        >
          {error}
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Músicas de hoje no Festival" className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground">
            Hoje no Festival
          </h1>
          <span className="text-sm text-muted-foreground">
            {tracks.length} {tracks.length === 1 ? "música" : "músicas"}
          </span>
        </div>
        <div
          className="flex rounded-lg border border-white/15 bg-white/5 p-0.5"
          role="group"
          aria-label="Layout da lista"
        >
          <button
            type="button"
            onClick={() => setColumns(2)}
            aria-pressed={columns === 2}
            title="2 colunas"
            className={`rounded-md p-2 transition ${
              columns === 2
                ? "bg-accent/20 text-accent"
                : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
              aria-hidden
            >
              <path fill="none" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setColumns(1)}
            aria-pressed={columns === 1}
            title="1 coluna"
            className={`rounded-md p-2 transition ${
              columns === 1
                ? "bg-accent/20 text-accent"
                : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
              aria-hidden
            >
              <path fill="none" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75" />
            </svg>
          </button>
        </div>
      </header>
      <div
        className={`grid gap-3 ${columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}
      >
        {tracks.map((track) => (
          <TrackCard key={`daily-${track.id}`} track={track} isToday />
        ))}
      </div>
    </section>
  );
}
