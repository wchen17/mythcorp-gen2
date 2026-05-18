'use client';

import { useEffect, useState } from 'react';

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollHeight = (doc.scrollHeight - doc.clientHeight) || 1;
      setProgress(Math.min(1, Math.max(0, scrollTop / scrollHeight)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed left-0 right-0 top-0 z-40 h-0.5 bg-transparent pointer-events-none"
    >
      <div
        className="h-full origin-left bg-[color:var(--accent)]"
        style={{
          transform: `scaleX(${progress})`,
          transition: 'transform 80ms linear',
          boxShadow: '0 0 10px var(--accent-glow)',
        }}
      />
    </div>
  );
}
