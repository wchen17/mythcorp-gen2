// src/app/components/InteractiveExperience.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Enhanced3DScene } from './Enhanced3DScene';

/**
 * Control Panel Interface - Advanced UI for system interaction
 */
interface ControlPanelProps {
  selectedModule: string | null;
  onModuleSelect: (module: string) => void;
  systemStatus: string;
}

function ControlPanel({ selectedModule, onModuleSelect, systemStatus }: ControlPanelProps) {
  const [glitchCounter, setGlitchCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchCounter(prev => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const modules = [
    { id: 'neural', name: 'NEURAL LINK', color: 'from-purple-500 to-pink-500', status: 'ACTIVE' },
    { id: 'quantum', name: 'QUANTUM CORE', color: 'from-cyan-500 to-blue-500', status: 'STANDBY' },
    { id: 'matrix', name: 'MATRIX ACCESS', color: 'from-green-500 to-emerald-500', status: 'READY' },
    { id: 'cyber', name: 'CYBER SPACE', color: 'from-yellow-500 to-orange-500', status: 'ONLINE' }
  ];

  return (
    <div className="absolute top-4 left-4 z-40 bg-black/80 border border-cyan-400/30 rounded-lg p-6 backdrop-blur-md min-w-[300px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-cyan-400 font-mono text-lg">CONTROL PANEL</div>
        <div className={`w-3 h-3 rounded-full ${systemStatus === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
      </div>

      {/* System Status */}
      <div className="mb-6 p-3 bg-gray-900/50 rounded border border-gray-700">
        <div className="text-xs text-gray-400 mb-1">SYSTEM STATUS</div>
        <div className="text-green-400 font-mono">{systemStatus.toUpperCase()}</div>
        <div className="text-xs text-gray-500 mt-1">
          CYCLES: {glitchCounter.toString().padStart(6, '0')}
        </div>
      </div>

      {/* Module Grid */}
      <div className="space-y-2 mb-4">
        <div className="text-xs text-gray-400 mb-3">AVAILABLE MODULES</div>
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => onModuleSelect(module.id)}
            className={`w-full p-3 rounded border transition-all duration-300 font-mono text-sm
              ${selectedModule === module.id 
                ? 'border-white bg-white/10 text-white' 
                : 'border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
          >
            <div className="flex justify-between items-center">
              <span>{module.name}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                module.status === 'ACTIVE' ? 'bg-green-900/50 text-green-400' :
                module.status === 'READY' ? 'bg-cyan-900/50 text-cyan-400' :
                module.status === 'ONLINE' ? 'bg-yellow-900/50 text-yellow-400' :
                'bg-gray-900/50 text-gray-400'
              }`}>
                {module.status}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Module Info */}
      {selectedModule && (
        <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded">
          <div className="text-blue-400 text-sm font-mono mb-2">MODULE: {selectedModule.toUpperCase()}</div>
          <div className="text-xs text-gray-300">
            Ready for initialization. All systems nominal.
          </div>
          <div className="mt-2 h-1 bg-gray-800 rounded overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Data Stream Overlay - Shows flowing data streams
 */
function DataStreamOverlay() {
  const [streams, setStreams] = useState<string[]>([]);

  useEffect(() => {
    const generateStream = () => {
      const chars = '01ABCFabcdef';
      return Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    const interval = setInterval(() => {
      setStreams(prev => {
        const newStreams = [...prev.slice(-4), generateStream()];
        return newStreams;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-0 right-0 bottom-0 w-64 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/90"></div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-2 font-mono text-xs">
        {streams.map((stream, index) => (
          <div
            key={index}
            className="text-green-400/60 opacity-70 animate-pulse"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: '2s'
            }}
          >
            {stream}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Enhanced Interactive Experience - The main beta demo component
 * Features advanced 3D scene, control panel, and fluid animations
 */
interface InteractiveExperienceProps {
  onBack: () => void;
}

export function InteractiveExperience({ onBack }: InteractiveExperienceProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [systemStatus] = useState('online');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simulate system initialization
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId);
    // Add haptic feedback or sound effects here in the future
  };

  if (!isInitialized) {
    return (
      <div className="h-full w-full bg-black flex items-center justify-center">
        <div className="text-center text-cyan-400">
          <div className="text-6xl mb-6 animate-spin">⭐</div>
          <div className="text-2xl mb-4 font-mono">MYTHCORP</div>
          <div className="text-lg mb-2">Initializing Systems...</div>
          <div className="w-64 h-1 bg-gray-800 rounded overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      {/* Background with Chicago skyline */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/chicagoskyline.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(12px) grayscale(0.8) brightness(0.3)',
        }}
      />

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full text-cyan-400">
            <div className="text-center">
              <div className="text-4xl mb-4">🌟</div>
              <div className="text-xl">Loading 3D Environment...</div>
            </div>
          </div>
        }>
          <Enhanced3DScene />
        </Suspense>
      </div>

      {/* Control Panel */}
      <ControlPanel
        selectedModule={selectedModule}
        onModuleSelect={handleModuleSelect}
        systemStatus={systemStatus}
      />

      {/* Data Stream Overlay */}
      <DataStreamOverlay />

      {/* Bottom Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-40">
        <div className="bg-black/80 border border-gray-700 rounded-lg p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-sm font-mono">
            <div className="flex items-center space-x-6">
              <div className="text-gray-400">
                STATUS: <span className="text-green-400">OPERATIONAL</span>
              </div>
              <div className="text-gray-400">
                MODULE: <span className="text-cyan-400">{selectedModule?.toUpperCase() || 'NONE'}</span>
              </div>
            </div>
            <div className="text-gray-500">
              MYTHCORP BETA v2.1.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}