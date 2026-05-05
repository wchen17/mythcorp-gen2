'use client';

// Walkthrough: /will/learn/theme-system

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ThemeName = 'cyberpunk' | 'luxury' | 'paper';

export const THEMES: ReadonlyArray<{
  name: ThemeName;
  label: string;
  blurb: string;
}> = [
  { name: 'cyberpunk', label: 'Cyberpunk', blurb: 'Neon, glow, the boot sequence.' },
  { name: 'luxury',    label: 'Luxury',    blurb: 'Warm midnight, cream, gold.' },
  { name: 'paper',     label: 'Paper',     blurb: 'Reading-room cream + serif.' },
];

const STORAGE_KEY = 'mythcorp-theme';
const DEFAULT_THEME: ThemeName = 'cyberpunk';

type ThemeCtx = {
  theme: ThemeName;
  setTheme: (next: ThemeName) => void;
  cycleTheme: () => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

function isThemeName(value: unknown): value is ThemeName {
  return value === 'cyberpunk' || value === 'luxury' || value === 'paper';
}

export function ThemeProvider({
  initialTheme = DEFAULT_THEME,
  children,
}: {
  initialTheme?: ThemeName;
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeName>(initialTheme);

  // On mount, restore from localStorage if present, then mark theme-ready
  // (lets globals.css run its transition only after first paint).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isThemeName(stored)) {
        setThemeState(stored);
        document.documentElement.dataset.theme = stored;
      } else {
        document.documentElement.dataset.theme = initialTheme;
      }
    } catch {
      document.documentElement.dataset.theme = initialTheme;
    }
    requestAnimationFrame(() => {
      document.documentElement.classList.add('theme-ready');
    });
  }, [initialTheme]);

  const setTheme = useCallback((next: ThemeName) => {
    setThemeState(next);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage may be disabled; the in-memory state still works */
    }
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((prev) => {
      const idx = THEMES.findIndex((t) => t.name === prev);
      const next = THEMES[(idx + 1) % THEMES.length].name;
      document.documentElement.dataset.theme = next;
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo<ThemeCtx>(
    () => ({ theme, setTheme, cycleTheme }),
    [theme, setTheme, cycleTheme],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
