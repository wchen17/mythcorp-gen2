// src/app/components/LandingPage.tsx
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Image, Text3D, Center, PerspectiveCamera } from '@react-three/drei';
import { useRef } from 'react';
import { Group } from 'three';

function InteractiveLogo({ onEnter }: { onEnter: () => void }) {
  const logoRef = useRef<Group>(null!);

  // Subtle rotation based on mouse position for a parallax effect
  useFrame((state) => {
    if (logoRef.current) {
      logoRef.current.rotation.y = state.mouse.x * 0.1;
      logoRef.current.rotation.x = -state.mouse.y * 0.1;
    }
  });

  return (
    <group ref={logoRef}>
      <Center>
        <Text3D
          font="/fonts/Inter_Bold.json" // Make sure to have a font file in /public/fonts
          size={1.5}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          onClick={onEnter} // Trigger enter on click
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          MYTHCORP
          <meshStandardMaterial color="#ffffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </Text3D>
      </Center>
    </group>
  );
}

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Background Image */}
      <Image
        url="/chicagoskyline.jpg"
        scale={[30, 15]} // Adjust scale to fit the view
        position={[0, 0, -10]} // Position it behind the logo
        grayscale={0.5}
        toneMapped={false}
      />

      <InteractiveLogo onEnter={onEnter} />
    </Canvas>
  );
}
