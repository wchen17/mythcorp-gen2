// src/app/components/Enhanced3DScene.tsx
'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { SpectreModel, BinarySphere, StarField } from './SpectreModel';

/**
 * Loading fallback for 3D components
 */
function Scene3DFallback() {
  return (
    <div className="flex items-center justify-center h-full w-full text-cyan-400">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-spin">⭐</div>
        <div className="text-lg mb-2">Loading 3D Environment...</div>
        <div className="text-sm opacity-70">Initializing WebGL renderer</div>
      </div>
    </div>
  );
}

/**
 * Enhanced 3D Scene with multiple interactive elements
 * Includes the rotating spectre model, binary spheres, and enhanced star field
 */
interface Enhanced3DSceneProps {
  className?: string;
}

export function Enhanced3DScene({ className = '' }: Enhanced3DSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`w-full h-full ${className}`}>
      <Suspense fallback={<Scene3DFallback />}>
        <Canvas
          gl={{ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
          }}
          camera={{ position: [0, 0, 10], fov: 75 }}
          onCreated={() => setIsLoaded(true)}
          style={{ background: 'transparent' }}
        >
          {/* Lighting setup */}
          <ambientLight intensity={0.3} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            color="#ffffff"
          />
          <directionalLight 
            position={[-10, -10, -5]} 
            intensity={0.5} 
            color="#00ffff"
          />

          {/* Camera setup */}
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />

          {/* 3D Components */}
          <StarField />
          <SpectreModel />
          <BinarySphere position={[-4, 2, -2]} />
          <BinarySphere position={[4, -2, -3]} />
          <BinarySphere position={[0, 3, -5]} />

          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom 
              intensity={0.5} 
              luminanceThreshold={0.1} 
              luminanceSmoothing={0.2} 
            />
            <ChromaticAberration 
              offset={[0.001, 0.001]} 
            />
          </EffectComposer>
        </Canvas>
      </Suspense>
    </div>
  );
}