/**
 * Plain mode carries its own light/dark switch, separate from the site's
 * theme. The theme decides there is no ornament; the scheme decides which way
 * round the ink and the paper go.
 */
export type SchemeChoice = 'system' | 'light' | 'dark';
export type Scheme = 'light' | 'dark';

export const SCHEME_KEY = 'mythcorp-plain-scheme';

/** Written to <html> by the pre-paint script and by React, always resolved. */
export const SCHEME_ATTR = 'data-plain-scheme';

export const SCHEME_CHOICES: readonly SchemeChoice[] = ['system', 'light', 'dark'];

export function isSchemeChoice(value: unknown): value is SchemeChoice {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function resolveScheme(choice: SchemeChoice, prefersDark: boolean): Scheme {
  if (choice === 'system') return prefersDark ? 'dark' : 'light';
  return choice;
}

/**
 * The two colours the canvas components need. They take strings rather than
 * reading CSS, so the scheme has to be handed to them explicitly.
 */
export const SCHEME_INK: Record<Scheme, { ink: string; highlight: string; paper: string }> = {
  light: { ink: '#111111', highlight: '#444444', paper: '#ffffff' },
  dark: { ink: '#ededed', highlight: '#9a9a9a', paper: '#000000' },
};
