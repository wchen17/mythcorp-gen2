'use client';

import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Tone tints the border + glow + accent button color. */
  tone?: 'default' | 'warm' | 'soft';
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  /** Footer area, pass a button (or buttons) styled however you like. */
  footer?: ReactNode;
}

const TONE_BORDER: Record<NonNullable<ModalProps['tone']>, string> = {
  default: 'border-[color:var(--border-strong)]',
  warm: 'border-[color:var(--accent-warm)]/55',
  soft: 'border-[color:var(--accent-soft)]/55',
};

const TONE_GLOW: Record<NonNullable<ModalProps['tone']>, string> = {
  default: 'shadow-[0_0_50px_-15px_var(--accent-glow)]',
  warm: 'shadow-[0_0_50px_-15px_color-mix(in_oklab,var(--accent-warm)_60%,transparent)]',
  soft: 'shadow-[0_0_50px_-15px_color-mix(in_oklab,var(--accent-soft)_60%,transparent)]',
};

export function Modal({
  open,
  onClose,
  tone = 'default',
  title,
  icon,
  children,
  footer,
}: ModalProps) {
  // ESC closes. Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center
                 bg-black/55 backdrop-blur-sm modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .modal-card { animation: modalIn 0.32s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .modal-backdrop { animation: backdropIn 0.2s ease-out; }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        className={[
          'modal-card flex max-w-sm flex-col items-center gap-3 rounded-xl',
          'border bg-[color:var(--bg-elevated)] p-6 text-center',
          'm-4',
          TONE_BORDER[tone],
          TONE_GLOW[tone],
        ].join(' ')}
      >
        {icon && (
          <div className="text-4xl drop-shadow-[0_0_10px_var(--accent-glow)]">
            {icon}
          </div>
        )}
        <h3 className="font-serif text-xl font-semibold text-[color:var(--accent)]">
          {title}
        </h3>
        <div className="text-sm leading-relaxed text-[color:var(--fg-muted)]">
          {children}
        </div>
        {footer && <div className="mt-2 flex gap-2">{footer}</div>}
      </div>
    </div>
  );
}

/** Small reusable accent button for modal footers. */
export function ModalButton({
  onClick,
  children,
  variant = 'primary',
}: {
  onClick: () => void;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
}) {
  if (variant === 'ghost') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="rounded border border-[color:var(--border)] px-5 py-2
                   font-mono text-xs uppercase tracking-widest
                   text-[color:var(--fg-muted)] transition-all
                   hover:border-[color:var(--border-strong)] hover:text-[color:var(--fg)]"
      >
        {children}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded bg-[color:var(--accent)] px-5 py-2 font-bold
                 text-[color:var(--bg)] text-sm tracking-wide
                 transition-all hover:scale-[1.03] hover:shadow-[0_0_20px_var(--accent-glow-strong)]"
    >
      {children}
    </button>
  );
}
