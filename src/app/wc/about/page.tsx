import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';

const TIMELINE = [
  {
    year: '2024',
    items: [
      'Started MYTHCORP as a personal sandbox to learn modern web tech.',
      'First paper: AI + cybercrime capability landscape (undergrad seminar origin).',
    ],
  },
  {
    year: '2025',
    items: [
      'Rebuilt with a proper theme system, 3D boot sequence, and interactive papers.',
      'FMHY backup mirror added.',
      '22 backlog items queued as GitHub Issues.',
    ],
  },
];

export const metadata = {
  title: 'About, MYTHCORP /wc',
  description: 'Will (Weibao) Chen, undergrad working on AI safety and cybersecurity.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-4 pt-24 pb-16 sm:px-6">
        <nav className="text-xs text-[color:var(--fg-subtle)]">
          <Link href="/wc" className="hover:text-[color:var(--accent)]">
            /wc
          </Link>
          <span className="mx-2">›</span>
          <span className="text-[color:var(--fg-muted)]">about</span>
        </nav>

        <div className="mt-6">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
            [ /wc/about ]
          </p>
          <h1 className="themed-heading mt-3 text-3xl font-semibold sm:text-4xl">Will Chen</h1>
          <p className="mt-1 font-mono text-sm text-[color:var(--fg-muted)]">Weibao Chen</p>
        </div>

        <section className="mt-10 space-y-4 text-sm leading-relaxed text-[color:var(--fg-muted)] sm:text-base">
          <p>
            Undergrad studying computer science with a focus on AI safety and cybersecurity.
            Currently building things, writing about them, and figuring out how the field changes
            when AI can help with both offense and defense.
          </p>
          <p>
            MYTHCORP started as a personal sandbox to learn Next.js, three.js, and Cloudflare
            Workers. It became a portfolio, a lab, and a home for long-form writing that does not
            fit anywhere else. The first paper came out of an undergrad seminar and got enough
            pushback to turn into something more careful.
          </p>
          <p>
            The site is intentionally a little weird. Three themes, a 3D boot sequence, a Konami
            code. Part of learning is making something that reflects how you think, not just what
            you know.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="themed-heading text-xl font-semibold">Timeline</h2>
          <div className="mt-5 space-y-6">
            {TIMELINE.map((t) => (
              <div key={t.year} className="flex gap-5">
                <div className="w-12 shrink-0 pt-0.5 font-mono text-xs text-[color:var(--accent-soft)]">
                  {t.year}
                </div>
                <ul className="flex-1 space-y-2">
                  {t.items.map((item, i) => (
                    <li key={i} className="text-sm text-[color:var(--fg-muted)]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="themed-heading text-xl font-semibold">Links</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <a
                href="https://github.com/wchen17"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]"
              >
                github.com/wchen17
              </a>
            </li>
          </ul>
        </section>

        <footer className="mt-16 border-t border-[color:var(--border)] pt-6 text-xs text-[color:var(--fg-subtle)]">
          <Link
            href="/wc"
            className="text-[color:var(--accent)] underline underline-offset-4"
          >
            ← back to /wc
          </Link>
        </footer>
      </main>
    </div>
  );
}
