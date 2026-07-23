'use client';

import { useEffect, useRef } from 'react';

interface HeroTitleProps {
  onClick?: () => void;
}

export function HeroTitle({ onClick }: HeroTitleProps) {
  const titleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onPointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 8;
      targetY = (event.clientY / window.innerHeight - 0.5) * 6;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const update = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      title.style.setProperty('--title-x', `${currentX.toFixed(2)}px`);
      title.style.setProperty('--title-y', `${currentY.toFixed(2)}px`);
      if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.1) {
        frame = requestAnimationFrame(update);
      } else {
        frame = 0;
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      ref={titleRef}
      type="button"
      onClick={onClick}
      aria-label="Discover Your Potential"
      className="group relative inline-flex flex-col items-center cursor-pointer text-center
                 motion-safe:transition-transform motion-safe:duration-[var(--motion-base)]
                 motion-safe:ease-[var(--motion-ease)]"
      style={{ transform: 'translate3d(var(--title-x, 0px), var(--title-y, 0px), 0)' }}
    >
      <h1 className="flex flex-col gap-1 font-serif text-[clamp(2.5rem,9vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight sm:gap-1.5 md:flex-row md:gap-x-6">
        <span className="text-[color:var(--accent-soft)] md:text-right">DISCOVER</span>
        <span className="text-[color:var(--fg)]">YOUR</span>
        <span className="text-[color:var(--accent-warm)] md:text-left">POTENTIAL</span>
      </h1>
      <span
        aria-hidden
        className="mt-4 block h-px w-32 bg-[color:var(--fg)]/50 transition-all group-hover:w-48 group-hover:bg-[color:var(--accent)]"
      />
    </button>
  );
}
