// src/app/components/SpectreModel.tsx
'use client';

import React, { useRef, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Stars } from '@react-three/drei';
import { Group } from 'three';

/**
 * SpectreModel - The rotating 3D spectre model component
 * This component handles the main 3D model with rotation and positioning
 */
function SpectreModel() {
  const { scene } = useGLTF('/spectre.glb');
  const groupRef = useRef<Group>(null!);
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth rotation animation
      groupRef.current.rotation.y += delta * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
      
      // Dynamic positioning based on viewport
      const margin = 0.05; 
      const positionX = viewport.width / 2 - margin;
      const positionY = -viewport.height / 2 + margin;
      groupRef.current.position.set(positionX, positionY, -4);
      
      // Subtle floating animation
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive 
        object={scene} 
        scale={0.4}
        position={[0, 0, 0]} 
        rotation={[0, -0.5, 0]}
      />
      {/* Enhanced lighting for the model */}
      <pointLight color="#00ffff" intensity={1.5} distance={8} position={[2, 2, 2]} />
      <pointLight color="#ff00ff" intensity={1.0} distance={6} position={[-2, -1, 1]} />
    </group>
  );
}

/**
 * BinarySphere - A floating binary sphere with text animation
 * Creates a sphere with binary numbers floating around it
 */
function BinarySphere({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const sphereRef = useRef<Group>(null!);
  const [binaryText, setBinaryText] = React.useState('1010101');

  // Generate random binary text
  React.useEffect(() => {
    const interval = setInterval(() => {
      const newBinary = Array.from({ length: 7 }, () => Math.random() > 0.5 ? '1' : '0').join('');
      setBinaryText(newBinary);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      sphereRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group ref={sphereRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial 
          color="#00ff00" 
          transparent 
          opacity={0.3} 
          wireframe 
        />
      </mesh>
      {/* Glow effect */}
      <pointLight color="#00ff00" intensity={1} distance={4} />
    </group>
  );
}

/**
 * StarField - Enhanced star field with dynamic movement
 * Creates an immersive star field environment
 */
function StarField() {
  const starFieldRef = useRef<Group>(null!);
  
  useFrame((state) => {
    if (starFieldRef.current) {
      starFieldRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      starFieldRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={starFieldRef}>
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />
      {/* Additional particle effects */}
      <Stars 
        radius={200} 
        depth={100} 
        count={2000} 
        factor={2} 
        saturation={0.5} 
        fade 
        speed={0.5} 
      />
    </group>
  );
}

export { SpectreModel, BinarySphere, StarField };