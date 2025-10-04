// src/app/experience/page.tsx
'use client';

import { Suspense } from 'react';
import Scene from '../components/Scene';
import { LoadingScreen } from '../components/LoadingScreen';

export default function ExperiencePage() {
  return (
    <div className="w-full h-screen">
      <Suspense fallback={<LoadingScreen onFinished={() => {}} />}>
        <Scene />
      </Suspense>
    </div>
  );
}