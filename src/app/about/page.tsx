'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ... (Header - no changes from last time) ... */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
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
          <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="text-2xl font-bold font-serif tracking-wide">
              MYTHCORP
            </Link>
            <span className="text-xs font-sans tracking-wider opacity-70">
              FOUNDED IN CHICAGO
            </span>
          </div>
          <div className="flex space-x-8">
            <Link href="/about" className="text-sm font-medium text-cyan-300 underline underline-offset-4">
              ABOUT US
            </Link>
            <Link href="/contact" className="text-sm font-medium text-white hover:text-cyan-300 hover:underline underline-offset-4 transition-all">
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
            JUST AN IDEA
          </h1>
          {/* --- MODIFIED: Removed the "No grand promises..." line --- */}
          <p className="text-lg md:text-xl leading-relaxed text-white/90 mb-8 font-sans">
            Honestly? This is a passion project.
            <br/>
            It's a space to build, to learn, and to see what's possible.
          </p>
        </div>
        
        <div className="w-full max-w-xs h-px bg-white/20 my-10"></div>

        <div className="text-center max-w-lg">
          {/* --- MODIFIED: Updated AI and 'goal' text --- */}
          <p className="text-md md:text-lg leading-relaxed text-white/80 font-mono">
            Made with &lt;3 in Chicago.
            <br/>
            Powered by a creative partnership with AI, giving me a window into what is possible,
            and to one day, able to do better.
            <br/><br/>
            Something cool eventually.......
            <br/>
            (Check back later)
          </p>
        </div>
      </main>
    </div>
  );
}