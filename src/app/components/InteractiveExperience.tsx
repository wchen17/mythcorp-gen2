// src/app/components/InteractiveExperience.tsx
'use client';

import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text3D, Center, PerspectiveCamera, Stars, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Group } from 'three';
import gsap from 'gsap';

// --- Interactive Button Component ---
function InteractiveButton({ 
  text, 
  position, 
  onClick, 
  color = "#00ffff" 
}: { 
  text: string; 
  position: [number, number, number]; 
  onClick: () => void;
  color?: string;
}) {
  const buttonRef = useRef<Group>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (buttonRef.current) {
      // Floating animation
      buttonRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
      
      // Scale on hover
      const targetScale = hovered ? 1.1 : 1;
      buttonRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.1);
    }
  });

  return (
    <group
      ref={buttonRef}
      position={position}
      onClick={onClick}
      onPointerEnter={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <mesh>
        <boxGeometry args={[3, 0.8, 0.2]} />
        <meshBasicMaterial 
          color={hovered ? "#ffffff" : color} 
          transparent 
          opacity={hovered ? 0.9 : 0.7}
          toneMapped={false}
        />
      </mesh>
      <Center>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={0.3}
          height={0.02}
          curveSegments={8}
          bevelEnabled
          bevelThickness={0.005}
          bevelSize={0.005}
          bevelSegments={2}
        >
          {text}
          <meshBasicMaterial color={hovered ? "#000000" : color} toneMapped={false} />
        </Text3D>
      </Center>
      {/* Glow effect */}
      <pointLight color={color} intensity={hovered ? 1.5 : 0.8} distance={5} />
    </group>
  );
}

// --- Floating Logo Component ---
function FloatingLogo() {
  const logoRef = useRef<Group>(null!);

  useFrame((state) => {
    if (logoRef.current) {
      logoRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      logoRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.3;
    }
  });

  return (
    <group ref={logoRef} position={[0, 2, -2]}>
      <Center>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={0.8}
          height={0.03}
          curveSegments={8}
          bevelEnabled
          bevelThickness={0.005}
          bevelSize={0.005}
          bevelSegments={2}
        >
          MYTHCORP
          <meshBasicMaterial color="#00ffff" toneMapped={false} transparent opacity={0.8} />
        </Text3D>
      </Center>
    </group>
  );
}

// --- Main Interactive Experience Component ---
export function InteractiveExperience({ onBack }: { onBack: () => void }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleButtonClick = (option: string) => {
    setSelectedOption(option);
    // Add haptic feedback or sound here if needed
    console.log(`Selected: ${option}`);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }}>
      
      {/* Blurred Chicago Skyline Background */}
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
          filter: 'blur(12px) grayscale(0.8) brightness(0.3)',
          zIndex: 1,
        }}
      />

      {/* Overlay for better text readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(45deg, rgba(0,0,0,0.4), rgba(0,50,50,0.3))',
          zIndex: 2,
        }}
      />

      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}
        gl={{ alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />

        <Suspense fallback={null}>
          <FloatingLogo />
          
          {/* Interactive Buttons */}
          <InteractiveButton
            text="ENTER MATRIX"
            position={[-2, -1, 0]}
            onClick={() => handleButtonClick('matrix')}
            color="#00ff00"
          />
          
          <InteractiveButton
            text="NEURAL LINK"
            position={[2, -1, 0]}
            onClick={() => handleButtonClick('neural')}
            color="#ff00ff"
          />
          
          <InteractiveButton
            text="CYBER SPACE"
            position={[-2, -2.5, 0]}
            onClick={() => handleButtonClick('cyber')}
            color="#ffff00"
          />
          
          <InteractiveButton
            text="QUANTUM REALM"
            position={[2, -2.5, 0]}
            onClick={() => handleButtonClick('quantum')}
            color="#ff0080"
          />
          
          <InteractiveButton
            text="BACK TO MENU"
            position={[0, -4, 0]}
            onClick={onBack}
            color="#666666"
          />
        </Suspense>

        <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={0.5} />

        <EffectComposer>
          <Bloom 
            intensity={0.5}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.2}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      {/* Status Display */}
      {selectedOption && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 4,
          background: 'rgba(0,0,0,0.8)',
          padding: '1rem',
          borderRadius: '8px',
          color: '#00ffff',
          fontFamily: 'monospace',
          border: '1px solid #00ffff'
        }}>
          <div>Status: ACTIVE</div>
          <div>Module: {selectedOption.toUpperCase()}</div>
          <div>Ready for initialization...</div>
        </div>
      )}
    </div>
  );
}