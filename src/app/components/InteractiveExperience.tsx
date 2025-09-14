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

// --- Main Interactive Experience Component (SIMPLIFIED FOR DEBUG) ---
export function InteractiveExperience({ onBack }: { onBack: () => void }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleButtonClick = (option: string) => {
    setSelectedOption(option);
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

      {/* Simplified HTML-based interface */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'monospace'
      }}>
        
        {/* Floating Logo */}
        <h1 style={{
          fontSize: '3rem',
          color: '#00ffff',
          textShadow: '0 0 20px #00ffff',
          marginBottom: '3rem',
          animation: 'pulse 2s infinite'
        }}>
          MYTHCORP
        </h1>

        {/* Interactive Buttons Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => handleButtonClick('matrix')}
            style={{
              padding: '1rem 2rem',
              background: selectedOption === 'matrix' ? '#00ff00' : 'rgba(0,255,0,0.2)',
              border: '2px solid #00ff00',
              color: selectedOption === 'matrix' ? '#000' : '#00ff00',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            ENTER MATRIX
          </button>
          
          <button
            onClick={() => handleButtonClick('neural')}
            style={{
              padding: '1rem 2rem',
              background: selectedOption === 'neural' ? '#ff00ff' : 'rgba(255,0,255,0.2)',
              border: '2px solid #ff00ff',
              color: selectedOption === 'neural' ? '#000' : '#ff00ff',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            NEURAL LINK
          </button>
          
          <button
            onClick={() => handleButtonClick('cyber')}
            style={{
              padding: '1rem 2rem',
              background: selectedOption === 'cyber' ? '#ffff00' : 'rgba(255,255,0,0.2)',
              border: '2px solid #ffff00',
              color: selectedOption === 'cyber' ? '#000' : '#ffff00',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            CYBER SPACE
          </button>
          
          <button
            onClick={() => handleButtonClick('quantum')}
            style={{
              padding: '1rem 2rem',
              background: selectedOption === 'quantum' ? '#ff0080' : 'rgba(255,0,128,0.2)',
              border: '2px solid #ff0080',
              color: selectedOption === 'quantum' ? '#000' : '#ff0080',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            QUANTUM REALM
          </button>
        </div>

        <button
          onClick={onBack}
          style={{
            padding: '0.8rem 1.5rem',
            background: 'rgba(102,102,102,0.2)',
            border: '2px solid #666666',
            color: '#666666',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          BACK TO MENU
        </button>
      </div>

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

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}