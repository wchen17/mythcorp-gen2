// src/app/components/LandingPage.tsx
'use client';

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text3D, Center, PerspectiveCamera, Stars, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Group } from 'three';

// A helper function for linear interpolation (smoothing).
const lerp = (start: number, end: number, alpha: number) => {
  return start * (1 - alpha) + end * alpha;
};

// --- Spectre Model Component (Dialed In) ---
function SpectreModel() {
  const { scene } = useGLTF('/spectre.glb');
  const groupRef = useRef<Group>(null!);
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (groupRef.current) {
      // We still rotate the parent group for the animation
      groupRef.current.rotation.y += delta * 0.2;

      // --- Precise Positioning ---
      // We're targeting the bottom-right corner as you suggested.
      const margin = .05; // This is our distance from the edge.
      const positionX = viewport.width / 2 - margin;
      const positionY = -viewport.height / 2 + margin;
      groupRef.current.position.set(positionX, positionY, -4);
    }
  });

  return (
    // This is our "invisible cube" that we position.
    <group ref={groupRef}>
      {/* The model is the child. We apply corrections to it here. */}
      <primitive 
        object={scene} 
        scale={0.4}
        position={[0, 0, 0]} 
        // --- THE ORIENTATION FIX ---
        // This rotates the model INSIDE the group to make it "straight up".
        // The values are [X, Y, Z] in radians. Try changing them!
        // For example, [0, 0, 0] is its default, [0, Math.PI / 2, 0] is 90 degrees.
        rotation={[0, -0.5, 0]}
      />
    </group>
  );
}


// --- The Interactive Logo Component ---
function InteractiveLogo({ onEnter }: { onEnter: () => void }) {
  const logoRef = useRef<Group>(null!);

  useFrame((state) => {
    if (logoRef.current) {
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
          onClick={onEnter}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          MYTHCORP
          <meshBasicMaterial color="#00ffff" toneMapped={false} />
        </Text3D>
      </Center>
    </group>
  );
}


// --- The Main Landing Page Component ---
export function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }}>
      
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(/chicagoskyline.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px) grayscale(0.7) brightness(0.5)',
          zIndex: 1,
        }}
      />

      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}
        gl={{ alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />

        <Suspense fallback={null}>
          <InteractiveLogo onEnter={onEnter} />
          <SpectreModel />
        </Suspense>

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <EffectComposer>
          <Bloom 
            intensity={0.7}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.2}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
