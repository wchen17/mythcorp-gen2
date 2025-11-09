// src/app/components/Experience.tsx
'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text3D, Center, PerspectiveCamera, Stars, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Group } from 'three';
import { Header } from './Header';

// Helper function for smooth interpolation
const lerp = (start: number, end: number, alpha: number) => {
  return start * (1 - alpha) + end * alpha;
};

// SpectreModel Component with randomized initial rotation and enhanced visuals
function SpectreModel() {
  const { scene } = useGLTF('/spectre.glb');
  const groupRef = useRef<Group>(null!);
  const { viewport } = useThree();
  
  // Randomize initial rotation on mount
  const initialRotation = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      
      // Position in bottom right corner with margin
      const margin = 0.05;
      const positionX = viewport.width / 2 - margin;
      const positionY = -viewport.height / 2 + margin;
      groupRef.current.position.set(positionX, positionY, -4);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive 
        object={scene} 
        scale={0.4}
        position={[0, 0, 0]} 
        rotation={[0, initialRotation.current, 0]}
      >
        <meshStandardMaterial 
          color="#888888" 
          emissive="#00ffff" 
          emissiveIntensity={0.6} 
          toneMapped={false} 
          transparent
          opacity={1}
        />
      </primitive>
    </group>
  );
}

// Interactive 3D MYTHCORP Logo with mouse tracking
function InteractiveLogo() {
  const logoRef = useRef<Group>(null!);

  useFrame((state) => {
    if (logoRef.current) {
      // Smooth mouse-following rotation
      logoRef.current.rotation.y = lerp(logoRef.current.rotation.y, state.mouse.x * 0.3, 0.05);
      logoRef.current.rotation.x = lerp(logoRef.current.rotation.x, -state.mouse.y * 0.3, 0.05);
    }
  });

  return (
    <group ref={logoRef}>
      <Center>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={1.5}
          height={0.05}
          curveSegments={8}
          bevelEnabled
          bevelThickness={0.01}
          bevelSize={0.01}
          bevelSegments={3}
        >
          MYTHCORP
          <meshBasicMaterial 
            color="#00ffff" 
            toneMapped={false} 
            transparent 
            opacity={1} 
          />
        </Text3D>
      </Center>
    </group>
  );
}

export function Experience() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/chicagoskyline.jpg)',
          filter: 'blur(8px) grayscale(0.7) brightness(0.5)',
          transform: 'scale(1.1)', // Prevent blur edge artifacts
          zIndex: 1,
        }}
      />

      {/* Header */}
      <Header />

      {/* Main Content - Text Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 leading-tight">
            <span className="text-green-400">DISCOVER YOUR</span>
            <br />
            <span className="text-yellow-400">POTENTIAL</span>
          </h1>
        </div>
      </div>

      {/* 3D Scene Canvas */}
      <Canvas
        className="absolute top-0 left-0 w-full h-full"
        style={{ zIndex: 5 }}
        gl={{ alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />

        {/* Stars background */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Interactive 3D Logo */}
        <InteractiveLogo />
        
        {/* Spinning Spectre Model */}
        <SpectreModel />

        {/* Enhanced bloom effect */}
        <EffectComposer>
          <Bloom 
            intensity={0.8}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.2}
            mipmapBlur
            radius={0.85}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
