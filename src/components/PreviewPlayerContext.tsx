"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type PreviewPlayerContextValue = {
  /** ID da track que está tocando (para destacar o card). */
  currentTrackId: string | null;
  /** Toca a URL do preview. Passar trackId opcional para highlight no card. */
  playPreview: (url: string, trackId?: string) => void;
  /** Pausa e limpa o player. */
  stop: () => void;
  /** Se está tocando algo (qualquer faixa). */
  isPlaying: boolean;
};

const PreviewPlayerContext = createContext<PreviewPlayerContextValue | null>(
  null
);

export function usePreviewPlayer() {
  const ctx = useContext(PreviewPlayerContext);
  if (!ctx) {
    throw new Error("usePreviewPlayer must be used within PreviewPlayerProvider");
  }
  return ctx;
}

export function PreviewPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stop = useCallback(() => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
      el.removeAttribute("src");
    }
    setCurrentTrackId(null);
    setIsPlaying(false);
  }, []);

  const playPreview = useCallback(
    (url: string, trackId?: string) => {
      const el = audioRef.current;
      if (!el) return;

      // Se clicar na mesma faixa que já está tocando, pausa
      if (currentTrackId === trackId && isPlaying) {
        stop();
        return;
      }

      el.src = url;
      el.play().catch(() => {
        setCurrentTrackId(null);
        setIsPlaying(false);
      });
      setCurrentTrackId(trackId ?? null);
      setIsPlaying(true);
    },
    [currentTrackId, isPlaying, stop]
  );

  const handleEnded = useCallback(() => {
    setCurrentTrackId(null);
    setIsPlaying(false);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const value: PreviewPlayerContextValue = {
    currentTrackId,
    playPreview,
    stop,
    isPlaying,
  };

  return (
    <PreviewPlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onPause={handlePause}
        onPlay={handlePlay}
        className="hidden"
        preload="none"
      />
    </PreviewPlayerContext.Provider>
  );
}
