'use client';

interface EnterBannerProps {
  show: boolean;
  onEnterExperience: () => void;
}

/**
 * The bottom "Ready to see more?" CTA bar. Originally a flat fragment;
 * now styled as an intentional element of the system: serif typography,
 * accent glow that matches the theme, spring entrance.
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
                 rounded-xl border border-[color:var(--border-strong)]
                 bg-[color:var(--bg-overlay)] backdrop-blur-md
                 shadow-[0_0_60px_-15px_var(--accent-glow-strong)]"
      style={{ transform: 'translateX(-50%)' }}
    >
      <style>{`
        @keyframes bannerIn {
          from { opacity: 0; transform: translate(-50%, 24px) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        .banner-enter {
          animation: bannerIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes bannerGlow {
          0%, 100% { text-shadow: 0 0 8px var(--accent-glow); }
          50%      { text-shadow: 0 0 16px var(--accent-glow-strong); }
        }
        .banner-headline { animation: bannerGlow 3.5s ease-in-out infinite; }
      `}</style>

      <span
        className="banner-headline font-serif text-base font-semibold
                   tracking-wide text-[color:var(--fg)]"
      >
        Ready to see more?
      </span>

      <div className="flex w-full gap-2 sm:w-auto">
        <button
          type="button"
          onClick={onEnterExperience}
          className="flex-1 sm:flex-initial rounded-md bg-[color:var(--accent)]
                     px-5 py-2 text-sm font-bold tracking-wide text-[color:var(--bg)]
                     transition-all hover:scale-[1.04]
                     hover:shadow-[0_0_24px_var(--accent-glow-strong)]"
        >
          Enter 3D Experience
        </button>
      </div>
    </div>
  );
}


