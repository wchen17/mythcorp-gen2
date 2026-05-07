'use client';

import { useState } from 'react';
import { THEMES, useTheme, type ThemePreference } from '../contexts/ThemeContext';

const THEME_GLYPH: Record<Exclude<ThemePreference, 'auto'>, string> = {
  cyberpunk: '◢',
  luxury: '◆',
  paper: '◯',
};

// Auto picks a sun (daytime) or moon (night) glyph based on the resolved theme.
function autoGlyph(resolved: 'cyberpunk' | 'luxury' | 'paper'): string {
  return resolved === 'cyberpunk' ? '☾' : '☀';
}

function glyphFor(pref: ThemePreference, resolved: 'cyberpunk' | 'luxury' | 'paper'): string {
  return pref === 'auto' ? autoGlyph(resolved) : THEME_GLYPH[pref];
}

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, preference, setTheme, cycleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  if (compact) {
    return (
      <button
        type="button"
        onClick={cycleTheme}
        title={`Theme: ${preference}${preference === 'auto' ? ` (${theme})` : ''}. Click to cycle.`}
        aria-label={`Switch theme (current: ${preference})`}
        className="inline-flex h-8 w-8 items-center justify-center rounded
                   border border-[color:var(--border)] bg-[color:var(--bg-overlay)]
                   text-[color:var(--accent)] transition-all hover:scale-105
                   hover:border-[color:var(--border-strong)]"
      >
        <span aria-hidden className="text-base leading-none">{glyphFor(preference, theme)}</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded border border-[color:var(--border)]
                   bg-[color:var(--bg-overlay)] px-3 py-1.5 text-xs font-mono uppercase
                   tracking-widest text-[color:var(--fg-muted)] transition-all
                   hover:border-[color:var(--border-strong)] hover:text-[color:var(--fg)]"
      >
        <span aria-hidden className="text-[color:var(--accent)]">{glyphFor(preference, theme)}</span>
        <span>{preference}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 w-56
                     overflow-hidden rounded-lg border border-[color:var(--border)]
                     bg-[color:var(--bg-overlay)] shadow-2xl backdrop-blur-md"
        >
          {THEMES.map((t) => {
            const active = t.name === preference;
            const glyph = t.name === 'auto' ? autoGlyph(theme) : THEME_GLYPH[t.name];
            return (
              <li key={t.name} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    setTheme(t.name);
                    setOpen(false);
                  }}
                  className={[
                    'flex w-full items-start gap-3 px-3 py-2 text-left transition-colors',
                    active
                      ? 'bg-[color:var(--accent)]/10 text-[color:var(--fg)]'
                      : 'text-[color:var(--fg-muted)] hover:bg-[color:var(--bg-elevated)]',
                  ].join(' ')}
                >
                  <span aria-hidden className="mt-0.5 text-[color:var(--accent)]">
                    {glyph}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-serif text-sm">{t.label}</span>
                    <span className="text-[11px] text-[color:var(--fg-subtle)]">
                      {t.blurb}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
