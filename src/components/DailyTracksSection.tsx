"use client";

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
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Hoje no Festival
        </h2>
        <span className="text-sm text-muted-foreground">
          {tracks.length} {tracks.length === 1 ? "música" : "músicas"}
        </span>
      </header>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tracks.map((track) => (
          <TrackCard key={`daily-${track.id}`} track={track} isToday />
        ))}
      </div>
    </section>
  );
}
