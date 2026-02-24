"use client";

import type { Track } from "@/types/track";

type TrackCardProps = {
  track: Track;
  isToday?: boolean;
};

export function TrackCard({ track, isToday }: TrackCardProps) {
  return (
    <article
      className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:border-accent/40 hover:bg-white/8"
      data-testid="track-card"
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 shadow-lg ring-1 ring-black/20">
        {track.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.coverUrl}
            alt={`${track.title} cover`}
            className="h-full w-full object-cover transition group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-neutral-700 to-neutral-800 text-2xl text-white/40">
            ♪
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-semibold text-foreground">
            {track.title}
          </h3>
          {isToday && (
            <span className="shrink-0 rounded-full border border-accent/50 bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">
              Hoje
            </span>
          )}
        </div>
        <p className="truncate text-sm text-muted-foreground">
          {track.artist}
        </p>
      </div>
    </article>
  );
}
