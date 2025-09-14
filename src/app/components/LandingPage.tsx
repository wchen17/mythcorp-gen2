// src/app/components/LandingPage.tsx
'use client';

// ADDED: useState and useEffect for handling the transition
import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text3D, Center, PerspectiveCamera, Stars, useGLTF, Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Group } from 'three';
// ADDED: The GSAP animation library
import gsap from 'gsap';

// A helper function for linear interpolation (smoothing).
const lerp = (start: number, end: number, alpha: number) => {
  return start * (1 - alpha) + end * alpha;
};

// --- Animated Star Component for the MYTHCORP Logo ---
function AnimatedStar({ position }: { position: [number, number, number] }) {
  const starRef = useRef<Group>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (starRef.current) {
      // Rotating animation
      starRef.current.rotation.z += delta * 2;
      
      // Pulsing scale effect
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 1;
      starRef.current.scale.setScalar(pulse * (hovered ? 1.5 : 1));
      
      // Floating motion
      starRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group 
      ref={starRef} 
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Star shape using multiple triangular faces */}
      <mesh>
        <cylinderGeometry args={[0, 0.1, 0.3, 5]} />
        <meshBasicMaterial color="#ffff00" toneMapped={false} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI]}>
        <cylinderGeometry args={[0, 0.1, 0.3, 5]} />
        <meshBasicMaterial color="#ffff00" toneMapped={false} />
      </mesh>
      {/* Glow effect */}
      <pointLight color="#ffff00" intensity={hovered ? 2 : 1} distance={3} />
    </group>
  );
}

// --- Spectre Model Component (Your positioning is preserved) ---
function SpectreModel() {
  const { scene } = useGLTF('/spectre.glb');
  const groupRef = useRef<Group>(null!);
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      // Your exact positioning code is here
      const margin = .05; 
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
        rotation={[0, -0.5, 0]}
      >
        {/* ADDED: transparent prop to allow fading */}
        <meshStandardMaterial color="#888888" emissive="#00ffff" emissiveIntensity={0.5} toneMapped={false} transparent opacity={1} />
      </primitive>
    </group>
  );
}

// --- The Interactive Logo Component with Animated Star ---
function InteractiveLogo({ onEnter }: { onEnter: () => void }) {
  const logoRef = useRef<Group>(null!);

  useFrame((state) => {
    if (logoRef.current) {
      logoRef.current.rotation.y = lerp(logoRef.current.rotation.y, state.mouse.x * 0.3, 0.05);
      logoRef.current.rotation.x = lerp(logoRef.current.rotation.x, -state.mouse.y * 0.3, 0.05);
    }
  });

  return (
    // The onClick event is now on the group
    <group ref={logoRef} onClick={onEnter}>
      <Center>
        {/* Temporary simplified text version - remove Text3D to avoid font loading issues */}
        <mesh>
          <boxGeometry args={[4, 1, 0.2]} />
          <meshBasicMaterial color="#00ffff" toneMapped={false} transparent opacity={0.8} />
        </mesh>
        <Text 
          fontSize={0.3}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          position={[0, 0, 0.11]}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          MYTHCORP
        </Text>
      </Center>
      {/* Animated star positioned between the O in MYTHCORP */}
      <AnimatedStar position={[0.8, 0, 0.1]} />
    </group>
  );
}


// --- The Main Landing Page Component (with Transition Logic) ---
export function LandingPage({ onTransitionComplete }: { onTransitionComplete: () => void }) {
  // State to track if we are animating out
  const [isExiting, setIsExiting] = useState(false);
  // Refs to control the elements we want to animate
  const contentRef = useRef<Group>(null!);
  const backgroundRef = useRef<HTMLDivElement>(null!);

  const handleEnter = () => {
    setIsExiting(true);
  };

  // This effect hook runs the animation when isExiting becomes true
  useEffect(() => {
    if (isExiting && contentRef.current && backgroundRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          // Tell the parent page the animation is done
          if (onTransitionComplete) onTransitionComplete();
        }
      });

      // Animate the background div fading to black
      tl.to(backgroundRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.in',
      }, 0);

      // Go through every object in our 3D scene...
      contentRef.current.traverse((child) => {
        // ...and if it has a material, fade its opacity to 0
        if ((child as any).material) {
          tl.to((child as any).material, {
            opacity: 0,
            duration: 1,
            ease: 'power2.in',
          }, 0.2); // Start this fade slightly after the background fade begins
        }
      });
    }
  }, [isExiting, onTransitionComplete]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }}>
      
      <div
        ref={backgroundRef}
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
          opacity: 1,
        }}
      />

      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}
        gl={{ alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        
        {/* We wrap all the 3D content in a single group with a ref */}
        <group ref={contentRef}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={0.5} />

          <Suspense fallback={null}>
            <InteractiveLogo onEnter={handleEnter} />
            <SpectreModel />
          </Suspense>

          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </group>

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
