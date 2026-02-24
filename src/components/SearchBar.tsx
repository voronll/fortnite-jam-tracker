"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string | null;
  error?: string | null;
  isLoading?: boolean;
  "aria-label"?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar música ou artista…",
  hint,
  error,
  isLoading,
  "aria-label": ariaLabel = "Buscar músicas",
}: SearchBarProps) {
  return (
    <div className="w-full">
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          {isLoading ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </span>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="w-full rounded-xl border border-white/15 bg-white/10 py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted-foreground outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/25"
          autoComplete="off"
        />
      </div>
      <div className="mt-2 min-h-5 px-1 text-sm">
        {error && (
          <span className="text-destructive" role="alert">
            {error}
          </span>
        )}
        {!error && hint && (
          <span className="text-muted-foreground">{hint}</span>
        )}
      </div>
    </div>
  );
}
