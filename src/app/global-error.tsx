'use client';

import { useEffect } from 'react';

// global-error replaces the root layout entirely, so it ships its own <html>/<body>
// and cannot rely on globals.css or the theme tokens. Hard-coded colors are the one
// place that is acceptable, because this renders when the layout itself failed.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error boundary caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
          background: '#06070a',
          color: '#e7eef5',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: '4rem',
            color: '#34d8e0',
            textShadow: '0 0 40px rgba(52, 216, 224, 0.55)',
          }}
          aria-hidden
        >
          ◴
        </div>
        <p
          style={{
            margin: 0,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: '#f0a868',
          }}
        >
          [ ERR_FATAL ]
        </p>
        <h1 style={{ margin: 0, fontSize: '1.9rem', fontWeight: 800 }}>
          The whole thing fell over
        </h1>
        <p style={{ margin: 0, maxWidth: '24rem', color: '#9fb0c0', lineHeight: 1.6 }}>
          A fatal error took the page down before it could finish loading. Reloading
          usually clears it.
        </p>
        {error.digest && (
          <p
            style={{
              margin: 0,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: '0.7rem',
              color: '#5f7184',
            }}
          >
            ref: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          style={{
            marginTop: '0.5rem',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '0.375rem',
            background: '#34d8e0',
            color: '#06070a',
            fontWeight: 700,
            fontSize: '0.85rem',
            letterSpacing: '0.04em',
            padding: '0.65rem 1.4rem',
          }}
        >
          ↻ Reload
        </button>
      </body>
    </html>
  );
}
