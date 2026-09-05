'use client';

import type { CanvasEntry, PropSpec, PropValue, PropValues } from './manifest';
import { COLOR_TOKENS, type ColorToken, type TokenInk } from './tokenInk';

interface ControlPanelProps {
  entry: CanvasEntry;
  values: PropValues;
  ink: TokenInk;
  onChange: (name: string, value: PropValue) => void;
  onReset: () => void;
}

export function ControlPanel({ entry, values, ink, onChange, onReset }: ControlPanelProps) {
  return (
    <section aria-label={`${entry.name} controls`} className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
          controls
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="font-mono text-[11px] tracking-[0.16em] text-[color:var(--fg-subtle)]
                     transition-colors hover:text-[color:var(--fg)]"
        >
          [ back to defaults ]
        </button>
      </div>

      <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {entry.props.map((spec) => (
          <Control
            key={spec.name}
            spec={spec}
            value={values[spec.name] ?? spec.def}
            ink={ink}
            onChange={onChange}
          />
        ))}
      </div>
    </section>
  );
}

function Control({
  spec,
  value,
  ink,
  onChange,
}: {
  spec: PropSpec;
  value: PropValue;
  ink: TokenInk;
  onChange: (name: string, value: PropValue) => void;
}) {
  const id = `ctl-${spec.name}`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-[color:var(--fg-muted)]">{spec.label}</span>
        <span className="font-mono text-[10px] text-[color:var(--fg-subtle)]">{spec.name}</span>
      </label>

      {spec.kind === 'number' ? (
        <div className="flex items-center gap-3">
          <input
            id={id}
            type="range"
            min={spec.min}
            max={spec.max}
            step={spec.step}
            value={Number(value)}
            onChange={(e) => onChange(spec.name, Number(e.target.value))}
            className="h-1 w-full cursor-pointer rounded-full
                       [accent-color:var(--accent)]"
          />
          <output className="w-14 shrink-0 text-right font-mono text-xs text-[color:var(--fg)]">
            {Number(value)}
          </output>
        </div>
      ) : null}

      {spec.kind === 'boolean' ? (
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          onClick={() => onChange(spec.name, !value)}
          className="themed-pill self-start px-3 py-1 font-mono text-[11px]
                     tracking-[0.16em] text-[color:var(--fg-muted)]
                     hover:text-[color:var(--fg)]"
        >
          {value ? 'on' : 'off'}
        </button>
      ) : null}

      {spec.kind === 'select' ? (
        <select
          id={id}
          value={String(value)}
          onChange={(e) => onChange(spec.name, e.target.value)}
          className="w-full rounded-[var(--radius-sm)] border border-[color:var(--border)]
                     bg-[color:var(--bg)] px-2 py-1.5 text-sm text-[color:var(--fg)]"
        >
          {spec.options.map((opt) => (
            <option key={opt.label} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : null}

      {/* Colour is a token picker, not a colour picker. A literal would freeze
          the effect at whatever the palette was when it mounted. */}
      {spec.kind === 'color' ? (
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-5 w-5 shrink-0 rounded-[var(--radius-sm)] border border-[color:var(--border)]"
            style={{ background: `var(${value as ColorToken})` }}
          />
          <select
            id={id}
            value={String(value)}
            onChange={(e) => onChange(spec.name, e.target.value)}
            className="w-full rounded-[var(--radius-sm)] border border-[color:var(--border)]
                       bg-[color:var(--bg)] px-2 py-1.5 text-sm text-[color:var(--fg)]"
          >
            {COLOR_TOKENS.map((t) => (
              <option key={t.token} value={t.token}>{t.label}</option>
            ))}
          </select>
          <span className="w-16 shrink-0 text-right font-mono text-[10px] text-[color:var(--fg-subtle)]">
            {ink[value as ColorToken] || String(value)}
          </span>
        </div>
      ) : null}
    </div>
  );
}
