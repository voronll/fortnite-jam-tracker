"use client";

import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/lib/useDebounce";
import type { Track } from "@/types/track";
import { SearchBar } from "@/components/SearchBar";
import { TrackCard } from "@/components/TrackCard";
import { DailyTracksSection } from "@/components/DailyTracksSection";

export default function Home() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 250);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [dailyLoading, setDailyLoading] = useState(true);
  const [dailyError, setDailyError] = useState<string | null>(null);
  const [dailyTracks, setDailyTracks] = useState<Track[]>([]);
  const [dailyIds, setDailyIds] = useState<Set<string>>(new Set());

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
    if (!query.trim()) return null;
    if (loading) return "Buscando…";
    if (debounced.trim() && results.length === 0) return "Nenhuma música encontrada.";
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
        if (!cancelled) setError("Erro ao buscar. Tente novamente.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const isSearching = query.trim().length > 0;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Fortnite Jam Tracker
          </h1>
          <p className="mt-2 text-muted-foreground">
            Veja as músicas de hoje no Festival e busque no catálogo.
          </p>
        </header>

        {/* Search bar em destaque no topo */}
        <div className="mb-8">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Ex.: Toxicity, Metallica, Shaboozey…"
            hint={hint}
            error={error}
            isLoading={loading}
          />
        </div>

        {/* Conteúdo: daily ou resultados da busca */}
        {isSearching ? (
          <section aria-label="Resultados da busca" className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Resultados
            </h2>
            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map((track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    isToday={dailyIds.has(track.id)}
                  />
                ))}
              </div>
            ) : !loading && (
              <p className="rounded-xl border border-white/10 bg-white/5 py-8 text-center text-sm text-muted-foreground">
                Nenhuma música encontrada para &quot;{query.trim()}&quot;.
              </p>
            )}
          </section>
        ) : (
          <DailyTracksSection
            tracks={dailyTracks}
            loading={dailyLoading}
            error={dailyError}
          />
        )}

        <footer className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-muted-foreground">
          <a href="https://github.com/voronll" target="_blank" rel="noreferrer">
            by: <span className="text-accent">voronll</span>
          </a>
        </footer>
      </div>
    </main>
  );
}
