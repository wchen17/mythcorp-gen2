'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealOnViewProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  as?: 'div' | 'section' | 'span';
}

export function RevealOnView({ children, delayMs = 0, className = '', as = 'div' }: RevealOnViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    if (reduce) {
      setRevealed(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            if (delayMs > 0) {
              setTimeout(() => setRevealed(true), delayMs);
            } else {
              setRevealed(true);
            }
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.18 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs, reduce]);

  // Narrowed to one concrete tag for JSX's benefit. `as` is a union of three
  // intrinsic elements, and TypeScript resolves the props of a union tag to
  // their intersection, which is what forced the old `RefObject<any>`. All
  // three are HTMLElements and only ref, className, and style are set, so
  // picking one for typing is safe and keeps the cast off the ref itself.
  const Tag = as as 'div';
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(16px)',
        transition: reduce
          ? 'none'
          : 'opacity 600ms var(--motion-ease), transform 600ms var(--motion-ease)',
      }}
    >
      {children}
    </Tag>
  );
}
