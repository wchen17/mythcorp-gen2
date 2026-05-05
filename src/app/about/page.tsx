'use client';

import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center
                       justify-center px-6 pt-24 pb-16 text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ ABOUT ]
        </p>
        <h1 className="mb-6 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
          Just an idea
        </h1>
        <p className="text-base leading-relaxed text-[color:var(--fg-muted)] md:text-lg">
          MYTHCORP is a passion project, a place to build, learn, and see what&rsquo;s
          possible when you treat a personal site like a sandbox instead of a résumé.
          The 3D scene, the cinematic boot, the theme switcher, everything here is an
          excuse to try something.
        </p>

        <div className="my-10 h-px w-32 bg-[color:var(--border)]" />

        <p className="max-w-md text-sm leading-relaxed text-[color:var(--fg-subtle)]">
          Made in Chicago, with AI as a creative partner. The codebase is annotated for
          anyone who wants to learn from it, see{' '}
          <Link
            href="/will/learn"
            className="text-[color:var(--accent)] underline underline-offset-4
                       hover:text-[color:var(--accent-soft)]"
          >
            /will/learn
          </Link>{' '}
          for walkthroughs of the trickier components.
        </p>
      </main>
    </div>
  );
}
