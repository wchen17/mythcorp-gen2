import { SiteHeader } from '../components/SiteHeader';
import { DraftBanner } from '../components/DraftBanner';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 pt-28 pb-20 sm:pl-16">
        <DraftBanner note="This room is still taking shape." />
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ ABOUT / WIP ]
        </p>
        <h1 className="themed-heading mt-3 text-4xl font-semibold md:text-5xl">
          Under construction
        </h1>
        <p className="mt-5 max-w-sm text-base leading-relaxed text-[color:var(--fg-muted)] md:text-lg">
          More soon.
        </p>
      </main>
    </div>
  );
}
