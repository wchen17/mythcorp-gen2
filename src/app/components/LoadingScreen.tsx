// src/app/components/LoadingScreen.tsx
'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, PerspectiveCamera } from '@react-three/drei';
import { useProgress } from "@react-three/drei";
import * as THREE from 'three';

// --- Configuration for different loading variations ---
const LOADING_VARIANTS = {
  BINARY_SPHERE: 'binary_sphere',
  MATRIX_RAIN: 'matrix_rain',
  WAVE_GRID: 'wave_grid',
  SPIRAL_ZEROS: 'spiral_zeros'
};

const sphereRadius = 2.2;
const binaryFontSize = 0.1;
const pointCount = 800; // Increased from 500 for more density

// --- A single binary digit component with more 0s ---
function BinaryDigit({ startPosition, endPosition, progress }: { startPosition: THREE.Vector3, endPosition: THREE.Vector3, progress: number }) {
  const textRef = useRef<any>(null);
  // Increased probability of 0s to 80%
  const digit = useMemo(() => (Math.random() > 0.8 ? '1' : '0'), []);

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

// --- Matrix Rain Loading Variant ---
function MatrixRain({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const columns = 20;
  const rows = 30;
  
  const rainDrops = useMemo(() => {
    const drops = [];
    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        const x = (col - columns / 2) * 0.3;
        const y = (row - rows / 2) * 0.3;
        const z = Math.random() * 2 - 1;
        drops.push({
          position: new THREE.Vector3(x, y, z),
          digit: Math.random() > 0.7 ? '1' : '0',
          opacity: Math.random() * 0.8 + 0.2,
          fallSpeed: Math.random() * 0.02 + 0.01
        });
      }
    }
    return drops;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child: any, i) => {
        if (child.position) {
          child.position.y -= rainDrops[i].fallSpeed;
          if (child.position.y < -8) {
            child.position.y = 8;
          }
          // Fade based on progress
          if (child.material) {
            child.material.opacity = rainDrops[i].opacity * (progress / 100);
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {rainDrops.map((drop, i) => (
        <Text
          key={i}
          position={[drop.position.x, drop.position.y, drop.position.z]}
          fontSize={0.08}
          color="#00ff00"
          anchorX="center"
          anchorY="middle"
        >
          {drop.digit}
        </Text>
      ))}
    </group>
  );
}

// --- Wave Grid Loading Variant ---
function WaveGrid({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const gridSize = 15;
  
  const gridPoints = useMemo(() => {
    const points = [];
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const xPos = (x - gridSize / 2) * 0.4;
        const zPos = (z - gridSize / 2) * 0.4;
        points.push({
          basePos: new THREE.Vector3(xPos, 0, zPos),
          digit: Math.random() > 0.8 ? '1' : '0'
        });
      }
    }
    return points;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child: any, i) => {
        const point = gridPoints[i];
        const wave = Math.sin(state.clock.elapsedTime * 2 + point.basePos.x * 0.5 + point.basePos.z * 0.5) * 2;
        child.position.y = wave * (progress / 100);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {gridPoints.map((point, i) => (
        <Text
          key={i}
          position={[point.basePos.x, 0, point.basePos.z]}
          fontSize={0.1}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
        >
          {point.digit}
        </Text>
      ))}
    </group>
  );
}

// --- Spiral Zeros Loading Variant ---
function SpiralZeros({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  
  const spiralPoints = useMemo(() => {
    const points = [];
    const totalPoints = 200;
    for (let i = 0; i < totalPoints; i++) {
      const t = (i / totalPoints) * Math.PI * 8; // More spiral turns
      const radius = (i / totalPoints) * 3;
      const x = Math.cos(t) * radius;
      const y = (i / totalPoints - 0.5) * 6; // Spread vertically
      const z = Math.sin(t) * radius;
      points.push({
        position: new THREE.Vector3(x, y, z),
        // Almost all 0s for this variant
        digit: Math.random() > 0.95 ? '1' : '0'
      });
    }
    return points;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
      groupRef.current.children.forEach((child: any, i) => {
        if (child.material) {
          child.material.opacity = Math.sin(state.clock.elapsedTime * 2 + i * 0.1) * 0.5 + 0.5;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {spiralPoints.map((point, i) => (
        <Text
          key={i}
          position={[point.position.x, point.position.y, point.position.z]}
          fontSize={0.08}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
        >
          {point.digit}
        </Text>
      ))}
    </group>
  );
}

// --- The Main Loading Screen (ENHANCED) ---
export function LoadingScreen({ onFinished }: { onFinished: () => void }) {
  const { progress } = useProgress();
  
  // Use useEffect to avoid hydration mismatch
  const [loadingVariant, setLoadingVariant] = useState(LOADING_VARIANTS.BINARY_SPHERE);
  const [loadingMessages, setLoadingMessages] = useState("SYNCHRONIZING");
  const [displayProgress, setDisplayProgress] = useState(0);
  const progressRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set random variant after hydration
    const variants = Object.values(LOADING_VARIANTS);
    setLoadingVariant(variants[Math.floor(Math.random() * variants.length)]);
    
    const messages = [
      "SYNCHRONIZING",
      "INITIALIZING MATRIX",  
      "LOADING NEURAL NETWORKS",
      "CONNECTING TO SERVERS",
      "DECRYPTING DATA STREAMS",
      "ESTABLISHING SECURE CONNECTION"
    ];
    setLoadingMessages(messages[Math.floor(Math.random() * messages.length)]);

    // Start the progress simulation
    intervalRef.current = setInterval(() => {
      progressRef.current += Math.random() * 8 + 2; // Random increment between 2-10
      if (progressRef.current >= 100) {
        progressRef.current = 100;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        // Transition after reaching 100%
        setTimeout(() => {
          onFinished();
        }, 1000);
      }
      setDisplayProgress(Math.round(progressRef.current));
    }, 200);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onFinished]);

  // Render the appropriate loading variant
  const renderLoadingVariant = () => {
    switch (loadingVariant) {
      case LOADING_VARIANTS.MATRIX_RAIN:
        return <MatrixRain progress={displayProgress} />;
      case LOADING_VARIANTS.WAVE_GRID:
        return <WaveGrid progress={displayProgress} />;
      case LOADING_VARIANTS.SPIRAL_ZEROS:
        return <SpiralZeros progress={displayProgress} />;
      default:
        return <DataSphere progress={displayProgress} />;
    }
  };

  // Different color schemes for different variants
  const getVariantColor = () => {
    switch (loadingVariant) {
      case LOADING_VARIANTS.MATRIX_RAIN:
        return '#00ff00';
      case LOADING_VARIANTS.WAVE_GRID:
        return '#ff00ff';
      case LOADING_VARIANTS.SPIRAL_ZEROS:
        return '#ffff00';
      default:
        return '#00ffff';
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: '#0a0a0a', zIndex: 1000,
    }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        {renderLoadingVariant()}
      </Canvas>
      <div style={{
        position: 'absolute', bottom: '10%', width: '100%',
        textAlign: 'center', color: getVariantColor(), fontFamily: '"Roboto Mono", monospace',
        pointerEvents: 'none',
        animation: 'fadeIn 1s ease-out'
      }}>
        <h2 style={{ letterSpacing: '0.2rem', textTransform: 'uppercase', opacity: 0.7 }}>
          {loadingMessages}... {displayProgress}%
        </h2>
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.4 }}>
          Headphones Recommended for Optimal Experience
        </p>
        <div style={{ 
          marginTop: '2rem', 
          fontSize: '0.6rem', 
          opacity: 0.3,
          fontFamily: 'monospace'
        }}>
          Loading Variant: {loadingVariant.replace('_', ' ').toUpperCase()}
        </div>
      </div>
    </div>
  );
}
