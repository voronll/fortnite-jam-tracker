"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "@/lib/useDebounce";
import type { Track } from "@/types/track";
import { SearchBar } from "@/components/SearchBar";
import { TrackCard } from "@/components/TrackCard";
import { DailyTracksSection } from "@/components/DailyTracksSection";
import { AudioWaveBackground } from "@/components/AudioWaveBackground";

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

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const threshold = 60;
    let rafId: number | null = null;
    function onScroll() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > threshold);
        rafId = null;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(220);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setHeaderHeight(el.offsetHeight);
    });
    ro.observe(el);
    setHeaderHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, [scrolled]);

  return (
    <main className="relative min-h-screen">
      <AudioWaveBackground />

      <header
        ref={headerRef}
        className="header-scroll-transition fixed left-0 right-0 top-0 z-20 border-b border-white/10 bg-background/75 shadow-lg shadow-black/20 backdrop-blur-md"
      >
        <div className={`mx-auto max-w-3xl px-4 sm:px-6 ${scrolled ? "py-2.5 sm:py-3" : "py-5 sm:py-6"}`}>
          <div className={`text-center ${scrolled ? "mb-3" : "mb-5"}`}>
            <h1 className={`font-bold tracking-tight text-foreground ${scrolled ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"}`}>
              Fortnite <span className="text-accent">Jam</span> Tracker
            </h1>
            <p
              className={`overflow-hidden text-sm text-muted-foreground origin-top ${scrolled ? "mt-0 max-h-0 scale-y-0 opacity-0" : "mt-1.5 max-h-12 scale-y-100 opacity-100"}`}
              aria-hidden={scrolled}
            >
              Veja as músicas de hoje no Festival ou faça uma busca no catálogo.
            </p>
          </div>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Ex.: Toxicity, Metallica, Shaboozey…"
            hint={hint}
            error={error}
            isLoading={loading}
          />
        </div>
      </header>

      <div
        className="relative z-10 mx-auto max-w-3xl px-4 pb-20 sm:px-6 sm:pb-24"
        style={{ paddingTop: headerHeight + 8 }}
      >
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
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-10 border-t border-white/10 bg-background/80 py-4 text-center text-xs text-muted-foreground backdrop-blur-sm">
        <a href="https://github.com/voronll" target="_blank" rel="noreferrer">
          Desenvolvido por: <span className="text-accent">voronll</span>
        </a>
      </footer>
    </main>
  );
}
