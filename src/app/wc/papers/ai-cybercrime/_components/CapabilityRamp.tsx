'use client';

import { useState } from 'react';

// Stages anchored to Grace et al. 2024 expert survey timelines.
// "Forecast" stages are explicitly muted in color so the user can
// see where the evidence stops and the projection begins.

type Stage = {
  num: 1 | 2 | 3 | 4;
  label: string;
  yearStart: number;
  yearMid: number;
  yearEnd: number;
  evidenceLevel: 'observed' | 'projected';
  hardRequirements: string[];
  attackerCapability: string;
  exemplar: string;
};

const STAGES: ReadonlyArray<Stage> = [
  {
    num: 1,
    label: 'Unreliable Agent',
    yearStart: 2024, yearMid: 2025, yearEnd: 2026,
    evidenceLevel: 'observed',
    hardRequirements: [
      'follows ~5-step plans with human supervision',
      'recovers from simple errors when prompted',
      'no persistent long-term memory',
    ],
    attackerCapability: 'drafts phishing emails, generates malware variants, but needs a human in the loop',
    exemplar: 'GPT-4o, GPT-5, Manus AI, WormGPT (criminal variant)',
  },
  {
    num: 2,
    label: 'Reliable Agent',
    yearStart: 2026, yearMid: 2028, yearEnd: 2029,
    evidenceLevel: 'projected',
    hardRequirements: [
      'plans 10+ sub-tasks autonomously',
      '80%+ task success rate without intervention',
      'short-term memory and basic tool selection',
    ],
    attackerCapability: 'builds and runs a payment-processing site end-to-end; chains tools across an attack',
    exemplar: 'expert survey: 50% chance of autonomous site construction by 2028',
  },
  {
    num: 3,
    label: 'Superhuman Coder',
    yearStart: 2027, yearMid: 2030, yearEnd: 2032,
    evidenceLevel: 'projected',
    hardRequirements: [
      'long-horizon planning across days',
      'self-improving code generation and review',
      'novel exploit synthesis from primitives',
    ],
    attackerCapability: 'discovers novel vulnerabilities and writes the exploit chain in one pass',
    exemplar: 'expert survey: 50% chance of autonomous model fine-tuning by 2028',
  },
  {
    num: 4,
    label: 'Superhuman Attacker',
    yearStart: 2030, yearMid: 2040, yearEnd: 2047,
    evidenceLevel: 'projected',
    hardRequirements: [
      'general superintelligence on offensive tasks',
      'cross-domain synthesis (cyber + social + physical)',
      'alignment becomes the dominant unknown',
    ],
    attackerCapability: 'campaign-level autonomy; the attacker is the AI, the human just initiates',
    exemplar: 'expert survey: 50% chance of HLMI by 2047 (down from 2060 in 2022)',
  },
];

const TIMELINE_START = 2024;
const TIMELINE_END = 2047;

export function CapabilityRamp() {
  const [year, setYear] = useState(2025);

  const activeStage =
    STAGES.find((s) => year >= s.yearStart && year < s.yearEnd) ?? STAGES[STAGES.length - 1];

  return (
    <div className="themed-surface mt-6 p-5">
      {/* Year scrubber */}
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--fg-muted)]">
          year
        </span>
        <span className="font-serif text-3xl font-bold text-[color:var(--accent)]">{year}</span>
      </div>
      <input
        type="range"
        min={TIMELINE_START}
        max={TIMELINE_END}
        value={year}
        onChange={(e) => setYear(parseInt(e.target.value, 10))}
        className="mt-3 w-full accent-[color:var(--accent)]"
      />
      <div className="mt-1 flex justify-between font-mono text-[10px] text-[color:var(--fg-subtle)]">
        <span>{TIMELINE_START}</span>
        <span>{TIMELINE_END}</span>
      </div>

      {/* Stage track */}
      <div className="relative mt-6 flex h-12">
        {STAGES.map((s) => {
          const widthPct = ((s.yearEnd - s.yearStart) / (TIMELINE_END - TIMELINE_START)) * 100;
          const leftPct = ((s.yearStart - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * 100;
          const isActive = s.num === activeStage.num;
          const observed = s.evidenceLevel === 'observed';
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => setYear(s.yearMid)}
              className="absolute top-0 flex h-full items-center justify-center rounded
                         text-[10px] font-mono uppercase tracking-widest transition-all"
              style={{
                left: `${leftPct}%`,
                width: `${widthPct}%`,
                background: observed
                  ? 'color-mix(in oklab, var(--accent) 55%, transparent)'
                  : 'color-mix(in oklab, var(--fg-muted) 25%, transparent)',
                color: observed ? 'var(--bg)' : 'var(--fg-muted)',
                opacity: isActive ? 1 : 0.5,
                outline: isActive ? '2px solid var(--accent)' : 'none',
                outlineOffset: '2px',
              }}
            >
              S{s.num}
            </button>
          );
        })}
      </div>

      {/* Active stage detail */}
      <div className="mt-8">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
            stage {activeStage.num}
          </span>
          <h3 className="font-serif text-xl font-semibold sm:text-2xl">
            {activeStage.label}
          </h3>
          <span className={[
            'rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest',
            activeStage.evidenceLevel === 'observed'
              ? 'bg-[color:var(--accent)]/15 text-[color:var(--accent)]'
              : 'bg-[color:var(--fg-muted)]/15 text-[color:var(--fg-muted)]',
          ].join(' ')}>
            {activeStage.evidenceLevel}
          </span>
        </div>

        <p className="mt-3 text-sm text-[color:var(--fg)] sm:text-base">
          {activeStage.attackerCapability}
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--fg-muted)]">
              hard requirements
            </p>
            <ul className="mt-2 space-y-1 text-xs text-[color:var(--fg-muted)] sm:text-sm">
              {activeStage.hardRequirements.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-[color:var(--accent)]">›</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--fg-muted)]">
              anchor
            </p>
            <p className="mt-2 text-xs text-[color:var(--fg-muted)] sm:text-sm">
              {activeStage.exemplar}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-[color:var(--fg-subtle)]">
        Stages 2-4 are projections; Stage 1 is observed. Timelines anchored to{' '}
        <a
          href="https://wiki.aiimpacts.org/ai_timelines/predictions_of_human-level_ai_timelines/2023_expert_survey_on_progress_in_ai"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 hover:text-[color:var(--accent)]"
        >
          Grace et al. 2024
        </a>
        .
      </p>
    </div>
  );
}
