'use client';

// Walkthrough: /wc/learn/landing-flow

import { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text3D, Center, PerspectiveCamera, Stars, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Group } from 'three';
import gsap from 'gsap';

// Preload the GLTF + font once for the whole session, lifts the asset
// fetch out of the render path so the cinematic boot has nothing to wait on.
useGLTF.preload('/spectre.glb');

const lerp = (start: number, end: number, alpha: number) =>
  start * (1 - alpha) + end * alpha;

function SpectreModel() {
  const { scene } = useGLTF('/spectre.glb');
  const groupRef = useRef<Group>(null!);
  const { viewport } = useThree();

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.2;
    const margin = 0.05;
    groupRef.current.position.set(viewport.width / 2 - margin, -viewport.height / 2 + margin, -4);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={0.4} position={[0, 0, 0]} rotation={[0, -0.5, 0]}>
        <meshStandardMaterial
          color="#888888"
          emissive="#00ffff"
          emissiveIntensity={0.5}
          toneMapped={false}
          transparent
          opacity={1}
        />
      </primitive>
    </group>
  );
}

function InteractiveLogo({ onNavigate }: { onNavigate: () => void }) {
  const logoRef = useRef<Group>(null!);

  useFrame((state) => {
    if (!logoRef.current) return;
    logoRef.current.rotation.y = lerp(logoRef.current.rotation.y, state.mouse.x * 0.3, 0.05);
    logoRef.current.rotation.x = lerp(logoRef.current.rotation.x, -state.mouse.y * 0.3, 0.05);
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

export function LandingPage({ onTransitionComplete }: { onTransitionComplete: () => void }) {
  const [isExiting, setIsExiting] = useState(false);
  const contentRef = useRef<Group>(null!);
  const backgroundRef = useRef<HTMLDivElement>(null!);
  const promptRef = useRef<HTMLDivElement>(null!);

  // Single transition path: GSAP fade-out → onTransitionComplete swaps state.
  // (Previously this also called router.push('/newlandingpage'), which
  // duplicated the in-page transition and navigated to a redundant route.)
  const handleEnter = () => setIsExiting(true);

  useEffect(() => {
    if (!(isExiting && contentRef.current && backgroundRef.current && promptRef.current)) return;

    const tl = gsap.timeline({
      onComplete: () => onTransitionComplete?.(),
    });

    tl.to(backgroundRef.current, { opacity: 0, duration: 1.5, ease: 'power2.in' }, 0);
    tl.to(promptRef.current,    { opacity: 0, duration: 1.0, ease: 'power2.in' }, 0);

    contentRef.current.traverse((child) => {
      const mat = (child as { material?: { opacity: number } }).material;
      if (mat) {
        tl.to(mat, { opacity: 0, duration: 1, ease: 'power2.in' }, 0.2);
      }
    });
  }, [isExiting, onTransitionComplete]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--bg)' }}>
      <style>{`
        @keyframes pulseFade {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 0.9; }
        }
        .animate-pulse-fade { animation: pulseFade 3s ease-in-out infinite; }
      `}</style>

      <div
        ref={backgroundRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/chicagoskyline.jpg)',
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
        <group ref={contentRef}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={0.5} />
          <Suspense fallback={null}>
            <InteractiveLogo onNavigate={handleEnter} />
            <SpectreModel />
          </Suspense>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </group>
        <EffectComposer>
          <Bloom intensity={0.7} luminanceThreshold={0.1} luminanceSmoothing={0.2} mipmapBlur />
        </EffectComposer>
      </Canvas>

      <div
        ref={promptRef}
        onClick={handleEnter}
        className="absolute z-10 left-1/2 -translate-x-1/2 text-center
                   bottom-[28%] md:bottom-[24%]
                   font-mono text-base md:text-lg
                   cursor-pointer animate-pulse-fade
                   text-[color:var(--accent-soft)]"
        style={{ textShadow: '0 0 12px var(--accent-glow-strong)' }}
      >
        [ CLICK TO ENTER ]
      </div>
    </div>
  );
}
