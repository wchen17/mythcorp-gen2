// src/app/components/LoadingScreen.tsx
'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, PerspectiveCamera } from '@react-three/drei';
import { useProgress } from "@react-three/drei";
import * as THREE from 'three';

// --- Configuration for the Sphere ---
const sphereRadius = 2.2;
const binaryFontSize = 0.1;
const pointCount = 500;

// --- A single binary digit component ---
function BinaryDigit({ startPosition, endPosition, progress }: { startPosition: THREE.Vector3, endPosition: THREE.Vector3, progress: number }) {
  const textRef = useRef<any>(null);
  const digit = useMemo(() => (Math.random() > 0.5 ? '1' : '0'), []);

  useFrame(() => {
    if (textRef.current) {
      textRef.current.position.lerpVectors(startPosition, endPosition, progress);
    }
  });

  return (
    <Text
      ref={textRef}
      fontSize={binaryFontSize}
      color="#00ffff"
      anchorX="center"
      anchorY="middle"
    >
      {digit}
    </Text>
  );
}

// --- The Binary Sphere Component ---
function DataSphere({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null!);

  const points = useMemo(() => {
    const temp = [];
    for (let i = 0; i < pointCount; i++) {
      const endPos = new THREE.Vector3().randomDirection().multiplyScalar(sphereRadius);
      const startPos = endPos.clone().multiplyScalar(5); 
      temp.push({ start: startPos, end: endPos });
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x -= delta / 20;
      groupRef.current.rotation.y -= delta / 25;
    }
  });

  return (
    <group ref={groupRef}>
      {points.map((point, i) => (
        <BinaryDigit key={i} startPosition={point.start} endPosition={point.end} progress={progress / 100} />
      ))}
    </group>
  );
}

// --- The Main Loading Screen (FIXED) ---
// The component is now defined to accept the 'onFinished' prop.
export function LoadingScreen({ onFinished }: { onFinished: () => void }) {
  const { progress } = useProgress();

  useEffect(() => {
    const minDisplayTime = 4000; // 4 seconds
    if (progress === 100) {
      const timer = setTimeout(() => {
        onFinished(); // Call the function when the time is up
      }, minDisplayTime);
      return () => clearTimeout(timer);
    }
  }, [progress, onFinished]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 70%, #000008 100%)', 
      zIndex: 1000,
    }}>
      {/* Add some CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
          50% { text-shadow: 0 0 40px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.6); }
        }
      `}</style>
      
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#00ffff" />
        <DataSphere progress={progress} />
      </Canvas>
      
      {/* Enhanced loading text */}
      <div style={{
        position: 'absolute', bottom: '15%', width: '100%',
        textAlign: 'center', color: '#00ffff', fontFamily: '"Roboto Mono", monospace',
        pointerEvents: 'none',
        animation: 'fadeIn 1s ease-out'
      }}>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          letterSpacing: '0.3rem',
          marginBottom: '1rem',
          animation: 'glow 2s infinite'
        }}>
          MYTHCORP
        </div>
        
        <h2 style={{ 
          letterSpacing: '0.2rem', 
          textTransform: 'uppercase', 
          animation: 'pulse 2s infinite',
          fontSize: '1.2rem',
          marginBottom: '0.5rem'
        }}>
          INITIALIZING NEURAL INTERFACE... {Math.round(progress)}%
        </h2>
        
        {/* Progress bar */}
        <div style={{
          width: '300px',
          height: '4px',
          background: 'rgba(0, 255, 255, 0.2)',
          margin: '1rem auto',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #00ffff, #0080ff, #00ffff)',
            borderRadius: '2px',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
          }} />
        </div>
        
        <p style={{ 
          marginTop: '1.5rem', 
          fontSize: '0.9rem', 
          opacity: 0.6,
          letterSpacing: '0.1rem'
        }}>
          QUANTUM PROCESSORS ONLINE • HEADPHONES RECOMMENDED
        </p>
      </div>
    </div>
  );
}
