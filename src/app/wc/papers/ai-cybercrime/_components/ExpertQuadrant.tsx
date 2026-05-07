'use client';

import { useState } from 'react';

// Expert positions paraphrased from Tables 6 and 7 of the source paper.
// Two axes: AI's expected impact on offensive vs defensive capability.
// Click any quadrant to read each expert's argument summary.

type Stance = 'optimist' | 'pessimist' | 'cautious' | 'structural';

type Expert = {
  id: Stance;
  name: string;
  affiliation: string;
  offense: number; // 0-10
  defense: number; // 0-10
  argument: string;
};

const EXPERTS: ReadonlyArray<Expert> = [
  {
    id: 'optimist',
    name: 'Sam Altman',
    affiliation: 'OpenAI',
    offense: 6,
    defense: 9,
    argument:
      'Defense scales faster than offense once large models are deployed by good actors. Iteration speed and capital favour the defenders.',
  },
  {
    id: 'pessimist',
    name: 'Geoffrey Hinton',
    affiliation: 'Toronto / ex-Google',
    offense: 9,
    defense: 4,
    argument:
      'Capability gains arrive faster than alignment can keep up. Once an attacker has agentic tools, asymmetry favours the offence.',
  },
  {
    id: 'cautious',
    name: 'Yann LeCun',
    affiliation: 'Meta FAIR',
    offense: 5,
    defense: 6,
    argument:
      'Current LLMs are not the existential lever critics fear. The risk profile changes when planning and memory hit Stage 3, not before.',
  },
  {
    id: 'structural',
    name: 'Meredith Whittaker',
    affiliation: 'Signal',
    offense: 8,
    defense: 5,
    argument:
      'The structural problem is concentration of compute. A few firms set both the threat surface and the defensive playbook, which is itself the risk.',
  },
];

export function ExpertQuadrant() {
  const [selected, setSelected] = useState<Stance | null>(null);

  return (
    <div className="themed-surface mt-6 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
        expert positions
      </p>
      <p className="mt-1 text-xs text-[color:var(--fg-muted)]">
        click any quadrant for the argument summary
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {EXPERTS.map((e) => {
          const active = selected === e.id;
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => setSelected(active ? null : e.id)}
              aria-pressed={active}
              className={[
                'themed-surface themed-surface-interactive flex flex-col items-start gap-2 p-4 text-left transition-transform',
                active ? 'scale-[1.01]' : '',
              ].join(' ')}
            >
              <div className="flex w-full items-baseline justify-between">
                <span className="font-serif text-base font-semibold text-[color:var(--fg)]">
                  {e.name}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">
                  {e.affiliation}
                </span>
              </div>
              <Bars offense={e.offense} defense={e.defense} />
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-overlay)] p-4 text-sm leading-relaxed text-[color:var(--fg)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
            argument summary
          </p>
          <p className="mt-2">{EXPERTS.find((e) => e.id === selected)?.argument}</p>
        </div>
      )}

      <p className="mt-5 text-xs text-[color:var(--fg-subtle)]">
        Sources: paraphrased from Tables 6 and 7 of the source paper. Stances are
        my reading of public statements, not verbatim quotes.
      </p>
    </div>
  );
}

function Bars({ offense, defense }: { offense: number; defense: number }) {
  return (
    <div className="w-full space-y-2">
      <Bar label="offence" value={offense} tone="warm" />
      <Bar label="defence" value={defense} tone="cool" />
    </div>
  );
}

function Bar({ label, value, tone }: { label: string; value: number; tone: 'warm' | 'cool' }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-muted)]">
          {label}
        </span>
        <span className="font-mono text-[10px] text-[color:var(--fg-subtle)]">{value}/10</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--bg)]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${(value / 10) * 100}%`,
            background: tone === 'warm' ? 'var(--accent-warm)' : 'var(--accent)',
            transition: 'width 500ms cubic-bezier(0.34, 1.2, 0.4, 1)',
          }}
        />
      </div>
    </div>
  );
}
