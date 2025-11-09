// src/app/about/page.tsx
'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: Menu */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
            </div>
            <span className="text-sm font-medium">MENU</span>
          </div>

          {/* Center: Logo */}
          <div className="flex flex-col items-center">
            <Link href="/" className="text-2xl font-bold font-serif tracking-wide">
              MYTHCORP
            </Link>
            <span className="text-xs font-sans tracking-wider opacity-70">
              FOUNDED IN CHICAGO
            </span>
          </div>

          {/* Right: Navigation */}
          <div className="flex space-x-8">
            <Link href="/about" className="text-sm font-medium underline">
              ABOUT US
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline">
              CONTACT
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center pt-20">
        <div className="text-center max-w-2xl px-6">
          <h1 className="text-4xl font-bold mb-6">ABOUT US</h1>
          <p className="text-lg leading-relaxed opacity-80 mb-8">
            MYTHCORP was founded in Chicago with a vision to ????. We believe in discovering potential and exploring extraordinary 
             that shape the future.
          </p>
          <p className="text-base opacity-60">
            This is a placeholder page. More content coming soon........
          </p>
        </div>
      </main>
    </div>
  );
}