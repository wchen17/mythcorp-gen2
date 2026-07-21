'use client';

// Walkthrough: /wc/learn/build-a-playground

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { MiniStarSettings } from './MiniStarField';

// R3F touches window/WebGL at import time, so it can't render on the server.
// Loading it with ssr:false (plus a height-matched skeleton so the article
// doesn't jump when the canvas swaps in) keeps hydration clean.
const MiniStarField = dynamic(
  () => import('./MiniStarField').then((m) => m.MiniStarField),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[280px] place-items-center rounded-md border
                      border-[color:var(--border)] bg-[color:var(--bg)]
                      font-mono text-xs text-[color:var(--fg-subtle)]">
        booting canvas...
      </div>
    ),
  },
);

const MINI_DEFAULTS: MiniStarSettings = { stars: 2, speed: 1, color: '#00ffff' };

// Fresh object on every call. Handing setState the module-level MINI_DEFAULTS
// directly would let React bail out when you reset twice in a row (same
// reference, no state change), the exact bug the full Simulation had with its
// shared DEFAULTS.position array.
const getMiniDefaults = (): MiniStarSettings => ({ ...MINI_DEFAULTS });

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex justify-between text-[color:var(--fg-muted)]">
        <span>{label}</span>
        <span className="font-mono text-[color:var(--fg-subtle)]">{value.toFixed(1)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-lg accent-[color:var(--accent)]"
        style={{ background: 'color-mix(in srgb, var(--bg) 60%, transparent)' }}
      />
    </label>
  );
}

export function MiniStarFieldDemo() {
  const [settings, setSettings] = useState<MiniStarSettings>(getMiniDefaults);

  const set = <K extends keyof MiniStarSettings>(k: K, v: MiniStarSettings[K]) =>
    setSettings((s) => ({ ...s, [k]: v }));

  return (
    <div className="flex flex-col gap-4">
      <div className="h-[280px] overflow-hidden rounded-md border border-[color:var(--border)]">
        <MiniStarField settings={settings} />
      </div>

      <div className="flex flex-col gap-3">
        <Slider
          label="Star density"
          value={settings.stars}
          min={0}
          max={6}
          step={0.1}
          onChange={(v) => set('stars', v)}
        />
        <Slider
          label="Drift speed"
          value={settings.speed}
          min={0}
          max={3}
          step={0.1}
          onChange={(v) => set('speed', v)}
        />
        <label className="flex items-center gap-3 text-sm text-[color:var(--fg-muted)]">
          <span className="w-24">Shape color</span>
          <input
            type="text"
            value={settings.color}
            onChange={(e) => set('color', e.target.value)}
            className="flex-1 rounded-[var(--radius-sm)] border border-[color:var(--border)]
                       bg-[color:var(--bg)] p-1.5 font-mono text-sm text-[color:var(--fg)]
                       focus:border-[color:var(--accent)] focus:outline-none"
          />
        </label>
      </div>

      <button
        onClick={() => setSettings(getMiniDefaults())}
        className="themed-pill self-start px-4 py-1.5 text-sm text-[color:var(--fg-muted)]
                   hover:text-[color:var(--fg)]"
      >
        [ ↺ reset ]
      </button>
    </div>
  );
}
