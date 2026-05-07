'use client';

// Walkthrough: /wc/learn/theme-system

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type ThemeName = 'cyberpunk' | 'luxury' | 'paper';
export type ThemePreference = ThemeName | 'auto';

export const THEMES: ReadonlyArray<{
  name: ThemePreference;
  label: string;
  blurb: string;
}> = [
  { name: 'cyberpunk', label: 'Cyberpunk', blurb: 'Neon, glow, the boot sequence.' },
  { name: 'luxury',    label: 'Luxury',    blurb: 'Warm midnight, cream, gold.' },
  { name: 'paper',     label: 'Paper',     blurb: 'Reading-room cream, serif.' },
  { name: 'auto',      label: 'Auto',      blurb: 'Follows the local time of day.' },
];

const STORAGE_KEY = 'mythcorp-theme';
const DEFAULT_PREFERENCE: ThemePreference = 'cyberpunk';
const TRANSITION_HALF_MS = 260;
// Re-resolve `auto` once a minute so the user crosses time-of-day boundaries
// without a refresh.
const AUTO_TICK_MS = 60_000;

type ThemeCtx = {
  /** The currently rendered theme. Always one of the three concrete names. */
  theme: ThemeName;
  /** What the user picked. Includes 'auto'. */
  preference: ThemePreference;
  setTheme: (next: ThemePreference) => void;
  cycleTheme: () => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

function isThemeName(value: unknown): value is ThemeName {
  return value === 'cyberpunk' || value === 'luxury' || value === 'paper';
}

function isPreference(value: unknown): value is ThemePreference {
  return isThemeName(value) || value === 'auto';
}

/** Time-of-day -> concrete theme. 06-11 paper, 11-19 luxury, 19-06 cyberpunk. */
export function resolveAuto(now: Date = new Date()): ThemeName {
  const h = now.getHours();
  if (h >= 6 && h < 11) return 'paper';
  if (h >= 11 && h < 19) return 'luxury';
  return 'cyberpunk';
}

function resolve(pref: ThemePreference, now?: Date): ThemeName {
  return pref === 'auto' ? resolveAuto(now) : pref;
}

export function ThemeProvider({
  initialTheme = DEFAULT_PREFERENCE,
  children,
}: {
  initialTheme?: ThemePreference;
  children: ReactNode;
}) {
  const [preference, setPreference] = useState<ThemePreference>(initialTheme);
  const [theme, setThemeState] = useState<ThemeName>(() => resolve(initialTheme));
  const [phase, setPhase] = useState<'idle' | 'cover' | 'reveal'>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const initialPref: ThemePreference = isPreference(stored) ? stored : initialTheme;
      const resolved = resolve(initialPref);
      setPreference(initialPref);
      setThemeState(resolved);
      document.documentElement.dataset.theme = resolved;
    } catch {
      document.documentElement.dataset.theme = resolve(initialTheme);
    }
    requestAnimationFrame(() => {
      document.documentElement.classList.add('theme-ready');
    });
  }, [initialTheme]);

  // While preference is 'auto', re-resolve once a minute.
  useEffect(() => {
    if (preference !== 'auto') return;
    const tick = () => {
      const next = resolveAuto();
      setThemeState((prev) => {
        if (prev === next) return prev;
        document.documentElement.dataset.theme = next;
        return next;
      });
    };
    tick();
    const id = setInterval(tick, AUTO_TICK_MS);
    return () => clearInterval(id);
  }, [preference]);

  const applyPreference = useCallback((next: ThemePreference) => {
    const resolved = resolve(next);
    document.documentElement.dataset.theme = resolved;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage may be disabled; in-memory state still works */
    }
    setPreference(next);
    setThemeState(resolved);
  }, []);

  // Swap with a brief darkening curtain so the user isn't flashbanged when
  // going from a dark theme to the bright `paper` one (or back).
  const swapWithCurtain = useCallback((next: ThemePreference) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const reduce = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resolvedNext = resolve(next);
    if (reduce || theme === resolvedNext) {
      applyPreference(next);
      return;
    }

    setPhase('cover');
    timeoutRef.current = setTimeout(() => {
      applyPreference(next);
      setPhase('reveal');
      timeoutRef.current = setTimeout(() => {
        setPhase('idle');
        timeoutRef.current = null;
      }, TRANSITION_HALF_MS);
    }, TRANSITION_HALF_MS);
  }, [theme, applyPreference]);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const setTheme = useCallback((next: ThemePreference) => swapWithCurtain(next), [swapWithCurtain]);

  const cycleTheme = useCallback(() => {
    const idx = THEMES.findIndex((t) => t.name === preference);
    const next = THEMES[(idx + 1) % THEMES.length].name;
    swapWithCurtain(next);
  }, [preference, swapWithCurtain]);

  const value = useMemo<ThemeCtx>(
    () => ({ theme, preference, setTheme, cycleTheme }),
    [theme, preference, setTheme, cycleTheme],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <ThemeCurtain phase={phase} />
    </Ctx.Provider>
  );
}

function ThemeCurtain({ phase }: { phase: 'idle' | 'cover' | 'reveal' }) {
  if (phase === 'idle') return null;
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{
        background: '#000',
        opacity: phase === 'cover' ? 0.78 : 0,
        transition: `opacity ${TRANSITION_HALF_MS}ms ease`,
      }}
    />
  );
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
