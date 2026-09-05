'use client';

import { useEffect, useState } from 'react';
import type { CanvasEntry, PropValues } from './manifest';

/**
 * The stage, written out as the JSX that would produce it. Colours print as
 * `ink('--token')` rather than a frozen hex, because that is the shape the
 * repo actually wants: read the token, hand the component the value, do it
 * again when the theme changes.
 */
function toSnippet(entry: CanvasEntry, values: PropValues): string {
  const lines = entry.props.map((spec) => {
    const value = values[spec.name] ?? spec.def;
    if (spec.kind === 'color') {
      const call = `ink('${String(value)}')`;
      return `  ${spec.name}={${spec.format === 'rgb01' ? `unit(${call})` : call}}`;
    }
    if (spec.kind === 'select') return `  ${spec.name}=${JSON.stringify(String(value))}`;
    if (spec.kind === 'boolean') return `  ${spec.name}={${String(value)}}`;
    return `  ${spec.name}={${Number(value)}}`;
  });

  if (entry.subject === 'object') {
    return [`<${entry.name}`, '  src="/spectre.glb"', ...lines, '/>'].join('\n');
  }
  return [`<${entry.name}`, ...lines, '>', '  <YourContent />', `</${entry.name}>`].join('\n');
}

export function PropSnippet({ entry, values }: { entry: CanvasEntry; values: PropValues }) {
  const text = toSnippet(entry, values);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = () => {
    navigator.clipboard?.writeText(text).then(() => setCopied(true), () => setCopied(false));
  };

  return (
    <section aria-label="Current props as JSX" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
          as written
        </h2>
        <button
          type="button"
          onClick={copy}
          className="font-mono text-[11px] tracking-[0.16em] text-[color:var(--fg-subtle)]
                     transition-colors hover:text-[color:var(--fg)]"
        >
          {copied ? '[ copied ]' : '[ copy ]'}
        </button>
      </div>

      <pre className="overflow-x-auto rounded-[var(--radius-sm)] border
                      border-[color:var(--border)] bg-[color:var(--bg)] p-4
                      font-mono text-[11px] leading-relaxed text-[color:var(--fg-muted)]">
        <code>{text}</code>
      </pre>

      <p className="text-xs text-[color:var(--fg-subtle)]">
        <code className="font-mono">ink</code> reads a theme token off the computed root
        style, <code className="font-mono">unit</code> turns the hex into the 0 to 1 triple
        the WebGL props want. Both live in{' '}
        <code className="font-mono">_components/tokenInk.ts</code>.
      </p>
    </section>
  );
}
