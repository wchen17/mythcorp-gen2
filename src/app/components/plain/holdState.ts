/**
 * Plain mode doubles as the site's holding mode: every route collapses to a
 * work-in-progress screen except the ones listed here.
 */
export const PLAIN_OPEN_ROUTES = ['/contact'] as const;

/** The attribute the pre-paint script and React both write to <html>. */
export const HOLD_ATTR = 'data-hold';

export function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

export function isHeld(theme: string | undefined, pathname: string): boolean {
  if (theme !== 'plain') return false;
  return !PLAIN_OPEN_ROUTES.includes(normalizePath(pathname) as typeof PLAIN_OPEN_ROUTES[number]);
}
