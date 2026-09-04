'use client';

import Link from 'next/link';
import { Modal, ModalButton } from '../Modal';

interface LandingModalsProps {
  showSecretHint: boolean;
  onCloseSecretHint: () => void;
}

/**
 * The landing-page popup. There used to be a second one, opened by clicking
 * the headline, that apologized for a deliberately misaligned label ("some
 * bits aren't pixel-perfect yet"). Both the misalignment and the apology are
 * gone: a visitor reads an off-center line as sloppiness, not as wit, and the
 * punchline was hidden behind clicking an h1 nobody knew was a button.
 */
export function LandingModals({
  showSecretHint,
  onCloseSecretHint,
}: LandingModalsProps) {
  return (
    <>
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
