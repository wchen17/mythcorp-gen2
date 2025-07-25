// src/app/components/LoadingScreen.tsx

import { useProgress } from "@react-three/drei";

export function LoadingScreen() {
  const { progress, item } = useProgress();

  return (
    <>
      {/* This style tag injects the CSS animation into the page */}
      <style>
        {`
          @keyframes scanner {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#101010',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: '"Courier New", Courier, monospace',
        zIndex: 1000,
      }}>
        <h1 style={{ fontSize: '2rem', letterSpacing: '0.2rem', textTransform: 'uppercase' }}>
          SYSTEM INITIALIZING
        </h1>
        {/* The animated scanner bar */}
        <div style={{ 
            width: '200px', 
            height: '2px', 
            backgroundColor: '#333', 
            marginTop: '1rem', 
            overflow: 'hidden',
            position: 'relative' 
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#00ffff',
            boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff',
            animation: 'scanner 1.5s linear infinite alternate',
          }} />
        </div>
        <p style={{ marginTop: '1rem', color: '#555', height: '20px' }}>
          {/* Show the percentage, but the visual is the scanner */}
          {Math.round(progress)}% | Verifying: {item}
        </p>
        <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#888' }}>
          Headphones Recommended for Optimal Experience
        </p>
      </div>
    </>
  );
}
