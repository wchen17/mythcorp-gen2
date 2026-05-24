'use client';

import { useEffect, useRef, useState } from 'react';
import { SiteHeader } from '../components/SiteHeader';
import { MainMenu } from './MainMenu';
import { Simulation } from './Simulation';

type View = 'menu' | 'simulation';

const FADE_MS = 420;

export default function ExperiencePage() {
  const [view, setView] = useState<View>('menu');
  const [mounted, setMounted] = useState<View>('menu');
  const [mode, setMode] = useState<'default' | 'calhoun'>('default');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Deep link: /experience?mode=calhoun drops straight into the behavioral sink.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'calhoun') {
      setMode('calhoun');
      setView('simulation');
      setMounted('simulation');
    }
  }, []);

  useEffect(() => {
    if (mounted === view) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setMounted(view);
      timer.current = null;
    }, FADE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [view, mounted]);

  const showMenu = view === 'menu' && mounted === 'menu';
  const showSim = view === 'simulation' && mounted === 'simulation';

  return (
    <div className="relative min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader tagline="SIMULATION LAB" />

      <div className="relative">
        {mounted === 'menu' ? (
          <FadeBox visible={showMenu}>
            <MainMenu onStart={() => setView('simulation')} />
          </FadeBox>
        ) : (
          <FadeBox visible={showSim}>
            <Simulation onExit={() => setView('menu')} initialMode={mode} />
          </FadeBox>
        )}
      </div>
    </div>
  );
}

function FadeBox({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms var(--motion-ease)`,
      }}
    >
      {children}
    </div>
  );
}
