'use client';

import React, { useState } from 'react';
// We will create these two components in the next steps
import { MainMenu } from './MainMenu';
import { Simulation } from './Simulation';

// This is the main page component
export default function ExperiencePage() {
  // We'll lift the state up to this page.
  // 'menu' | 'simulation' | 'settings'
  const [appState, setAppState] = useState('menu');

  // Render content based on the current state
  switch (appState) {
    case 'simulation':
      // Show the main 3D simulation
      return <Simulation onExit={() => setAppState('menu')} />;
    
    case 'settings':
      // We can build this settings page later
      return (
        <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center">
          <h1 className="text-2xl font-serif mb-4">SETTINGS (WIP)</h1>
          <button
            onClick={() => setAppState('menu')}
            className="px-4 py-2 bg-cyan-500 text-black font-bold rounded hover:bg-cyan-400"
          >
            Back to Menu
          </button>
        </div>
      );

    case 'menu':
    default:
      // Show the main menu
      return (
        <MainMenu
          onStart={() => setAppState('simulation')}
          onSettings={() => setAppState('settings')}
        />
      );
  }
}