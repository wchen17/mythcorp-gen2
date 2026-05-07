'use client';

import { useState } from 'react';
import { MainMenu } from './MainMenu';
import { Simulation } from './Simulation';
import { SCENE_PRESETS, type ScenePreset } from './scenePresets';

export default function ExperiencePage() {
  // Two-state machine: menu shows the entry card, simulation runs the 3D
  // scene. The old "settings" stub was removed, Simulation already exposes
  // a full controls panel inline, so a duplicate settings page added nothing.
  const [view, setView] = useState<'menu' | 'simulation'>('menu');
  const [preset, setPreset] = useState<ScenePreset>(SCENE_PRESETS[0]);

  if (view === 'simulation') {
    return <Simulation preset={preset} onExit={() => setView('menu')} />;
  }
  return (
    <MainMenu
      onStart={(p) => {
        setPreset(p);
        setView('simulation');
      }}
    />
  );
}
