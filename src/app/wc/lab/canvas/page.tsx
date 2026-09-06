import type { Metadata } from 'next';
import { SiteHeader } from '../../../components/SiteHeader';
import { CanvasLab } from './_components/CanvasLab';

export const metadata: Metadata = {
  title: 'Canvas bench',
  description:
    'Every vendored Canvas UI component on one bench: pick one, turn its props, and see what your browser can actually run.',
};

export default function CanvasLabPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 pt-24 pb-24">
        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
            [ /wc / lab / canvas ]
          </p>
          <h1 className="themed-heading mt-3 text-4xl font-semibold md:text-6xl">
            The canvas bench
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[color:var(--fg-muted)] md:text-lg">
            Nineteen vendored components sit in this repo, roughly twenty-one thousand lines
            of them, and until now exactly one screen showed any of it. This is the
            bench: pick one off the roster, it loads on demand, and the panel under
            the stage turns its real props. Nothing here is a screenshot.
          </p>
        </header>

        <div className="mt-14">
          <CanvasLab />
        </div>
      </main>
    </div>
  );
}
