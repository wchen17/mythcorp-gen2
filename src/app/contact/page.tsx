'use client';

import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header Navigation (Same as About page) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          
          {/* Left: Home Link */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`w-full h-0.5 bg-white transition-all`}></div>
                <div className={`w-1/2 h-0.5 bg-white transition-all`}></div>
                <div className={`w-full h-0.5 bg-white transition-all`}></div>
              </div>
              <span className="text-sm font-medium">HOME</span>
            </Link>
          </div>

          {/* Center: Logo */}
          <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="text-2xl font-bold font-serif tracking-wide">
              MYTHCORP
            </Link>
            <span className="text-xs font-sans tracking-wider opacity-70">
              FOUNDED IN CHICAGO
            </span>
          </div>

          {/* Right: Navigation */}
          <div className="flex space-x-8">
            <Link href="/about" className="text-sm font-medium text-white hover:text-cyan-300 hover:underline underline-offset-4 transition-all">
              ABOUT US
            </Link>
            <Link href="/contact" className="text-sm font-medium text-cyan-300 underline underline-offset-4">
              CONTACT
            </Link>
          </div>
        </div>
      </header>

      {/* ======================================================================
      === NEW PAGE CONTENT ===
      ======================================================================
      */}
      <main className="flex-1 flex flex-col items-center justify-center pt-20 px-6">
        <div className="text-center max-w-lg">
          
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-6">
            SAY HELLO
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-white/90 mb-8 font-sans">
            This is also a work in progress.
            <br/>
            So, these links don't *quite* work yet. But if this were a real company, this is where you'd find the contact info.
          </p>
        </div>
        
        <div className="w-full max-w-xs h-px bg-white/20 my-10"></div>

        <div className="text-center max-w-lg space-y-4 text-white/70 font-mono">
          <p>Email: info@mythcorp.com</p>
          <p>Phone: (676) 767-7676</p>
          <p>Chicago, IL</p>
          <p className="text-sm text-white/40 pt-4">
            (These are placeholders, by the way)
          </p>
        </div>
      </main>
    </div>
  );
}