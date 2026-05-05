'use client';

import { useEffect, useState } from 'react';
import { SiteHeader } from '../components/SiteHeader';

type Category = {
  slug: string;
  name: string;
  emoji: string;
  blurb: string;
};

// FMHY's top-level categories. Source of truth: https://fmhy.net
const CATEGORIES: ReadonlyArray<Category> = [
  { slug: 'adblockvpnguide',     name: 'Adblockers / Privacy', emoji: '🛡', blurb: 'Adblockers, anti-tracking, VPN guides.' },
  { slug: 'storage',             name: 'Storage',              emoji: '📦', blurb: 'Hosting, file storage, transfer.' },
  { slug: 'video',               name: 'Streaming',            emoji: '🎬', blurb: 'Movies, TV, anime, sports.' },
  { slug: 'audio',               name: 'Audio / Music',        emoji: '🎧', blurb: 'Streaming, downloads, podcasts.' },
  { slug: 'gamingpiracyguide',   name: 'Gaming',               emoji: '🎮', blurb: 'Game tools, ROMs, emulation.' },
  { slug: 'edu',                 name: 'Reading / Education',  emoji: '📚', blurb: 'Books, courses, learning resources.' },
  { slug: 'downloadpiracyguide', name: 'Downloads',            emoji: '⬇️', blurb: 'Direct downloads, torrent guides.' },
  { slug: 'android-iosguide',    name: 'Android / iOS',        emoji: '📱', blurb: 'Mobile tweaks, modded apps.' },
  { slug: 'social-media-tools',  name: 'Social Media Tools',   emoji: '💬', blurb: 'Twitter, Reddit, Discord helpers.' },
  { slug: 'ai',                  name: 'AI Tools',             emoji: '✦', blurb: 'Free / open-source AI services.' },
  { slug: 'devtools',            name: 'Developer Tools',      emoji: '⌬', blurb: 'IDEs, APIs, dev resources.' },
  { slug: 'img-tools',           name: 'Image Tools',          emoji: '🖼', blurb: 'Editing, compression, search.' },
  { slug: 'system-tools',        name: 'System Tools',         emoji: '⚙', blurb: 'Windows, Linux, macOS utilities.' },
  { slug: 'beginners-guide',     name: 'Beginners Guide',      emoji: '◎', blurb: "Start here if you're new." },
];

const FMHY_BASE = 'https://fmhy.net';

export default function FmhyPage() {
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // If the iframe never reports `onLoad` within 5s we assume X-Frame-Options
  // blocked it (common) and stop trying to render it.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!iframeLoaded) setIframeBlocked(true);
    }, 5000);
    return () => clearTimeout(t);
  }, [iframeLoaded]);

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 pt-24 pb-16 sm:px-6">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
            [ /FMHY ]
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            FMHY backup
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[color:var(--fg-muted)] sm:text-base">
            A mirror of <a href={FMHY_BASE} target="_blank" rel="noreferrer" className="text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]">fmhy.net</a>, the
            community-curated index of free media tools. The link grid below
            always works. The full embed below it loads if your browser allows it.
          </p>
        </div>

        {/* Category grid: always works, no JS dependency on iframe loading. */}
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <a
                href={`${FMHY_BASE}/${c.slug}`}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-xl border border-[color:var(--border)]
                           bg-[color:var(--bg-elevated)] p-4 transition-all
                           hover:-translate-y-0.5 hover:border-[color:var(--border-strong)]
                           hover:shadow-[0_8px_30px_-15px_var(--accent-glow)]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{c.emoji}</span>
                  <div className="flex-1">
                    <h2 className="font-serif text-lg font-semibold transition-colors
                                   group-hover:text-[color:var(--accent-soft)]">
                      {c.name}
                    </h2>
                    <p className="mt-1 text-xs text-[color:var(--fg-muted)]">{c.blurb}</p>
                  </div>
                  <span aria-hidden className="text-[color:var(--fg-subtle)] transition-colors
                                              group-hover:text-[color:var(--accent)]">↗</span>
                </div>
              </a>
            </li>
          ))}
        </ul>

        {/* Live embed: a bonus when the upstream allows iframing. */}
        <section className="mt-12">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl font-semibold">Live embed</h2>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">
              {iframeBlocked ? 'BLOCKED BY UPSTREAM' : iframeLoaded ? 'LOADED' : 'LOADING…'}
            </span>
          </div>

          {iframeBlocked ? (
            <div className="rounded-xl border border-dashed border-[color:var(--border)]
                            bg-[color:var(--bg-elevated)] p-8 text-center
                            text-sm text-[color:var(--fg-muted)]">
              <p>
                fmhy.net refused to load inside this page. Most likely it sets
                <code className="mx-1 font-mono text-[color:var(--accent-soft)]">X-Frame-Options</code>
                or a strict CSP, which is fair.
              </p>
              <a
                href={FMHY_BASE}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block rounded-md bg-[color:var(--accent)] px-5 py-2
                           font-bold text-sm tracking-wide text-[color:var(--bg)]
                           transition-all hover:scale-[1.03]
                           hover:shadow-[0_0_24px_var(--accent-glow-strong)]"
              >
                OPEN FMHY.NET
              </a>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[color:var(--border)]
                            bg-[color:var(--bg-elevated)]">
              <iframe
                src={FMHY_BASE}
                title="fmhy.net (live embed)"
                className="h-[70vh] w-full"
                onLoad={() => setIframeLoaded(true)}
                referrerPolicy="no-referrer"
                sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms"
              />
            </div>
          )}
        </section>

        <p className="mt-10 text-center text-xs text-[color:var(--fg-subtle)]">
          FMHY is community-maintained. This page just points at it.
          The next upgrade is fetching the upstream markdown at build time so
          search works against the real catalog (see BACKLOG #1).
        </p>
      </main>
    </div>
  );
}
