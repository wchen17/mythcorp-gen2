'use client';

// Walkthrough: /wc/learn/landing-flow

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '../components/LoadingScreen';

const BOOT_DURATION_MS = 3500;
const HOMEPAGE_DELAY_MS = 600;
const SESSION_BOOTED_KEY = 'mythcorp-booted';

/**
 * Boot museum. Plays the LoadingScreen on demand, regardless of whether
 * the session has already seen it. After the cinematic finishes, marks
 * the session as booted (so the homepage doesn't replay it) and routes
 * to /.
 */
export default function BootPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / BOOT_DURATION_MS);
      setProgress(Math.round(t * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_BOOTED_KEY, '1');
      } catch {
        /* ignore */
      }
      router.push('/');
    }, BOOT_DURATION_MS + HOMEPAGE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="h-screen w-screen bg-[color:var(--bg)]">
      <LoadingScreen onFinished={() => {}} progressOverride={progress} />
    </main>
  );
}
