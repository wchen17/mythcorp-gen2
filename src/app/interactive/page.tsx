// src/app/interactive/page.tsx
'use client';

import { LandingPage } from '../components/LandingPage';
import { useRouter } from 'next/navigation';

export default function InteractivePage() {
  const router = useRouter();

  const handleTransitionComplete = () => {
    // Navigate to the experience page after the transition animation
    router.push('/experience');
  };

  return <LandingPage onTransitionComplete={handleTransitionComplete} />;
}
