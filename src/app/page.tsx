// src/app/page.tsx
'use client';

import { NewLandingPage } from './components/NewLandingPage';

/**
 * The main page component for the home route.
 * This now shows the new landing page directly.
 */
export default function HomePage() {
  return <NewLandingPage />;
}
