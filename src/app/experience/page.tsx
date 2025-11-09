// src/app/experience/page.tsx
'use client';

import { useState } from 'react';
import { LoadingScreen } from '../components/LoadingScreen';
import { Experience } from '../components/Experience';

export default function ExperiencePage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <LoadingScreen onFinished={() => setIsLoading(false)} />
      )}
      {!isLoading && <Experience />}
    </>
  );
}