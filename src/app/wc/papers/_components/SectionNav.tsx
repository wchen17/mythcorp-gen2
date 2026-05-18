'use client';

import { useEffect, useState } from 'react';

type NavItem = { id: string; eyebrow: string; title: string };

interface SectionNavProps {
  sections: NavItem[];
}

export function SectionNav({ sections }: SectionNavProps) {
  const [active, setActive] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0% -55% 0%', threshold: [0, 0.25, 0.5, 1] },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  const onClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="Section navigation"
      className="hidden md:block fixed right-6 top-1/2 z-30 -translate-y-1/2"
    >
      <ul className="space-y-1">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={onClick(s.id)}
                className={[
                  'group flex items-center justify-end gap-3 py-1 transition-colors',
                  isActive
                    ? 'text-[color:var(--accent)]'
                    : 'text-[color:var(--fg-subtle)] hover:text-[color:var(--accent-soft)]',
                ].join(' ')}
              >
                <span className="text-right text-xs leading-tight max-w-[10rem]">
                  {s.title}
                </span>
                <span
                  aria-hidden
                  className={[
                    'block h-px transition-all',
                    isActive
                      ? 'w-8 bg-[color:var(--accent)]'
                      : 'w-3 bg-[color:var(--border)] group-hover:w-5',
                  ].join(' ')}
                  style={isActive ? { boxShadow: '0 0 8px var(--accent-glow)' } : undefined}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
