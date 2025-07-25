// src/app/components/LoadingScreen.tsx

import { useProgress } from "@react-three/drei";
import { useEffect } from "react"; // #FIX: Import useEffect

export function LoadingScreen({ onStarted }: { onStarted: (started: boolean) => void }) {
  const { progress, item } = useProgress();

  // #FIX: Moved the logic into a useEffect hook.
  // This hook will run whenever the 'progress' value changes.
  useEffect(() => {
    if (progress === 100) {
      onStarted(true);
    }
  }, [progress, onStarted]);

  return (
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
      transition: 'opacity 0.5s ease-out', // Added for a smooth fade-out
      opacity: progress === 100 ? 0 : 1, // Fade out when complete
    }}>
      <h1 style={{ fontSize: '2rem', letterSpacing: '0.2rem', textTransform: 'uppercase' }}>
        System Initializing
      </h1>
      <div style={{ width: '200px', height: '2px', backgroundColor: '#333', marginTop: '1rem' }}>
        <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#00ffff' }} />
      </div>
      <p style={{ marginTop: '1rem', color: '#555' }}>
        {Math.round(progress)}% | Loading Asset: {item}
      </p>
      <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#888' }}>
        Headphones Recommended for Optimal Experience
      </p>
    </div>
  );
}
