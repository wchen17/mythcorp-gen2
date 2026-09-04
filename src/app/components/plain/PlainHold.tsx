'use client';

// Walkthrough: /wc/learn/plain-mode

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { HOLD_ATTR, isHeld } from './holdState';
import { useScramble } from './useScramble';

/**
 * The holding screen. Deliberately almost empty: the statement itself lives
 * in the canvas behind this, so the only DOM here is the wordmark, the two
 * links, and a heading that exists for screen readers and crawlers.
 */
export function PlainHold() {
  const { theme, ready, setTheme } = useTheme();
  const pathname = usePathname() ?? '/';
  const held = isHeld(theme, pathname);
  const [mounted, setMounted] = useState(false);

  // The pre-paint script sets this attribute so the page never flashes its
  // real content. React only takes ownership once the stored theme has been
  // read back: acting a frame earlier would clear it on the default theme
  // and reveal the very page the script just hid.
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    if (held) root.setAttribute(HOLD_ATTR, 'on');
    else root.removeAttribute(HOLD_ATTR);
    setMounted(true);
    return () => {
      root.removeAttribute(HOLD_ATTR);
    };
  }, [held, ready]);

  const wordmark = useScramble('MYTHCORP', { active: held && mounted });

  if (!held) return null;

  return (
    <div className="fixed inset-0 z-10 flex flex-col justify-between p-5 sm:p-8">
      <h1 className="sr-only">Mythcorp, work in progress</h1>

      <span className="font-mono text-xs tracking-[0.45em] text-[color:var(--fg)]">
        {wordmark}
      </span>

      <div className="flex items-end justify-between gap-4 font-mono text-xs">
        <HoldLink href="/contact" label="CONTACT" />
        <button
          type="button"
          onClick={() => setTheme('cyberpunk')}
          className="uppercase tracking-[0.2em] text-[color:var(--fg-subtle)]
                     underline underline-offset-4 transition-colors
                     hover:text-[color:var(--fg)]"
        >
          leave plain mode
        </button>
      </div>
    </div>
  );
}

/** A link that re-decodes its own label on hover. */
function HoldLink({ href, label }: { href: string; label: string }) {
  const [hot, setHot] = useState(false);
  const text = useScramble(label, { active: hot, frames: 20 });
  return (
    <Link
      href={href}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      className="border-b border-[color:var(--fg)] pb-0.5 tracking-[0.3em]
                 text-[color:var(--fg)]"
    >
      {text}
    </Link>
  );
}
