'use client';

interface HeroTitleProps {
  /** Click handler — used to trigger the playful "yep we know" easter egg. */
  onClick?: () => void;
}

/**
 * "DISCOVER YOUR POTENTIAL" — the original aspirational hero.
 * Three stacked colored words, responsive, theme-aware glow via CSS vars.
 *
 * The colored words deliberately pull from the WHOLE palette (not just
 * --accent) so the slogan still reads as an intentional gradient even
 * when themes swap. We keep the canonical green/white/gold mapping.
 */
export function HeroTitle({ onClick }: HeroTitleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Discover Your Potential"
      className="group relative inline-flex flex-col items-center
                 cursor-pointer text-center"
    >
      <h1
        className="font-serif font-extrabold leading-[1.05] tracking-tight
                   text-[clamp(2.5rem,9vw,5.5rem)]
                   flex flex-col gap-1 sm:gap-1.5 md:flex-row md:gap-x-6"
      >
        <span
          className="text-[color:var(--accent-soft)] md:text-right"
          style={{ textShadow: '0 0 22px var(--accent-glow)' }}
        >
          DISCOVER
        </span>
        <span
          className="text-[color:var(--fg)]"
          style={{ textShadow: '0 0 18px color-mix(in oklab, var(--fg) 40%, transparent)' }}
        >
          YOUR
        </span>
        <span
          className="text-[color:var(--accent-warm)] md:text-left"
          style={{ textShadow: '0 0 24px color-mix(in oklab, var(--accent-warm) 60%, transparent)' }}
        >
          POTENTIAL
        </span>
      </h1>

      <span
        aria-hidden
        className="mt-4 block h-px w-32 bg-[color:var(--fg)]/50
                   transition-all group-hover:w-48 group-hover:bg-[color:var(--accent)]"
        style={{ boxShadow: '0 0 10px var(--accent-glow)' }}
      />
    </button>
  );
}
