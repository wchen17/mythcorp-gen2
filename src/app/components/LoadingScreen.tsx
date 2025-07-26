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
      backgroundColor: '#0a0a0a', zIndex: 1000,
    }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <DataSphere progress={progress} />
      </Canvas>
      <div style={{
        position: 'absolute', bottom: '10%', width: '100%',
        textAlign: 'center', color: '#00ffff', fontFamily: '"Roboto Mono", monospace',
        pointerEvents: 'none',
        animation: 'fadeIn 1s ease-out'
      }}>
        <h2 style={{ letterSpacing: '0.2rem', textTransform: 'uppercase', opacity: 0.7 }}>
          SYNCHRONIZING... {Math.round(progress)}%
        </h2>
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.4 }}>
          Headphones Recommended for Optimal Experience
        </p>
      </div>
    </div>
  );
}
