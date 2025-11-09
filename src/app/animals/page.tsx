// src/app/animals/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AnimalsPage() {
  const [currentGif, setCurrentGif] = useState<typeof animalGifs[0] | null>(null);

  // Collection of animal eating scenarios - Using placeholder with instructions to add GIFs
  const animalGifs = [
    {
      url: 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif', // Guinea pig
      title: 'Happy Guinea Pig Munching Lettuce',
      emoji: '🐹🥬',
      description: 'Watch this adorable guinea pig enjoy some fresh lettuce!'
    },
    {
      url: 'https://media.giphy.com/media/l3q2zbskZp2j8wniE/giphy.gif', // Hamster
      title: 'Hamster Eating Carrot',
      emoji: '🐹🥕',
      description: 'Tiny hamster, big carrot dreams!'
    },
    {
      url: 'https://media.giphy.com/media/3o7TKMjfvT3qvUNqzC/giphy.gif', // Rabbit
      title: 'Bunny Enjoying Fresh Greens',
      emoji: '🐰🥗',
      description: 'This bunny knows how to appreciate a good salad!'
    },
    {
      url: 'https://media.giphy.com/media/l0IylSajlbPRFxH8Y/giphy.gif', // Guinea pig 2
      title: 'Guinea Pig Veggie Party',
      emoji: '🐹🌶️',
      description: 'Veggie time is the best time!'
    },
    {
      url: 'https://media.giphy.com/media/3o6Zt0hNCfak3QCqsw/giphy.gif', // Rabbit 2
      title: 'Rabbit Chomping Vegetables',
      emoji: '🐇🥦',
      description: 'Nom nom nom - broccoli is delicious!'
    },
  ];

  // Select random GIF on component mount and when refresh is clicked
  const selectRandomGif = () => {
    const randomIndex = Math.floor(Math.random() * animalGifs.length);
    setCurrentGif(animalGifs[randomIndex]);
  };

  useEffect(() => {
    selectRandomGif();
  }, []);

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
            <Link href="/about" className="text-sm font-medium hover:underline">
              ABOUT US
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline">
              CONTACT
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 px-6 flex flex-col items-center justify-center">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">🐹 ANIMAL BREAK TIME 🥕</h1>
          <p className="text-lg opacity-70 mb-8">
            Take a moment to enjoy some adorable animals munching on their favorite veggies
          </p>

          {/* GIF Display */}
          <div className="mb-8 bg-white/5 border-2 border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400/50 transition-all">
            {currentGif ? (
              <div>
                {/* Large Emoji Display as fallback */}
                <div className="text-9xl mb-4 animate-bounce">
                  {currentGif.emoji}
                </div>
                {/* Try to show GIF, fallback to emoji if it fails */}
                <img
                  src={currentGif.url}
                  alt={currentGif.title}
                  className="w-full max-w-2xl mx-auto rounded-lg"
                  onError={(e) => {
                    // Hide the image if it fails to load, emoji is already shown
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <p className="text-cyan-300 font-medium mt-4 text-xl">{currentGif.title}</p>
                <p className="text-white/70 text-sm mt-2">{currentGif.description}</p>
              </div>
            ) : (
              <div className="w-full max-w-2xl mx-auto h-64 flex items-center justify-center">
                <p className="text-white/50">Loading adorable content...</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center mb-8">
            <button
              onClick={selectRandomGif}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
            >
              🎲 SHOW ME ANOTHER!
            </button>
            <Link
              href="/"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-3 px-8 rounded-lg transition-all"
            >
              ← BACK TO HOME
            </Link>
          </div>

          {/* Fun Facts */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 text-left">
            <h3 className="text-yellow-400 font-bold text-lg mb-3">🌟 Did You Know?</h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>• Guinea pigs can't produce their own Vitamin C and need fresh veggies daily!</li>
              <li>• Rabbits can eat their weight in hay every week!</li>
              <li>• Hamsters store food in their cheek pouches for later snacking</li>
              <li>• A guinea pig's teeth never stop growing, so they need to chew constantly</li>
            </ul>
          </div>

          {/* Footer Note */}
          <p className="text-white/40 text-xs mt-8">
            This page exists because sometimes you just need to watch a cute animal eat a carrot. 
            <br />
            GIFs courtesy of GIPHY 🎥
          </p>
        </div>
      </main>
    </div>
  );
}
