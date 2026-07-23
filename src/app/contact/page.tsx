import { SiteHeader } from '../components/SiteHeader';
import { DraftBanner } from '../components/DraftBanner';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 pt-28 pb-20 sm:pl-16">
        <DraftBanner note="The communications desk is still being assembled." />
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ CONTACT / WIP ]
        </p>
        <h1 className="themed-heading mt-3 text-4xl font-semibold md:text-5xl">
          Say hello
        </h1>
        <div className="mt-8 flex flex-col gap-2 font-mono text-sm text-[color:var(--fg-muted)]">
          <p>info@mythcorp.com</p>
          <p>(676) 767-7676</p>
          <p>Chicago, IL</p>
        </div>
      </main>
    </div>
  );
}
