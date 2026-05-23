'use client';

import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';

export default function WcAboutPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 pt-24 pb-20">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ /wc/about ]
        </p>
        <h1 className="themed-heading mt-3 text-4xl font-semibold md:text-5xl">
          Who, and why
        </h1>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-[color:var(--fg-muted)]">
          <p>
            I&rsquo;m Will Chen (Weibao Chen), an undergrad who spends most of his
            curiosity on where AI is heading, the safety questions and the security
            side especially. The first paper here, on AI and cybercrime capability,
            is where that interest shows up most directly.
          </p>

          <p>
            MYTHCORP is not a company. It started as a name for a sandbox and grew
            into a place to build in public. The 3D scene, the cinematic boot, the
            three-way theme system, none of it is strictly necessary, and that is the
            point. A personal site is the rare project with no spec, so it is a good
            place to try things that would be hard to justify anywhere else.
          </p>
        </div>

        <section className="mt-12">
          <h2 className="font-serif text-xl font-semibold text-[color:var(--fg)]">
            Why it is built in the open
          </h2>
          <p className="mt-3 leading-relaxed text-[color:var(--fg-muted)]">
            The codebase is meant to be read, not just run. The trickier parts get
            annotated and explained on{' '}
            <Link
              href="/wc/learn"
              className="text-[color:var(--accent)] underline underline-offset-4
                         hover:text-[color:var(--accent-soft)]"
            >
              /wc/learn
            </Link>
            , where the explanation sits next to a live demo of the thing it explains.
            The theory is that a site can be both a finished thing and a worked example
            at the same time.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-[color:var(--fg)]">
            What is coming
          </h2>
          <p className="mt-3 leading-relaxed text-[color:var(--fg-muted)]">
            More papers in{' '}
            <Link
              href="/wc/papers"
              className="text-[color:var(--accent)] underline underline-offset-4
                         hover:text-[color:var(--accent-soft)]"
            >
              /wc/papers
            </Link>
            , more walkthroughs, and a steady backlog of experiments that wander between
            useful and purely for fun. If something here makes you wonder how it was
            built, that reaction is the whole reason it exists.
          </p>
        </section>

        <div className="my-12 h-px w-32 bg-[color:var(--border)]" />

        <p className="text-sm text-[color:var(--fg-subtle)]">
          Made in Chicago, with AI as a creative partner.{' '}
          <Link
            href="/wc"
            className="text-[color:var(--accent)] underline underline-offset-4
                       hover:text-[color:var(--accent-soft)]"
          >
            ← Back to the workshop
          </Link>
        </p>
      </main>
    </div>
  );
}
