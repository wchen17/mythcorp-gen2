'use client';

import React, { useState, useEffect } from 'react';

interface NewLandingPageProps {
  onEnterExperience: () => void;
  onEnterInteractive: () => void;
}

export function NewLandingPage({ onEnterExperience, onEnterInteractive }: NewLandingPageProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showMenuNotice, setShowMenuNotice] = useState(false);
  const [hasShownMenuNotice, setHasShownMenuNotice] = useState(false);
  const [showMisalignedPopup, setShowMisalignedPopup] = useState(false);
  const [showSecretPopup, setShowSecretPopup] = useState(false);

  // --- NEW: State for the alignment line ---
  const [showAlignmentLine, setShowAlignmentLine] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleMenuOpen = () => {
    const opening = !showMenu;
    setShowMenu(opening);

    if (opening && !hasShownMenuNotice) {
      // --- MODIFIED: Delay changed to 4 seconds ---
      setTimeout(() => {
        setShowMenuNotice(true);
      }, 4000); // 4 second delay
      
      setHasShownMenuNotice(true);
    }
  };

  const handleSecretMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMenu(false);
    setShowSecretPopup(true);
  };

  // --- NEW: Handler for the alignment line ---
  const handleAlignmentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMenu(false);
    setShowAlignmentLine(!showAlignmentLine); // Toggle the line
  };

  return (
    <React.Fragment>
      
      {/* Main Page Container */}
      <div className="min-h-screen relative overflow-hidden font-sans">
        
        <style>{`
          /* ... (your @keyframes) ... */
          @keyframes fadeInBottom {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
          .animate-fade-in-bottom {
            animation: fadeInBottom 0.5s ease-out;
          }
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-down {
            animation: fadeInDown 0.3s ease-out;
          }

          /* --- NEW: Animation for the RGB line --- */
          @keyframes rgb-flash {
            0% { background: red; }
            33% { background: lime; }
            66% { background: blue; }
            100% { background: red; }
          }
          .animate-rgb-flash {
            animation: rgb-flash 0.5s linear infinite;
          }
        `}</style>

        {/* ... (Backgrounds and Overlays) ... */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/chicagoskyline.jpg)',
            filter: 'blur(4px)',
            transform: 'scale(1.1)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-purple-900/20 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-blue-900/20" />

        {/* Header */}
        <header className="relative z-10 fixed top-0 left-0 right-0">
          <div className="grid grid-cols-3 items-center px-6 py-4">
            
            {/* Left: Menu */}
            <div className="relative justify-self-start">
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleMenuOpen} // Uses handler with 4s delay
              >
                {/* ... (hamburger icon) ... */}
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <div className={`w-full h-0.5 bg-white transition-transform duration-300 ${showMenu ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                  <div className={`w-full h-0.5 bg-white transition-opacity duration-300 ${showMenu ? 'opacity-0' : ''}`}></div>
                  <div className={`w-full h-0.5 bg-white transition-transform duration-300 ${showMenu ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                </div>
                <span className="text-sm font-normal text-white tracking-wide">MENU</span>
              </div>
              
              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute top-full left-0 mt-4 min-w-64 z-20
                                bg-black/70 backdrop-blur-md border border-white/20 rounded-lg
                                shadow-2xl animate-fade-in-down">
                  
                  <div className="p-2 flex flex-col space-y-1">
                    <span className="text-white/60 text-xs uppercase tracking-widest px-3 pt-2 pb-1">Navigation</span>
                    
                    <a href="#" className="block px-3 py-2 text-white/90 font-serif rounded opacity-70 cursor-not-allowed" onClick={(e) => e.preventDefault()}>
                      About Us
                    </a>
                    <a href="#" className="block px-3 py-2 text-white/90 font-serif rounded opacity-70 cursor-not-allowed" onClick={(e) => e.preventDefault()}>
                      Contact
                    </a>

                    {/* --- NEW: Alignment Line Button --- */}
                    <a 
                      href="#" 
                      className="block px-3 py-2 text-yellow-300/80 font-mono text-xs rounded hover:bg-white/10 transition-all"
                      onClick={handleAlignmentClick}
                    >
                      {showAlignmentLine ? 'Hide' : 'Show'} Me The Misalignment
                    </a>
                    
                    <details className="border-t border-white/20 mt-2 pt-2">
                      <summary 
                        className="px-3 py-2 text-cyan-400 font-mono text-xs tracking-widest cursor-pointer hover:bg-white/10 rounded transition-all"
                        onClick={handleSecretMenuClick}
                      >
                        🔒 SECRET MENU
                      </summary>
                    </details>
                  </div>
                </div>
              )}
            </div>

            {/* ... (Center: Logo) ... */}
            <div className="flex flex-col items-center justify-self-center">
              <a href="/" className="font-serif text-5xl font-medium text-white tracking-wider drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" onClick={(e) => e.preventDefault()}>
                MYTHCORP
              </a>
              <span className="text-sm font-serif tracking-widest text-white/80 mt-1">
                FOUNDED IN CHICAGO
              </span>
            </div>

            {/* ... (Right: Navigation) ... */}
            <div className="flex space-x-6 justify-self-end">
              <a href="/about" className="text-sm font-serif font-medium text-white hover:text-cyan-300 transition-all underline underline-offset-4 tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                ABOUT US
              </a>
              <a href="/contact" className="text-sm font-serif font-medium text-white hover:text-cyan-300 transition-all underline underline-offset-4 tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                CONTACT
              </a>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="relative z-10 h-screen flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-4">
            
            {/* --- MODIFIED: onClick is now on the parent div --- */}
            <div 
              className="mb-8 cursor-pointer"
              onClick={() => setShowMisalignedPopup(true)}
            >
              <div className="inline-block">
                <h1 className="text-5xl md:text-7xl font-serif font-extrabold leading-tight tracking-tight
                              grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 md:gap-x-6">
                  
                  <span className="text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.6)] text-right">
                    DISCOVER
                  </span>
                  <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] text-center">
                    YOUR
                  </span>
                  <span className="text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.7)] text-left">
                    POTENTIAL
                  </span>
                </h1>
                <div className="w-full h-0.5 bg-white mt-2 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
              </div>
            </div>
            
            {/* ... (Separator) ... */}
            <div className="flex items-center justify-center my-8">
              <div className="w-32 h-0.5 bg-white/40"></div>
              <div className="mx-4 text-white/60 text-sm font-mono tracking-widest">EST. 2024</div>
              <div className="w-32 h-0.5 bg-white/40"></div>
            </div>

          </div>
        </main>
      </div>

      {/* ======================================================================
      === POPUPS (MOVED OUTSIDE) ===
      ======================================================================
      */}
      
      {/* --- NEW: Alignment Line Visualizer --- */}
      {showAlignmentLine && (
        <div 
          className="fixed inset-0 z-[100] cursor-pointer"
          onClick={() => setShowAlignmentLine(false)} // Click anywhere to close
        >
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 animate-rgb-flash"
               style={{ transform: 'translateX(-50%)' }}>
          </div>
        </div>
      )}

      {/* --- Pop-up Banner --- */}
      {showBanner && (
        <div className="fixed bottom-10 left-1/2 z-50 
                          flex items-center gap-6 p-4
                          bg-black/70 backdrop-blur-md border border-white/20 rounded-lg
                          shadow-2xl animate-fade-in-bottom">
          {/* ... (Banner buttons) ... */}
          <span className="text-white/90 text-sm font-medium">Ready to see more?</span>
          <button onClick={onEnterExperience} className="bg-cyan-400 text-black font-bold py-2 px-5 rounded hover:bg-cyan-300 transition-all transform hover:scale-105 text-sm tracking-wide">
            Enter 3D Experience
          </button>
          <button onClick={onEnterInteractive} className="bg-gray-700 text-white font-medium py-2 px-5 rounded hover:bg-gray-600 transition-all text-sm">
            View 3D Logo
          </button>
        </div>
      )}

      {/* --- Snarky Menu Notice Modal (With 4s Delay) --- */}
      {showMenuNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-black/80 border border-white/20 rounded-lg shadow-2xl
                        max-w-sm m-4 p-6
                        animate-fade-in-down flex flex-col"
               style={{ animationName: 'fadeInDown', animationDuration: '0.3s' }}>
            
            <h3 className="text-xl font-serif font-bold text-cyan-300 mb-3">A Quick Heads-Up...</h3>
            
            {/* --- MODIFIED: Text updated and <strong> tag used --- */}
            <p className="text-white/80 mb-4 text-sm font-sans">
              Yeah, so the 'About Us' and 'Contact' links in this menu are kinda there to fill in space (and are on vacation).
              <br/><br/>
              Please use the <strong>real ones on the top right</strong> of the page. They actually work (probably).
            </p>
            <button
              onClick={() => setShowMenuNotice(false)}
              className="bg-cyan-400 text-black font-bold py-2 px-6 rounded
                         hover:bg-cyan-300 transition-all transform hover:scale-105 text-sm tracking-wide self-end"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* --- Misaligned Text Popup --- */}
      {showMisalignedPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-black/80 border border-yellow-400/50 rounded-lg shadow-2xl
                        max-w-sm m-4 p-6 text-center
                        animate-fade-in-down flex flex-col items-center"
               style={{ animationName: 'fadeInDown', animationDuration: '0.3s' }}>
            
            <div className="text-5xl mb-4">👀</div>
            <h3 className="text-xl font-serif font-bold text-yellow-300 mb-2">Yep, We Know.</h3>
            <p className="text-white/80 mb-6">
              Yes, it's not aligned with the logo. It's... a work in progress.
              <br/>
              (We're trying to figure it out sooner or later.)
            </p>
            <button
              onClick={() => setShowMisalignedPopup(false)}
              className="bg-yellow-400 text-black font-bold py-2 px-6 rounded
                         hover:bg-yellow-300 transition-all transform hover:scale-105 text-sm tracking-wide"
            >
              WE BELIEVE IN YOU
            </button>
          </div>
        </div>
      )}

      {/* --- Secret Menu Popup --- */}
      {showSecretPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          {/* ... (Secret Popup JSX) ... */}
          <div className="bg-black/80 border border-red-400/50 rounded-lg shadow-2xl
                        max-w-sm m-4 p-6 text-center
                        animate-fade-in-down flex flex-col items-center"
               style={{ animationName: 'fadeInDown', animationDuration: '0.3s' }}>
            
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-serif font-bold text-red-400 mb-2">CLASSIFIED</h3>
            <p className="text-white/80 mb-6">
              C'mon, did you really think it would be that easy?
              <br/><br/>
              It's a <strong>secret</strong> menu for a reason.
            </p>
            <button
              onClick={() => setShowSecretPopup(false)}
              className="bg-red-400 text-black font-bold py-2 px-6 rounded
                         hover:bg-red-300 transition-all transform hover:scale-105 text-sm tracking-wide"
            >
              FINE, I'LL LEAVE
            </button>
          </div>
        </div>
      )}

    </React.Fragment>
  );
}