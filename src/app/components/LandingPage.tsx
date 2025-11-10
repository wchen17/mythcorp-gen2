'use client';

import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text3D, Center, PerspectiveCamera, Stars, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Group } from 'three';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';

// ... (lerp function) ...
const lerp = (start: number, end: number, alpha: number) => {
  return start * (1 - alpha) + end * alpha;
};

// ... (SpectreModel component) ...
function SpectreModel() {
  const { scene } = useGLTF('/spectre.glb');
  const groupRef = useRef<Group>(null!);
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
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
        <meshStandardMaterial color="#888888" emissive="#00ffff" emissiveIntensity={0.5} toneMapped={false} transparent opacity={1} />
      </primitive>
    </group>
  );
}


// ... (InteractiveLogo component) ...
function InteractiveLogo({ onNavigate }: { onNavigate: () => void }) {
  const logoRef = useRef<Group>(null!);

  useFrame((state) => {
    if (logoRef.current) {
      logoRef.current.rotation.y = lerp(logoRef.current.rotation.y, state.mouse.x * 0.3, 0.05);
      logoRef.current.rotation.x = lerp(logoRef.current.rotation.x, -state.mouse.y * 0.3, 0.05);
    }
  });

  return (
    <group ref={logoRef} onClick={onNavigate}>
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
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          MYTHCORP
          <meshBasicMaterial color="#00ffff" toneMapped={false} transparent opacity={1} />
        </Text3D>
      </Center>
    </group>
  );
}


// --- Main Landing Page Component (with Transition Logic) ---
export function LandingPage({ onTransitionComplete }: { onTransitionComplete: () => void }) {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const contentRef = useRef<Group>(null!);
  const backgroundRef = useRef<HTMLDivElement>(null!);
  
  // --- NEW: Ref for the text prompt ---
  const promptRef = useRef<HTMLDivElement>(null!);

  const handleLogoClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push('/newlandingpage');
    }, 1500);
  };

  const handleEnter = () => {
    setIsExiting(true);
  };

  useEffect(() => {
    // --- MODIFIED: Added promptRef.current to the check ---
    if (isExiting && contentRef.current && backgroundRef.current && promptRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onTransitionComplete) onTransitionComplete();
        }
      });

      tl.to(backgroundRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.in',
      }, 0);

      // --- NEW: Animate the text prompt fading out ---
      tl.to(promptRef.current, {
        opacity: 0,
        duration: 1.0,
        ease: 'power2.in',
      }, 0); // Fade it out at the same time

      contentRef.current.traverse((child) => {
        if ((child as any).material) {
          tl.to((child as any).material, {
            opacity: 0,
            duration: 1,
            ease: 'power2.in',
          }, 0.2);
        }
      });
    }
  }, [isExiting, onTransitionComplete]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }}>
      
      {/* --- NEW: Style tag for the pulse animation --- */}
      <style>{`
        @keyframes pulseFade {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.9; }
        }
        .animate-pulse-fade {
          animation: pulseFade 3s ease-in-out infinite;
        }
      `}</style>

      <div
        ref={backgroundRef}
        style={{
          /* ... (background styles) ... */
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: `url(/chicagoskyline.jpg)`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(8px) grayscale(0.7) brightness(0.5)',
          zIndex: 1, opacity: 1,
        }}
      />

      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}
        gl={{ alpha: true }}
      >
        {/* ... (Canvas contents are the same) ... */}
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <group ref={contentRef}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={0.5} />
          <Suspense fallback={null}>
            <InteractiveLogo onNavigate={handleLogoClick} />
            <SpectreModel />
          </Suspense>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </group>
        <EffectComposer>
          <Bloom 
            intensity={0.7} luminanceThreshold={0.1}
            luminanceSmoothing={0.2} mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      {/* --- NEW: Clickable Text Prompt --- */}
      <div
        ref={promptRef}
        onClick={handleLogoClick}
        className="absolute z-10 left-1/2 -translate-x-1/2 text-center
                   bottom-[30%] md:bottom-[25%]
                   font-mono text-cyan-200 text-lg
                   cursor-pointer animate-pulse-fade"
        style={{ textShadow: '0 0 10px rgba(0,255,255,0.7)' }}
      >
        [ CLICK TO ENTER ]
      </div>
    </div>
  );
}