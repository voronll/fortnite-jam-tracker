"use client";

import { useState } from "react";
import type { Track } from "@/types/track";
import { usePreviewPlayer } from "@/components/PreviewPlayerContext";

type TrackCardProps = {
  track: Track;
  isToday?: boolean;
};

export function TrackCard({ track, isToday }: TrackCardProps) {
  const { playPreview, stop, currentTrackId, isPlaying, progress } =
    usePreviewPlayer();
  const [loading, setLoading] = useState(false);
  const [noPreview, setNoPreview] = useState(false);

  const thisPlaying = currentTrackId === track.id && isPlaying;
  const showProgress = currentTrackId === track.id;

  async function handlePlayPreview(e: React.MouseEvent) {
    e.preventDefault();
    if (thisPlaying) {
      stop();
      return;
    }
    if (noPreview) return;

    setLoading(true);
    setNoPreview(false);
    try {
      const params = new URLSearchParams({
        title: track.title,
        artist: track.artist,
      });
      const res = await fetch(`/api/preview?${params}`);
      const data = (await res.json()) as {
        previewUrl: string | null;
        error?: string;
      };
      if (data.previewUrl) {
        playPreview(data.previewUrl, track.id);
      } else {
        setNoPreview(true);
      }
    } catch {
      setNoPreview(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-xl border backdrop-blur-sm transition hover:border-accent/40 hover:bg-white/8 ${
        showProgress
          ? "border-accent/30 bg-gradient-to-t from-accent/10 via-accent/5 to-white/5"
          : "border-white/10 bg-white/5"
      }`}
      data-testid="track-card"
    >
      <div className="flex items-center gap-5 p-5">
        {isToday && (
          <span
            className="absolute right-0 top-0 shrink-0 rounded-bl-lg rounded-tr-xl border-b border-l border-accent/50 bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent"
            aria-label="Música de hoje no Festival"
          >
            Hoje
          </span>
        )}

        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 shadow-lg ring-1 ring-black/20">
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

        <div className={`min-w-0 flex-1 ${isToday ? "pr-12" : ""}`}>
          <h3 className="truncate font-semibold text-foreground">
            {track.title}
          </h3>
          <p className="truncate text-sm text-muted-foreground">
            {track.artist}
          </p>
        </div>

        <div className={`shrink-0 ${isToday ? "mt-4" : ""}`}>
          <button
            type="button"
            onClick={handlePlayPreview}
            disabled={loading || noPreview}
            title={
              noPreview
                ? "Preview não disponível (Deezer)"
                : thisPlaying
                  ? "Pausar"
                  : "Ouvir preview (30s)"
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-foreground transition hover:bg-accent/20 hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={
              thisPlaying ? "Pausar preview" : "Ouvir preview de 30 segundos"
            }
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            ) : thisPlaying ? (
              <span className="text-lg leading-none" aria-hidden>⏸</span>
            ) : noPreview ? (
              <span className="text-sm text-muted-foreground" aria-hidden>—</span>
            ) : (
              <span className="ml-0.5 text-lg leading-none" aria-hidden>▶</span>
            )}
          </button>
        </div>
      </div>

      {showProgress && (
        <div
          className="h-0.5 w-full overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso do preview"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent/80 transition-[width] duration-150 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
    </article>
  );
}
