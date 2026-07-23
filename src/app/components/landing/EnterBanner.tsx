'use client';

interface EnterBannerProps {
  show: boolean;
  onEnterExperience: () => void;
}

/**
 * The bottom "Ready to see more?" CTA bar. Quiet on purpose: a plain
 * bordered bar, no glow and no pulse. The button carries the only emphasis.
 */
export function EnterBanner({ show, onEnterExperience }: EnterBannerProps) {
  if (!show) return null;
  return (
    <div
      role="region"
      aria-label="Continue exploring"
      className="fixed bottom-6 left-1/2 z-40 banner-enter
                 flex flex-col items-center gap-3
                 sm:flex-row sm:gap-5
                 px-5 py-4 sm:px-6
                 rounded-xl border border-[color:var(--border)]
                 bg-[color:var(--bg-overlay)] backdrop-blur-md"
      style={{ transform: 'translateX(-50%)' }}
    >
      <style>{`
        @keyframes bannerIn {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
        .banner-enter { animation: bannerIn 0.4s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .banner-enter { animation: none; }
        }
      `}</style>

      <span className="font-serif text-base font-semibold tracking-wide text-[color:var(--fg)]">
        Ready to see more?
      </span>

      <div className="flex w-full gap-2 sm:w-auto">
        <button
          type="button"
          onClick={onEnterExperience}
          className="flex-1 sm:flex-initial rounded-md bg-[color:var(--accent)]
                     px-5 py-2 text-sm font-bold tracking-wide text-[color:var(--bg)]
                     transition-opacity hover:opacity-90"
        >
          Enter 3D Experience
        </button>
      </div>
    </div>
  );
}
