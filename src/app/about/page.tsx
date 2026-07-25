import { SiteHeader } from '../components/SiteHeader';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto grid max-w-5xl gap-10 px-6 pt-28 pb-20 md:grid-cols-[minmax(0,1fr)_11rem] md:items-end">
        <section>
          {/* Deliberately near-empty. The room is not written yet and does not pretend to be. */}
          <h1 className="sr-only">About</h1>
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">
            [ about / wip ]
          </p>
        </section>

        <aside className="border-t border-[color:var(--border)] pt-4 font-mono text-xs leading-relaxed text-[color:var(--fg-subtle)] md:mb-3">
          <p className="text-[color:var(--accent-warm)]">STATUS: IN PROGRESS</p>
        </aside>
      </main>
    </div>
  );
}
