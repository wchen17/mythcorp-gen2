// Presentational. The pointer parallax used to live here and moved the title
// ALONE, which meant the headline drifted up to 8px while the lines under it
// stayed put: the composition's center visibly disagreed with itself. The
// effect now lives on the whole hero column in NewLandingPage, so everything
// drifts together.
//
// This also stopped being a <button>. It was one so that clicking the headline
// opened a modal apologizing for the deliberate misalignment, which is a joke
// that cost more than it earned. A heading is a heading.
export function HeroTitle() {
  return (
    <div className="group relative inline-flex flex-col items-center text-center">
      <h1 className="flex flex-col gap-1 font-serif text-[clamp(2.5rem,9vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight sm:gap-1.5 md:flex-row md:gap-x-6">
        <span className="text-[color:var(--accent-soft)] md:text-right">DISCOVER</span>
        <span className="text-[color:var(--fg)]">YOUR</span>
        <span className="text-[color:var(--accent-warm)] md:text-left">POTENTIAL</span>
      </h1>
      <span
        aria-hidden
        className="mt-4 block h-px w-32 bg-[color:var(--fg)]/50 transition-all group-hover:w-48 group-hover:bg-[color:var(--accent)]"
      />
    </div>
  );
}
