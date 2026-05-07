'use client';

import { useEffect, useRef, useState } from 'react';

// Attack-chain step diagram. Walks through a real-world heist (Hong Kong CFO
// case, Feb 2024, 25M USD) one step at a time. Each step is tagged with
// whether AI was involved at that step in the actual incident.

type Role = 'human' | 'ai-assist' | 'ai-only';

type Step = {
  title: string;
  detail: string;
  role: Role;
};

const STEPS: ReadonlyArray<Step> = [
  {
    title: 'Reconnaissance',
    detail:
      'Attackers identify a multinational with a remote CFO and pull video assets from earnings calls, interviews, conference panels.',
    role: 'human',
  },
  {
    title: 'Voice + face training',
    detail:
      'Public footage is fed into a deepfake pipeline. Output: a real-time avatar that speaks and reacts as the CFO, plus voice clones of two other executives.',
    role: 'ai-only',
  },
  {
    title: 'Pretext lure',
    detail:
      'A finance employee receives a normal-looking calendar invite. Sender impersonation is human craft; LLM polish helps with tone matching to the CFO.',
    role: 'ai-assist',
  },
  {
    title: 'Live video meeting',
    detail:
      'Multiple "executives" join the call, all running on the same deepfake stack. The employee asks a clarifying question; the avatar answers in real time.',
    role: 'ai-only',
  },
  {
    title: 'Wire transfer authorization',
    detail:
      'Authorization happens through normal banking channels. No AI in the loop here, just trust earned during the call.',
    role: 'human',
  },
  {
    title: 'Cash-out',
    detail:
      '25M USD spread across 15 transactions to local accounts. Money laundering remains a human-craft problem.',
    role: 'human',
  },
];

const ROLE_BADGE: Record<Role, { label: string; tone: string }> = {
  'human': { label: 'human-only', tone: 'var(--fg-muted)' },
  'ai-assist': { label: 'ai-assisted', tone: 'var(--accent-warm)' },
  'ai-only': { label: 'ai end-to-end', tone: 'var(--accent)' },
};

export function AttackChain() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  // Reveal-on-view so the chain feels like it builds when you scroll to it.
  useEffect(() => {
    if (!ref.current || revealed) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setRevealed(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [revealed]);

  const step = STEPS[active];
  const badge = ROLE_BADGE[step.role];

  return (
    <div ref={ref} className="themed-surface mt-6 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
        case study, hong kong, feb 2024
      </p>
      <p className="mt-1 text-xs text-[color:var(--fg-muted)]">
        click any step to expand. tag colour shows where AI did the work.
      </p>

      <ol className="mt-6 grid gap-3 sm:grid-cols-3 md:grid-cols-6">
        {STEPS.map((s, i) => {
          const isActive = i === active;
          const stepBadge = ROLE_BADGE[s.role];
          return (
            <li key={s.title}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className="relative flex w-full flex-col items-start gap-1 rounded-md border p-3 text-left transition-all"
                style={{
                  borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                  background: isActive ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? 'translateY(0)' : 'translateY(8px)',
                  transition: `opacity 320ms var(--motion-ease) ${i * 70}ms, transform 320ms var(--motion-ease) ${i * 70}ms, border-color 200ms ease, background 200ms ease`,
                }}
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">
                  step {i + 1}
                </span>
                <span className="font-serif text-sm font-semibold text-[color:var(--fg)]">
                  {s.title}
                </span>
                <span
                  className="font-mono text-[9px] uppercase tracking-widest"
                  style={{ color: stepBadge.tone }}
                >
                  {stepBadge.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-overlay)] p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold text-[color:var(--fg)]">
            {step.title}
          </h3>
          <span
            className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: badge.tone, borderColor: badge.tone }}
          >
            {badge.label}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--fg-muted)]">{step.detail}</p>
      </div>

      <p className="mt-5 text-xs text-[color:var(--fg-subtle)]">
        Sources: CNN Feb 2024, plus the source paper&rsquo;s Section 5 case
        breakdown. Step-level attribution is my own analysis.
      </p>
    </div>
  );
}
