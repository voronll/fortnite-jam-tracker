"use client";

const BAR_COUNT = 180;
const WAVE_DURATION = 2.2;

export function AudioWaveBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 flex items-center justify-center filter-[blur(6px)]">
        <div className="relative flex w-full items-center justify-center overflow-hidden rounded-none py-4">
          <div className="relative flex items-center justify-center gap-0.5 sm:gap-1">
            {Array.from({ length: BAR_COUNT }).map((_, i) => {
              const delay = (i / BAR_COUNT) * WAVE_DURATION;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center gap-0.5"
                >
                  <div
                    className="w-1.5 rounded-full bg-accent opacity-25 sm:w-2"
                    style={{
                      height: "120px",
                      transformOrigin: "bottom",
                      animation: `audiowave ${WAVE_DURATION}s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`,
                      animationDelay: `${delay}s`,
                    }}
                  />
                  <div
                    className="w-1.5 rounded-full bg-accent opacity-25 sm:w-2"
                    style={{
                      height: "120px",
                      transformOrigin: "top",
                      animation: `audiowave ${WAVE_DURATION}s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`,
                      animationDelay: `${delay}s`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
