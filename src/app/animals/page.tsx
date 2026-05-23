'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SiteHeader } from '../components/SiteHeader';

type AnimalGif = {
  url: string;
  title: string;
  emoji: string;
  description: string;
};

const ANIMAL_GIFS: ReadonlyArray<AnimalGif> = [
  {
    url: 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
    title: 'Happy Guinea Pig Munching Lettuce',
    emoji: '🐹🥬',
    description: 'Watch this adorable guinea pig enjoy some fresh lettuce!',
  },
  {
    url: 'https://media.giphy.com/media/l3q2zbskZp2j8wniE/giphy.gif',
    title: 'Hamster Eating Carrot',
    emoji: '🐹🥕',
    description: 'Tiny hamster, big carrot dreams!',
  },
  {
    url: 'https://media.giphy.com/media/3o7TKMjfvT3qvUNqzC/giphy.gif',
    title: 'Bunny Enjoying Fresh Greens',
    emoji: '🐰🥗',
    description: 'This bunny knows how to appreciate a good salad!',
  },
  {
    url: 'https://media.giphy.com/media/l0IylSajlbPRFxH8Y/giphy.gif',
    title: 'Guinea Pig Veggie Party',
    emoji: '🐹🌶️',
    description: 'Veggie time is the best time!',
  },
  {
    url: 'https://media.giphy.com/media/3o6Zt0hNCfak3QCqsw/giphy.gif',
    title: 'Rabbit Chomping Vegetables',
    emoji: '🐇🥦',
    description: 'Nom nom nom, broccoli is delicious!',
  },
];

export default function AnimalsPage() {
  const [currentGif, setCurrentGif] = useState<AnimalGif | null>(null);

  const pickRandomGif = () => {
    setCurrentGif(ANIMAL_GIFS[Math.floor(Math.random() * ANIMAL_GIFS.length)]);
  };

  useEffect(() => {
    pickRandomGif();
  }, []);

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 pt-24 pb-16 sm:px-6">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
            [ INTERMISSION ]
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            🐹 Animal Break Time 🥕
          </h1>
          <p className="mt-3 text-sm text-[color:var(--fg-muted)]">
            Take a moment. Enjoy some animals enjoying some snacks.
          </p>
        </div>

        <div className="themed-surface themed-surface-interactive mt-8 p-6">
          {currentGif ? (
            <div className="text-center">
              <div className="mb-4 animate-bounce text-7xl sm:text-8xl">
                {currentGif.emoji}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentGif.url}
                alt={currentGif.title}
                className="mx-auto w-full max-w-xl rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <p className="mt-4 text-lg font-semibold text-[color:var(--accent-soft)]">
                {currentGif.title}
              </p>
              <p className="mt-1 text-sm text-[color:var(--fg-muted)]">
                {currentGif.description}
              </p>
            </div>
          ) : (
            <p className="py-16 text-center text-[color:var(--fg-subtle)]">
              loading adorable content...
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={pickRandomGif}
            className="themed-button px-6 py-2.5 text-sm font-bold tracking-wide"
          >
            🎲 SHOW ME ANOTHER
          </button>
          <Link
            href="/"
            className="themed-surface themed-surface-interactive px-6 py-2.5 font-mono text-xs uppercase tracking-widest"
          >
            ← BACK HOME
          </Link>
        </div>

        <div className="mt-10 rounded-lg border border-[color:var(--accent-warm)]/40
                        bg-[color:var(--accent-warm)]/5 p-5">
          <h3 className="mb-2 font-serif text-base font-semibold text-[color:var(--accent-warm)]">
            🌟 Did you know?
          </h3>
          <ul className="space-y-1.5 text-sm text-[color:var(--fg-muted)]">
            <li>• Guinea pigs need fresh veggies daily, they can&rsquo;t produce their own Vitamin C.</li>
            <li>• Rabbits can eat their weight in hay every week.</li>
            <li>• Hamsters store food in their cheek pouches for later.</li>
            <li>• Guinea pig teeth never stop growing, so they chew constantly.</li>
          </ul>
        </div>

        <p className="mt-8 text-center text-xs text-[color:var(--fg-subtle)]">
          This page exists because sometimes you just need to watch a cute animal eat a carrot.
          <br />
          GIFs courtesy of GIPHY.
        </p>
      </main>
    </div>
  );
}
