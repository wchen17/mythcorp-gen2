'use client';

import { CSSProperties } from 'react';
import { SiteHeader } from '../../components/SiteHeader';
import { DraftBanner } from '../../components/DraftBanner';

const containerStyle: CSSProperties = {
  transform: 'rotateX(55deg) rotateZ(-45deg)',
  transformStyle: 'preserve-3d',
};

const textStyle: CSSProperties = {
  fontSize: 'clamp(4rem, 15vw, 10rem)',
  fontWeight: 800,
  letterSpacing: '0.5em',
  color: 'var(--fg)',
  textShadow: `
    1px 1px 0 var(--fg-muted),
    2px 2px 0 var(--fg-muted),
    3px 3px 0 var(--fg-subtle),
    4px 4px 0 var(--fg-subtle),
    5px 5px 0 var(--fg-subtle),
    6px 6px 0 var(--accent-glow),
    7px 7px 0 var(--accent-glow),
    8px 8px 24px var(--accent-glow-strong)
  `,
};

export default function InteractiveSketch() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 pt-24 pb-12">
        <DraftBanner note="Isometric CSS-only 3D type — kept here as a warm-up for an actual interactive page (R3F shader playground? scene picker?)." />
      </main>

      <div className="pointer-events-none flex w-full justify-center pt-8 pb-20">
        <div style={containerStyle}>
          <div style={textStyle}>W I P</div>
        </div>
      </div>
    </div>
  );
}
