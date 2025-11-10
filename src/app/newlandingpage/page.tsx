// src/app/newlandingpage/page.tsx
'use client';

import { NewLandingPage } from '../components/NewLandingPage';
import { useRouter } from 'next/navigation';

export default function NewLandingPageRoute() {
  const router = useRouter();

  const handleEnterExperience = () => {
    router.push('/experience');
  };

  const handleEnterInteractive = () => {
    router.push('/interactive');
  };

  return (
    <NewLandingPage 
      onEnterExperience={handleEnterExperience}
      onEnterInteractive={handleEnterInteractive}
    />
  );
}
