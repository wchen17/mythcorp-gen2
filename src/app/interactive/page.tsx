// src/app/interactive/page.tsx
'use client';

import Link from 'next/link';
import React from 'react';

// A simple component for the 3D text effect
function ThreeDText() {
  // Styles to mimic the "TAX EVASION" image
  const containerStyle: React.CSSProperties = {
    transform: 'rotateX(55deg) rotateZ(-45deg)',
    transformStyle: 'preserve-3d',
  };

  const textStyle: React.CSSProperties = {
    fontSize: 'clamp(4rem, 15vw, 10rem)', // Responsive font size
    fontWeight: '800',
    color: '#e0e0e0',
    letterSpacing: '0.5em', // For the W I P look
    textShadow: `
      1px 1px 0 #ccc,
      2px 2px 0 #bbb,
      3px 3px 0 #aaa,
      4px 4px 0 #999,
      5px 5px 0 #888,
      6px 6px 0 #777,
      7px 7px 0 #666,
      8px 8px 15px rgba(0,0,0,0.5)
    `,
  };

  return (
    <div style={containerStyle}>
      <div style={textStyle}>
        W I P
      </div>
    </div>
  );
}

// The main page component
export default function InteractivePage() {
  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* The 3D Text */}
      <ThreeDText />

      {/* Back to Home Link */}
      <Link href="/" 
            className="absolute bottom-10 z-10 text-gray-500 font-mono text-sm
                       hover:text-white transition-all duration-300">
        &larr; Back to Home
      </Link>
    </div>
  );
}