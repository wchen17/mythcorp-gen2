// src/app/components/InteractiveMythCorpExperience.tsx
'use client';

import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, PerspectiveCamera, Stars, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Group } from 'three';
import Link from 'next/link';

// Interactive Menu Component
function InteractiveMenu({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="absolute top-8 left-8 z-50">
      {/* Menu Toggle Button */}
      <button
        onClick={onToggle}
        className={`relative w-16 h-16 rounded-full border-2 transition-all duration-300 backdrop-blur-sm ${
          isOpen 
            ? 'border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/50' 
            : 'border-cyan-400/30 bg-black/30 hover:border-cyan-400/60 hover:bg-cyan-400/10'
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
            <div className={`w-6 h-0.5 bg-cyan-400 transition-all duration-300 ${isOpen ? 'rotate-90' : ''} mb-1`}></div>
            <div className={`w-6 h-0.5 bg-cyan-400 transition-all duration-300 ${isOpen ? 'opacity-0' : ''} mb-1`}></div>
            <div className={`w-6 h-0.5 bg-cyan-400 transition-all duration-300 ${isOpen ? '-rotate-90' : ''}`}></div>
          </div>
        </div>
      </button>

      {/* Menu Panel */}
      <div className={`absolute top-20 left-0 transition-all duration-300 ${
        isOpen 
          ? 'opacity-100 transform translate-y-0 pointer-events-auto' 
          : 'opacity-0 transform -translate-y-4 pointer-events-none'
      }`}>
        <div className="bg-black/80 border border-cyan-400/30 rounded-lg p-6 backdrop-blur-sm min-w-64">
          <h3 className="text-cyan-400 font-mono text-lg mb-4 border-b border-cyan-400/30 pb-2">
            MYTHCORP NAVIGATION
          </h3>
          
          <div className="space-y-3">
            <Link 
              href="/about"
              className="block w-full text-left p-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10 rounded transition-all duration-200 border border-transparent hover:border-cyan-400/30"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">ℹ️</span>
                <div>
                  <div className="font-mono">About Us</div>
                  <div className="text-xs opacity-70">Learn about MYTHCORP</div>
                </div>
              </div>
            </Link>
            
            <Link 
              href="/contact"
              className="block w-full text-left p-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10 rounded transition-all duration-200 border border-transparent hover:border-cyan-400/30"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">📞</span>
                <div>
                  <div className="font-mono">Contact</div>
                  <div className="text-xs opacity-70">Get in touch</div>
                </div>
              </div>
            </Link>
            
            <Link 
              href="/betademo"
              className="block w-full text-left p-3 text-gray-300 hover:text-purple-400 hover:bg-purple-400/10 rounded transition-all duration-200 border border-transparent hover:border-purple-400/30"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">🌀</span>
                <div>
                  <div className="font-mono">Beta Demo</div>
                  <div className="text-xs opacity-70">3D Experience</div>
                </div>
              </div>
            </Link>
            
            <Link 
              href="/"
              className="block w-full text-left p-3 text-gray-300 hover:text-pink-400 hover:bg-pink-400/10 rounded transition-all duration-200 border border-transparent hover:border-pink-400/30"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">🏠</span>
                <div>
                  <div className="font-mono">Home</div>
                  <div className="text-xs opacity-70">Return to NEXUS</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Floating Logo Component
function FloatingLogo() {
  const logoRef = useRef<Group>(null!);

  useFrame((state) => {
    if (logoRef.current) {
      // Smooth floating animation
      logoRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      logoRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      
      // Mouse interaction
      const mouseX = (state.mouse.x * 0.5);
      const mouseY = (state.mouse.y * 0.5);
      logoRef.current.rotation.x += (mouseY - logoRef.current.rotation.x) * 0.02;
      logoRef.current.rotation.z += (mouseX - logoRef.current.rotation.z) * 0.02;
    }
  });

  return (
    <group ref={logoRef} position={[0, 0, 0]}>
      <Center>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={2}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelSegments={5}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          MYTHCORP
          <meshBasicMaterial color="#00ffff" toneMapped={false} transparent opacity={0.9} />
        </Text3D>
      </Center>
      
      {/* Floating particles around the logo */}
      <Stars radius={5} depth={2} count={100} factor={2} saturation={0} fade speed={0.5} />
    </group>
  );
}

// Enhanced Spectre Model with better positioning
function EnhancedSpectreModel() {
  const { scene } = useGLTF('/spectre.glb');
  const groupRef = useRef<Group>(null!);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
      groupRef.current.position.x = 3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      groupRef.current.position.y = -1 + Math.cos(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive 
        object={scene} 
        scale={0.6}
        position={[0, 0, -2]} 
        rotation={[0, -0.5, 0]}
      >
        <meshStandardMaterial 
          color="#888888" 
          emissive="#00ffff" 
          emissiveIntensity={0.7} 
          toneMapped={false} 
          transparent 
          opacity={0.8} 
        />
      </primitive>
      <pointLight color="#00ffff" intensity={2} distance={10} position={[0, 0, 2]} />
    </group>
  );
}

// Main Interactive Experience Component
export function InteractiveMythCorpExperience() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative w-full h-full bg-black">
      {/* Interactive Menu */}
      <InteractiveMenu isOpen={menuOpen} onToggle={() => setMenuOpen(!menuOpen)} />
      
      {/* Status Indicator */}
      <div className="absolute top-8 right-8 z-40">
        <div className="bg-black/50 border border-cyan-400/30 text-cyan-400 px-4 py-2 rounded-md backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-mono">MYTHCORP ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Background with Chicago skyline */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(/chicagoskyline.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(5px) grayscale(0.6) brightness(0.4)',
          zIndex: 1,
        }}
      />

      {/* 3D Canvas */}
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}
        gl={{ alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />
        <pointLight position={[-10, -10, -5]} color="#ff00ff" intensity={0.3} />

        <Suspense fallback={null}>
          <FloatingLogo />
          <EnhancedSpectreModel />
        </Suspense>

        <Stars radius={200} depth={50} count={3000} factor={4} saturation={0} fade speed={0.8} />

        <EffectComposer>
          <Bloom 
            intensity={0.8}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.3}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      {/* Interactive Elements Overlay */}
      <div className="absolute bottom-8 left-8 right-8 z-30">
        <div className="flex justify-between items-end">
          <div className="text-gray-400 font-mono text-sm">
            <div className="mb-2">MYTHCORP INTERACTIVE EXPERIENCE</div>
            <div className="text-xs opacity-70">Click and drag to explore • Open menu for navigation</div>
          </div>
          
          <div className="text-right text-gray-400 font-mono text-sm">
            <div className="mb-2">v2.1.0 ENHANCED</div>
            <div className="text-xs opacity-70">Status: OPERATIONAL</div>
          </div>
        </div>
      </div>
    </div>
  );
}