'use client';

// Walkthrough: /og/calhoun
// A standalone scene (its own Canvas, separate from the spectre Simulation):
// the Universe 25 behavioral sink looping through phases A-D, with a phase
// readout. Reached from the /og/calhoun CTA via /experience?mode=calhoun.

import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import { PerspectiveCamera, Stars } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useTheme, type ThemeName } from '../contexts/ThemeContext'
import { BehavioralSink, type SinkState } from './BehavioralSink'

const BACKDROP_BY_THEME: Record<ThemeName, string> = {
  cyberpunk: '#000008',
  luxury:    '#0c0a14',
  paper:     '#f3ebdb',
  plain:     '#ffffff',
};

interface CalhounSimulationProps {
  onExit: () => void;
}

export function CalhounSimulation({ onExit }: CalhounSimulationProps) {
  const { theme } = useTheme();
  const [color, setColor] = useState('#62e0ff');
  const [sink, setSink] = useState<SinkState | null>(null);

  const backdrop = BACKDROP_BY_THEME[theme];

  return (
    <main className="h-screen w-screen bg-[color:var(--bg)] font-sans">

      {/* Controls (left) */}
      <div className="themed-surface absolute left-4 top-20 z-10 w-72 p-4
                      text-[color:var(--fg)]">
        <h3 className="text-center font-mono tracking-widest text-base
                       text-[color:var(--accent-warm)]
                       border-b border-[color:var(--border)] pb-3">
          [ UNIVERSE 25 ]
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-[color:var(--fg-muted)]">
          A mouse utopia in fast-forward: unlimited food and space, four phases,
          one ending. Watch the population crowd into the sink, then quietly stop.
        </p>

        <div className="flex flex-col mt-4">
          <label className="text-[color:var(--fg-muted)] text-sm mb-1 font-sans">
            Population Color
          </label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="mt-1 bg-[color:var(--bg)] border border-[color:var(--border)]
                       text-[color:var(--fg)] p-2 text-sm
                       rounded-[var(--radius-sm)] font-mono
                       focus:border-[color:var(--accent)] focus:outline-none"
          />
        </div>

        <button
          onClick={onExit}
          className="themed-pill w-full py-2 text-sm mt-6
                     text-[color:var(--accent-warm)]
                     hover:text-[color:var(--accent)]"
        >
          [ ← EXIT SIMULATION ]
        </button>
      </div>

      {/* Phase readout (right) */}
      {sink && (
        <div className="themed-surface absolute right-4 top-20 z-10 w-56 p-4
                        text-[color:var(--fg)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--accent-warm)]">
            [ PHASE ]
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-semibold text-[color:var(--accent-soft)]">
              {sink.phase}
            </span>
            <span className="font-serif text-lg text-[color:var(--fg)]">{sink.phaseName}</span>
          </div>
          <div className="mt-3 flex gap-1.5">
            {(['A', 'B', 'C', 'D'] as const).map((p) => (
              <span
                key={p}
                className="h-1.5 flex-1 rounded-full"
                style={{ background: p === sink.phase ? 'var(--accent-soft)' : 'var(--border)' }}
              />
            ))}
          </div>
          <p className="mt-3 font-mono text-sm text-[color:var(--fg-muted)]">
            pop. <span className="text-[color:var(--fg)]">{sink.population.toLocaleString()}</span>
          </p>
          <p className="mt-2 text-[11px] leading-snug text-[color:var(--fg-subtle)]">
            Space and food never run out. Roles do.
          </p>
        </div>
      )}

      {/* --- 3D Canvas --- */}
      <Canvas
        gl={{
          alpha: false, antialias: true,
          preserveDrawingBuffer: false, powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={55} />
        <color attach="background" args={[backdrop]} />
        <Stars radius={120} depth={50} count={1500} factor={3} saturation={0} fade speed={0.5} />

        <ambientLight intensity={0.4} />
        <pointLight position={[0, 0, 10]} intensity={0.6} color={color} />

        <BehavioralSink color={color} onState={setSink} />

        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.1} luminanceSmoothing={0.2} mipmapBlur radius={0.8} />
        </EffectComposer>
      </Canvas>
    </main>
  )
}
