'use client';

import { useState } from 'react';
import { MainMenu } from './MainMenu';
import { Simulation } from './Simulation';

export default function ExperiencePage() {
  // Two-state machine: menu shows the entry card, simulation runs the 3D
  // scene. The old "settings" stub was removed — Simulation already exposes
  // a full controls panel inline, so a duplicate settings page added nothing.
  const [view, setView] = useState<'menu' | 'simulation'>('menu');

  if (view === 'simulation') {
    return <Simulation onExit={() => setView('menu')} />;
  }
  return <MainMenu onStart={() => setView('simulation')} />;
}
