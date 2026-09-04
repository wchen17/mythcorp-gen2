'use client';

import { useRouter } from 'next/navigation';
import { DraftBanner } from '../../components/DraftBanner';
import { SiteHeader } from '../../components/SiteHeader';
import { HeroLab } from './HeroLab';

export default function HeroLabPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />
      <main className="min-h-screen pt-20">
        <div className="relative z-20 mx-auto max-w-3xl px-6 pt-4">
          <DraftBanner note="A title-and-model hero composition still being worked out." />
        </div>
        <div className="h-[calc(100vh-5rem)]">
          <HeroLab onTransitionComplete={() => router.push('/')} />
        </div>
      </main>
    </div>
  );
}
