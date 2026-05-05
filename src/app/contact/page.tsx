'use client';

import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center
                       justify-center px-6 pt-24 pb-16 text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ CONTACT ]
        </p>
        <h1 className="mb-6 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
          Say hello
        </h1>
        <p className="text-base leading-relaxed text-[color:var(--fg-muted)] md:text-lg">
          There&rsquo;s no real form here yet. Until there is, the actually
          useful links live in <Link href="/will" className="text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]">/will</Link>.
        </p>

        <div className="my-10 h-px w-32 bg-[color:var(--border)]" />

        <div className="flex flex-col gap-2 font-mono text-sm text-[color:var(--fg-muted)]">
          <p>info@mythcorp.com</p>
          <p>(676) 767-7676</p>
          <p>Chicago, IL</p>
        </div>

        <p className="mt-6 max-w-md text-xs text-[color:var(--fg-subtle)]">
          The phone number is fake. It always has been. It&rsquo;s a love letter
          to itself, palindromic in three different ways. Please don&rsquo;t call it.
        </p>
      </main>
    </div>
  );
}
