'use client';

import Link from 'next/link';
import { Modal, ModalButton } from '../Modal';

interface LandingModalsProps {
  showMisalignedNote: boolean;
  onCloseMisalignedNote: () => void;
  showSecretHint: boolean;
  onCloseSecretHint: () => void;
}

/**
 * The two landing-page popups, kept whimsical but warmer than the
 * original snarky multi-click counter. Each links the curious user
 * somewhere useful rather than just sassing them.
 */
export function LandingModals({
  showMisalignedNote,
  onCloseMisalignedNote,
  showSecretHint,
  onCloseSecretHint,
}: LandingModalsProps) {
  return (
    <>
      <Modal
        open={showMisalignedNote}
        onClose={onCloseMisalignedNote}
        tone="warm"
        title="Yep, we noticed"
        icon="👀"
        footer={
          <>
            <Link
              href="/wc/learn"
              className="rounded border border-[color:var(--border)]
                         px-5 py-2 font-mono text-xs uppercase tracking-widest
                         text-[color:var(--fg-muted)] transition-all
                         hover:border-[color:var(--border-strong)]
                         hover:text-[color:var(--accent-warm)]"
            >
              See the rebuild
            </Link>
            <ModalButton onClick={onCloseMisalignedNote}>Carry on</ModalButton>
          </>
        }
      >
        Some bits aren&rsquo;t pixel-perfect yet. Think of it as the seam where the
        cyberpunk boot meets the warm reveal, we&rsquo;re still tuning it.
      </Modal>

      <Modal
        open={showSecretHint}
        onClose={onCloseSecretHint}
        tone="soft"
        title="Hint, not a lock"
        icon="✺"
        footer={
          <>
            <Link
              href="/wc/learn"
              className="rounded border border-[color:var(--border)]
                         px-5 py-2 font-mono text-xs uppercase tracking-widest
                         text-[color:var(--fg-muted)] transition-all
                         hover:border-[color:var(--border-strong)]
                         hover:text-[color:var(--accent-soft)]"
            >
              Peek under the hood
            </Link>
            <ModalButton onClick={onCloseSecretHint}>Maybe later</ModalButton>
          </>
        }
      >
        There isn&rsquo;t a hidden menu, the interesting stuff lives in{' '}
        <code className="font-mono text-[color:var(--accent-soft)]">/wc/learn</code>,
        where the components on this page are annotated and you can read how they work.
      </Modal>
    </>
  );
}
