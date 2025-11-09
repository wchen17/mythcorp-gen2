'use client';

import React, { useState } from 'react';

// --- TYPE 1: Define the props we expect from page.tsx ---
interface NewLandingPageProps {
  onEnterExperience: () => void;
  onEnterInteractive: () => void;
}

export function NewLandingPage({ onEnterExperience, onEnterInteractive }: NewLandingPageProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  // --- TYPE 2: State for the new pop-up banner ---
  const [showBanner, setShowBanner] = useState(false);

  // --- TYPE 3: Effect to show the banner after 3 seconds ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 3000); // 3-second delay

    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []); // The empty array [] means this effect runs only once
  
  // Create floating particles effect
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${15 + Math.random() * 10}s`,
  }))

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* --- This style tag adds the fade-in animation --- */}
      <style>{`
        @keyframes fadeInBottom {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-bottom {
          animation: fadeInBottom 0.5s ease-out;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        }
        .particle {
          animation: float linear infinite;
        }
      `}</style>

      {/* Background Image with Blur and Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          // Use the uploaded image
          backgroundImage: 'url(chicagoskyline.jpg)',
          filter: 'blur(4px)',
          transform: 'scale(1.1)',
        }}
      />
      
      {/* Ethereal Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-purple-900/20 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-blue-900/20" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: particle.left,
              bottom: '-10px',
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
              boxShadow: '0 0 4px rgba(0, 255, 255, 0.8)',
            }}
          />
        ))}
      </div>

      {/* Header Navigation */}
      <header className="relative z-10 fixed top-0 left-0 right-0">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: Menu */}
          <div className="relative">
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowMenu(!showMenu)}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`w-full h-0.5 bg-white transition-transform duration-300 ${showMenu ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-full h-0.5 bg-white transition-opacity duration-300 ${showMenu ? 'opacity-0' : ''}`}></div>
                <div className={`w-full h-0.5 bg-white transition-transform duration-300 ${showMenu ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
              {/* --- MODIFIED: Font weight set to normal --- */}
              <span className="text-sm font-normal text-white tracking-wide">MENU</span>
            </div>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute top-full left-0 mt-4 bg-black/95 border-2 border-cyan-500/50 min-w-64 z-20 shadow-[0_0_30px_rgba(0,255,255,0.3)]">
                <div className="p-1">
                  <Link 
                    href="/experience" 
                    className="block px-4 py-3 text-white font-medium tracking-wide hover:bg-cyan-500/20 border-b border-cyan-500/20 transition-all hover:shadow-[inset_0_0_10px_rgba(0,255,255,0.2)]"
                  >
                    3D EXPERIENCE
                  </Link>
                  <Link 
                    href="/interactive" 
                    className="block px-4 py-3 text-white font-medium tracking-wide hover:bg-cyan-500/20 border-b border-cyan-500/20 transition-all hover:shadow-[inset_0_0_10px_rgba(0,255,255,0.2)]"
                  >
                    INTERACTIVE LOGO
                  </Link>
                  <Link 
                    href="/about" 
                    className="block px-4 py-3 text-white font-medium tracking-wide hover:bg-cyan-500/20 border-b border-cyan-500/20 transition-all hover:shadow-[inset_0_0_10px_rgba(0,255,255,0.2)]"
                  >
                    ABOUT
                  </Link>
                  <Link 
                    href="/contact" 
                    className="block px-4 py-3 text-white font-medium tracking-wide hover:bg-cyan-500/20 border-b border-cyan-500/20 transition-all hover:shadow-[inset_0_0_10px_rgba(0,255,255,0.2)]"
                  >
                    CONTACT
                  </Link>
                  
                  {/* Secret Menu */}
                  <details className="border-t-2 border-cyan-500/30 mt-2">
                    <summary className="px-4 py-3 text-cyan-400 font-mono text-xs tracking-widest cursor-pointer hover:bg-cyan-500/10 transition-all">
                      🔒 SECRET MENU
                    </summary>
                    <div className="bg-black/50 border-t border-cyan-500/20">
                      <Link 
                        href="/animals" 
                        className="block px-6 py-2 text-orange-400/70 font-mono text-sm hover:bg-orange-500/10 transition-all"
                      >
                        🚧 Animals [WIP]
                      </Link>
                      <Link 
                        href="/chat" 
                        className="block px-6 py-2 text-orange-400/70 font-mono text-sm hover:bg-orange-500/10 transition-all"
                      >
                        🚧 Chat [WIP]
                      </Link>
                    </div>
                  </details>
                </div>
              </div>
            )}
          </div>

          {/* Center: Logo */}
          <div className="flex flex-col items-center">
            <Link href="/" className="font-serif text-5xl font-medium text-white tracking-wider drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
              MYTHCORP
            </a>
            <span className="text-sm font-serif tracking-widest text-white/80 mt-1">
              FOUNDED IN CHICAGO
            </span>
          </div>

          {/* Right: Navigation */}
          <div className="flex space-x-6">
              {/* --- MODIFIED: Font weight set to normal --- */}
              <a 
                href="/about" 
                className="text-sm font-serif font-medium text-white hover:text-cyan-300 transition-all underline underline-offset-4 tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              >
                ABOUT US
              </a>
              {/* --- MODIFIED: Font weight set to normal --- */}
              <a 
                href="/contact" 
                className="text-sm font-serif font-medium text-white hover:text-cyan-300 transition-all underline underline-offset-4 tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              >
                CONTACT
              </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 h-screen flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4">
          
          {/* --- MODIFIED: Title and Underline --- */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 leading-tight tracking-wider">
              <span className="text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.6)]">DISCOVER</span>{' '}
              <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">YOUR</span>{' '}
              <span className="text-yellow-400 font-black tracking-wide drop-shadow-[0_0_25px_rgba(250,204,21,0.7)]">POTENTIAL</span>
            </h1>
            <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
          </div>
          
          {/* Enhanced Separator (Unchanged) */}
          <div className="flex items-center justify-center my-8">
            <div className="w-32 h-0.5 bg-white/40"></div>
            <div className="mx-4 text-white/60 text-sm font-mono tracking-widest">EST. 2024</div>
            <div className="w-32 h-0.5 bg-white/40"></div>
          </div>

        </div>
      </main>

    </div>
  );
}