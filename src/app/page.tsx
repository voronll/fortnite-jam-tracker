"use client";

import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/lib/useDebounce";

type Track = {
  id: string;
  title: string;
  artist: string;
  bpm?: number | null;
  key?: string | null;
  coverUrl?: string | null;
};

function TrackCard({
  track,
  isToday,
}: {
  track: Track;
  isToday?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border">
        {track.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.coverUrl}
            alt={`${track.title} cover`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-neutral-100" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate font-semibold">{track.title}</div>

          {isToday && (
            <span className="shrink-0 rounded-full border px-2 py-0.5 text-xs">
              ✅ Hoje
            </span>
          )}
        </div>

        <div className="truncate text-sm text-neutral-500">{track.artist}</div>

        <div className="mt-1 text-xs text-neutral-500">
          {track.bpm ? `${track.bpm} BPM` : "BPM n/d"}
          {" • "}
          {track.key ? `Key: ${track.key}` : "Key n/d"}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 250);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Daily
  const [dailyLoading, setDailyLoading] = useState(true);
  const [dailyError, setDailyError] = useState<string | null>(null);
  const [dailyTracks, setDailyTracks] = useState<Track[]>([]);
  const [dailyIds, setDailyIds] = useState<Set<string>>(new Set());

  // Carrega daily 1x
  useEffect(() => {
    let cancelled = false;

    async function loadDaily() {
      try {
        setDailyLoading(true);
        setDailyError(null);

        const res = await fetch("/api/daily");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = (await res.json()) as Track[];
        if (cancelled) return;

        setDailyTracks(data);
        setDailyIds(new Set(data.map((t) => t.id)));
      } catch {
        if (!cancelled) setDailyError("Não consegui carregar as músicas de hoje.");
      } finally {
        if (!cancelled) setDailyLoading(false);
      }
    }

    loadDaily();
    return () => {
      cancelled = true;
    };
  }, []);

  const hint = useMemo(() => {
    if (!query.trim()) return "Digite o nome da música ou artista…";
    if (loading) return "Buscando…";
    if (debounced.trim() && results.length === 0) return "Nada encontrado.";
    return null;
  }, [query, debounced, loading, results.length]);

  useEffect(() => {
    const q = debounced.trim();

    if (!q) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/tracks?q=${encodeURIComponent(q)}&take=25`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = (await res.json()) as Track[];
        if (!cancelled) setResults(data);
      } catch {
        if (!cancelled) setError("Deu ruim ao buscar. Tenta de novo.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">🎵 Fortnite Jam Tracker</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Pesquise se uma música existe como Jam Track e veja as músicas de hoje no Festival.
            </p>
          </div>

          <a
            className="text-sm underline underline-offset-4 text-neutral-600 hover:text-neutral-900"
            href="/api/daily"
            target="_blank"
            rel="noreferrer"
            title="Ver JSON do daily"
          >
            API /daily
          </a>
        </div>

        {/* Daily section */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">🔥 Hoje no Festival</h2>

            {!dailyLoading && !dailyError && (
              <span className="text-xs text-neutral-500">
                {dailyTracks.length} músicas
              </span>
            )}
          </div>

          {dailyLoading && (
            <div className="mt-3 rounded-lg border p-4 text-sm text-neutral-500">
              Carregando daily…
            </div>
          )}

          {dailyError && (
            <div className="mt-3 rounded-lg border p-4 text-sm text-red-600">
              {dailyError}
            </div>
          )}

          {!dailyLoading && !dailyError && (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {dailyTracks.map((t) => (
                <TrackCard key={`daily-${t.id}`} track={t} isToday />
              ))}
            </div>
          )}
        </section>

        {/* Search */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold">🔎 Buscar no catálogo</h2>

          <div className="mt-3">
            <input
              className="w-full rounded-lg border p-3 outline-none focus:ring"
              placeholder="Ex.: Toxicity, Metallica, Shaboozey…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="mt-2 min-h-5 text-sm text-neutral-500">
              {error ? <span className="text-red-600">{error}</span> : hint}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {results.map((t) => (
              <TrackCard key={t.id} track={t} isToday={dailyIds.has(t.id)} />
            ))}
          </div>

          {loading && (
            <div className="mt-6 text-sm text-neutral-500">Carregando…</div>
          )}
        </div>
      </div>
    </main>
  );
}