'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from './ThemeSwitcher';

type NavItem = { href: string; label: string };

const DEFAULT_NAV: ReadonlyArray<NavItem> = [
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
  { href: '/will', label: 'WILL' },
];

interface SiteHeaderProps {
  /** Override the default nav (e.g., experience page wants HOME on the left). */
  nav?: ReadonlyArray<NavItem>;
  /** Tagline shown under the logo. Defaults to FOUNDED IN CHICAGO. */
  tagline?: string;
  /** Hide the logo's link to "/" (when you're already on home). */
  logoIsLink?: boolean;
}

export function SiteHeader({
  nav = DEFAULT_NAV,
  tagline = 'FOUNDED IN CHICAGO',
  logoIsLink = true,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const Logo = logoIsLink ? Link : 'span';
  const logoProps = logoIsLink ? { href: '/' } : {};

  return (
    <header className="fixed top-0 left-0 right-0 z-30
                       border-b border-[color:var(--border)]
                       bg-[color:var(--bg-overlay)] backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        {/* Left: Home link (icon hamburger style, kept from original) */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
          aria-label="Go home"
        >
          <span aria-hidden className="flex h-6 w-6 flex-col justify-center gap-1">
            <span className="h-0.5 w-full bg-[color:var(--fg)]" />
            <span className="h-0.5 w-1/2 bg-[color:var(--fg)]" />
            <span className="h-0.5 w-full bg-[color:var(--fg)]" />
          </span>
          <span className="hidden text-sm font-medium tracking-wide text-[color:var(--fg)] sm:inline">
            HOME
          </span>
        </Link>

        {/* Center: Logo */}
        <div className="flex flex-col items-center text-center">
          <Logo
            {...logoProps as any}
            className="font-serif text-xl font-semibold tracking-wider text-[color:var(--fg)]
                       drop-shadow-[0_0_12px_var(--accent-glow)] sm:text-2xl"
          >
            MYTHCORP
          </Logo>
          {tagline && (
            <span className="mt-0.5 text-[10px] font-mono uppercase tracking-[0.25em]
                             text-[color:var(--fg-muted)] sm:text-xs">
              {tagline}
            </span>
          )}
        </div>

        {/* Right: Nav + theme switcher */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <ul className="hidden items-center gap-4 sm:flex">
            {nav.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      'text-xs font-medium tracking-widest transition-colors sm:text-sm',
                      active
                        ? 'text-[color:var(--accent)] underline underline-offset-4'
                        : 'text-[color:var(--fg)] hover:text-[color:var(--accent-soft)]',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ThemeSwitcher compact />
        </nav>
      </div>
    </header>
  );
}
