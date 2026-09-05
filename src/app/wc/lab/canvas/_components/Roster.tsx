'use client';

import { CANVAS_ENTRIES, type CanvasEntry } from './manifest';

interface RosterProps {
  selected: string | null;
  onSelect: (id: string) => void;
  /** null while the probe has not run. */
  htmlInCanvas: boolean | null;
}

const GROUPS: ReadonlyArray<{ subject: CanvasEntry['subject']; title: string; note: string }> = [
  {
    subject: 'page',
    title: 'page effects',
    note: 'These wrap live DOM and redraw it. The specimen block is their subject.',
  },
  {
    subject: 'object',
    title: 'object renderers',
    note: 'These load a GLB. The subject is spectre.glb, the same model the lab uses everywhere.',
  },
];

export function Roster({ selected, onSelect, htmlInCanvas }: RosterProps) {
  return (
    <nav aria-label="Component roster" className="flex flex-col gap-8">
      {GROUPS.map((group) => (
        <div key={group.subject} className="flex flex-col gap-2">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
            {group.title}
          </h2>
          <p className="mb-1 text-xs leading-relaxed text-[color:var(--fg-subtle)]">
            {group.note}
          </p>

          <ul className="flex flex-col">
            {CANVAS_ENTRIES.filter((e) => e.subject === group.subject).map((entry) => {
              const inert = entry.needsHtmlInCanvas && htmlInCanvas === false;
              const active = entry.id === selected;
              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(entry.id)}
                    aria-pressed={active}
                    className={[
                      'group flex w-full items-baseline gap-3 border-b py-2 text-left',
                      'border-[color:var(--border)] transition-colors',
                      'duration-[var(--motion-fast)] ease-[var(--motion-ease)]',
                      active
                        ? 'text-[color:var(--fg)]'
                        : 'text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]',
                    ].join(' ')}
                  >
                    <span
                      aria-hidden
                      className={[
                        'font-mono text-[10px]',
                        active ? 'text-[color:var(--accent)]' : 'text-[color:var(--fg-subtle)]',
                      ].join(' ')}
                    >
                      {active ? '>' : ' '}
                    </span>
                    <span className="flex-1 font-mono text-sm tracking-[0.06em]">
                      {entry.name}
                    </span>
                    {inert ? (
                      <span className="font-mono text-[9px] uppercase tracking-[0.24em]
                                       text-[color:var(--accent-warm)]">
                        inert here
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
