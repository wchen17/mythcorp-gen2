'use client';

import { useMemo, useState } from 'react';
import { useHtmlInCanvas, usePrefersReducedMotion } from './browserProbes';
import { CANVAS_ENTRIES, defaultsFor, entryById, type PropValue, type PropValues } from './manifest';
import { ControlPanel } from './ControlPanel';
import { PropSnippet } from './PropSnippet';
import { Roster } from './Roster';
import { Stage } from './Stage';
import { StageReadout } from './StageReadout';
import { useTokenInk } from './tokenInk';

export function CanvasLab() {
  const ink = useTokenInk();
  const htmlInCanvas = useHtmlInCanvas();
  const calm = usePrefersReducedMotion();

  const [selected, setSelected] = useState<string | null>(null);
  // Tweaks survive a trip to another component and back. Keyed by id, seeded
  // lazily, so nothing exists for a component that was never opened.
  const [tweaks, setTweaks] = useState<Record<string, PropValues>>({});

  const entry = selected ? entryById(selected) : undefined;
  const defaults = useMemo(() => (entry ? defaultsFor(entry, calm) : {}), [entry, calm]);
  const values: PropValues = entry ? { ...defaults, ...tweaks[entry.id] } : {};

  const setValue = (name: string, value: PropValue) => {
    if (!entry) return;
    setTweaks((all) => ({ ...all, [entry.id]: { ...all[entry.id], [name]: value } }));
  };

  const reset = () => {
    if (!entry) return;
    setTweaks((all) => {
      const next = { ...all };
      delete next[entry.id];
      return next;
    });
  };

  const inert = Boolean(entry?.needsHtmlInCanvas) && htmlInCanvas === false;
  const slot = entry ? CANVAS_ENTRIES.indexOf(entry) + 1 : 0;

  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
      <div className="flex flex-col gap-8">
        <Roster selected={selected} onSelect={setSelected} htmlInCanvas={htmlInCanvas} />
        <FlagNotice htmlInCanvas={htmlInCanvas} />
      </div>

      <div className="relative flex min-w-0 flex-col gap-6">
        {/* The one deliberate oddity: the slot number set oversized in the
            display face, hanging out of the column and clipped by it. */}
        {entry ? (
          <span
            aria-hidden
            className="themed-heading pointer-events-none absolute -top-12 z-10 hidden
                       text-[7rem] leading-none text-[color:var(--accent)]
                       opacity-20 lg:-left-24 lg:block"
          >
            {String(slot).padStart(2, '0')}
          </span>
        ) : null}

        <StageReadout entry={entry} htmlInCanvas={htmlInCanvas} calm={calm} />

        <div className="themed-surface overflow-hidden">
          {entry ? (
            <Stage entry={entry} values={values} ink={ink} calm={calm} inert={inert} />
          ) : (
            <EmptyStage />
          )}
        </div>

        {entry ? (
          <>
            <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--fg-muted)]">
              {entry.blurb}
            </p>
            <ControlPanel
              entry={entry}
              values={values}
              ink={ink}
              onChange={setValue}
              onReset={reset}
            />
            <PropSnippet entry={entry} values={values} />
          </>
        ) : null}
      </div>
    </div>
  );
}

function EmptyStage() {
  return (
    <div className="flex h-[24rem] flex-col items-center justify-center gap-3 px-8
                    text-center sm:h-[28rem]">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--fg-subtle)]">
        stage empty
      </p>
      <p className="max-w-sm text-sm leading-relaxed text-[color:var(--fg-muted)]">
        Nothing is loaded yet. Each of these is about a megabyte of WebGL with its
        own loader stack, so the lab fetches one only when you name it, and runs
        one at a time.
      </p>
    </div>
  );
}

function FlagNotice({ htmlInCanvas }: { htmlInCanvas: boolean | null }) {
  if (htmlInCanvas === null) {
    return (
      <p className="font-mono text-[11px] leading-relaxed text-[color:var(--fg-subtle)]">
        checking this browser
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2 border-t border-[color:var(--border)] pt-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
        html-in-canvas
      </p>
      <p className="text-xs leading-relaxed text-[color:var(--fg-muted)]">
        {htmlInCanvas
          ? 'Your browser has it. Every effect above resamples the real page, so the text under them stays selectable and the links stay live.'
          : 'Your browser does not have it. The four marked entries mount and degrade to plain content instead of the effect. Chrome can turn it on at chrome://flags/#canvas-draw-element, and a site running the origin trial gets it without asking.'}
      </p>
    </div>
  );
}
