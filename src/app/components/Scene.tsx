// src/app/components/Scene.tsx
'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useState, useRef, useMemo } from 'react'
import { PerspectiveCamera, useGLTF, Image, Stars } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Group, Vector3 } from 'three'

// --- Prop Interfaces for Type Safety ---
interface ModelProps {
  position: number[];
  rotationSpeed: number;
  color: string;
}

interface HelicopterProps {
  scale: number;
  lerpFactor: number;
}

interface CombinedInputProps {
  label: string;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step: number;
}

interface MainMenuProps {
    onStart: () => void;
    onSettings: () => void;
}

// --- Default Settings Object ---
// UPDATED: Added showAxis property for the XYZ axis helper feature
const DEFAULTS = {
    rotationSpeed: 0.2,
    position: [0, 0, 0],
    color: '#00ffff',
    glowIntensity: 0.5,
    stars: 1,
    showHelicopter: false,
    heliScale: 1.5,
    heliSmoothness: 0.1,
    showAxis: true, // New property for toggling XYZ axis helper
};

interface SettingsMenuProps {
    defaults: typeof DEFAULTS;
    onSave: (newDefaults: typeof DEFAULTS) => void;
    onBack: () => void;
}


// --- Components for 3D Scene ---
function Model({ position, rotationSpeed, color }: ModelProps) {
  const { scene } = useGLTF('/spectre.glb')
  const modelRef = useRef<Group>(null!)
  
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * rotationSpeed
      // Add subtle floating motion
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })
  
  return (
    <group ref={modelRef}>
      <primitive object={scene} scale={1.5} position={position}>
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={2} 
          toneMapped={false}
          roughness={0.2}
          metalness={0.8}
        />
      </primitive>
      {/* Add orbital rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.02, 8, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[2.5, 0.015, 8, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

// New particle system component
function ParticleField() {
  const meshRef = useRef<any>(null!)
  const particleCount = 1000
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20  
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      
      colors[i * 3] = Math.random() * 0.5 + 0.5 // R
      colors[i * 3 + 1] = Math.random() * 0.5 + 0.5 // G  
      colors[i * 3 + 2] = 1 // B
    }
    
    return { positions, colors }
  }, [])
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.05
    }
  })
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particles.colors}
          itemSize={3}
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} />
    </points>
  )
}

function Helicopter({ scale, lerpFactor }: HelicopterProps) {
  const ref = useRef<Group>(null!)
  const { viewport } = useThree()
  const target = new Vector3()

  useFrame((state) => {
    if (ref.current) {
      target.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0)
      ref.current.position.lerp(target, lerpFactor)
    }
  })

  // The return statement must be inside the function.
  return (
    <group ref={ref}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image url="/heli.jpg" scale={scale} transparent />
    </group>
  )
}

// --- Components for UI & Menus ---
function CombinedInput({ label, value, onChange, min, max, step }: CombinedInputProps) {
    return (
        <div style={{ ...inputGroupStyle, marginTop: '1rem' }}>
            <label style={{ 
              color: '#ffffff', 
              fontSize: '0.9rem', 
              marginBottom: '0.5rem',
              fontWeight: '600'
            }}>
              {label}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input 
                  type="range" 
                  min={min} 
                  max={max} 
                  step={step} 
                  value={value} 
                  onChange={onChange} 
                  style={{ 
                    width: '100%',
                    accentColor: '#00ffff',
                    height: '6px',
                    borderRadius: '3px'
                  }}
                />
                <input 
                  type="number" 
                  step={step} 
                  value={value.toFixed ? value.toFixed(2) : value} 
                  onChange={onChange} 
                  style={{ 
                    width: '80px', 
                    background: '#1a1a2e', 
                    border: '1px solid #00ffff40', 
                    color: 'white',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    textAlign: 'center'
                  }}
                />
            </div>
        </div>
    )
}

function MainMenu({ onStart, onSettings }: MainMenuProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <style>{`
        @keyframes panBackground {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.3); }
          50% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.6), 0 0 60px rgba(0, 255, 255, 0.4); }
        }
        @keyframes constructionBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>
      <div style={{...menuStyle, background: `url('/chicagoskyline.jpg') no-repeat center center / cover`, animation: 'panBackground 40s linear infinite alternate', position: 'absolute', top: 0, left: 0, zIndex: 1}}></div>
      <div style={{...menuStyle, background: 'rgba(0,0,0,0.7)', position: 'relative', zIndex: 2}}>
        <h1 style={{ 
          fontSize: '4rem', 
          letterSpacing: '0.5rem', 
          background: 'linear-gradient(45deg, #00ffff, #0080ff, #00ffff)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          textShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
          marginBottom: '2rem'
        }}>
          MYTHCORP
        </h1>
        
        <div style={{ fontSize: '1.2rem', color: '#00ffff', marginBottom: '1rem', letterSpacing: '0.2rem' }}>
          SIMULATION LABORATORY
        </div>
        
        <button 
          onClick={onStart} 
          style={{
            ...buttonStyle, 
            background: 'linear-gradient(45deg, #00ffff, #0080ff)',
            border: 'none',
            animation: 'glowPulse 2s infinite',
            fontSize: '1.2rem',
            padding: '1rem 2.5rem',
            borderRadius: '8px',
            fontWeight: 'bold'
          }}
        >
          ENTER SIMULATION
        </button>
        
        <button 
          onClick={onSettings} 
          style={{
            ...buttonStyle, 
            marginTop: '1rem', 
            fontSize: '1rem', 
            padding: '0.75rem 1.5rem',
            background: 'rgba(0, 255, 255, 0.1)',
            borderColor: '#00ffff'
          }}
        >
          CONFIGURATION
        </button>
        
        {/* Under Construction Items */}
        <div style={{ marginTop: '2rem', opacity: 0.6 }}>
          <button style={{
            ...buttonStyle, 
            marginTop: '0.5rem', 
            fontSize: '0.9rem', 
            padding: '0.5rem 1rem', 
            opacity: 0.5, 
            cursor: 'not-allowed',
            background: 'rgba(255, 165, 0, 0.1)',
            borderColor: '#ffa500',
            color: '#ffa500'
          }}>
            🚧 ADVANCED TRAINING
          </button>
          
          <button style={{
            ...buttonStyle, 
            marginTop: '0.5rem', 
            fontSize: '0.9rem', 
            padding: '0.5rem 1rem', 
            opacity: 0.5, 
            cursor: 'not-allowed',
            background: 'rgba(255, 165, 0, 0.1)',
            borderColor: '#ffa500',
            color: '#ffa500',
            animation: 'constructionBlink 2s infinite'
          }}>
            🚧 MULTIPLAYER MODE
          </button>
          
          <button style={{
            ...buttonStyle, 
            marginTop: '0.5rem', 
            fontSize: '0.9rem', 
            padding: '0.5rem 1rem', 
            opacity: 0.5, 
            cursor: 'not-allowed',
            background: 'rgba(255, 165, 0, 0.1)',
            borderColor: '#ffa500',
            color: '#ffa500'
          }}>
            🚧 DATA VISUALIZATION
          </button>
        </div>
        
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          fontSize: '0.8rem', 
          color: 'rgba(255, 255, 255, 0.5)',
          letterSpacing: '0.1rem'
        }}>
          MYTHCORP RESEARCH DIVISION • CHICAGO LAB
        </div>
      </div>
    </div>
  )
}

function SettingsMenu({ defaults, onSave, onBack }: SettingsMenuProps) {
    const [localDefaults, setLocalDefaults] = useState(defaults);
    const handleSave = () => { onSave(localDefaults); onBack(); };
    return ( <div style={menuStyle}> <h2>Default Settings</h2> <div style={inputGroupStyle}> <label>Default Glow Color:</label> <input type="text" value={localDefaults.color} onChange={(e) => setLocalDefaults({...localDefaults, color: e.target.value})} /> </div> <button onClick={handleSave} style={buttonStyle}>Save & Back</button> </div> );
}

// --- Main Scene Component ---
export default function Scene() {
  const [appState, setAppState] = useState('menu');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [settings, setSettings] = useState(DEFAULTS);

  const randomizeAll = () => {
    setSettings({
      rotationSpeed: Math.random() * 2,
      position: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
      color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
      glowIntensity: Math.random() * 2,
      stars: Math.random() * 5,
      showHelicopter: Math.random() > 0.5,
      heliScale: Math.random() * 4.5 + 0.5,
      heliSmoothness: Math.random() * 0.19 + 0.01,
      showAxis: Math.random() > 0.5,  // ADDED: Include showAxis in randomization
    });
  };

  const resetToDefaults = () => setSettings(DEFAULTS);
  
  const handleSettingChange = (key: keyof typeof DEFAULTS, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handlePositionChange = (axis: number, value: number) => { 
    setSettings(prev => { 
      const newPos = [...prev.position]; 
      newPos[axis] = value; 
      return { ...prev, position: newPos }; 
    }); 
  };

  if (appState === 'menu') return <MainMenu onStart={() => setAppState('experience')} onSettings={() => setAppState('settings')} />
  if (appState === 'settings') return <SettingsMenu defaults={settings} onSave={setSettings} onBack={() => setAppState('menu')} />

  return (
    <main className='h-screen w-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black'>
      <div style={enhancedUiPanelStyle}>
        <h3 style={{ 
          marginTop: 0, 
          borderBottom: '2px solid #00ffff', 
          paddingBottom: '0.75rem',
          color: '#00ffff',
          fontSize: '1.2rem',
          letterSpacing: '0.1rem',
          textAlign: 'center'
        }}>
          SIMULATION CONTROLS
        </h3>
        
        <div style={inputGroupStyle}> 
          <label style={{ color: '#00ffff', fontWeight: 'bold' }}>Primary Color</label> 
          <input 
            type="text" 
            value={settings.color} 
            onChange={(e) => handleSettingChange('color', e.target.value)}
            style={{ 
              background: '#1a1a2e', 
              border: '1px solid #00ffff', 
              color: '#fff',
              padding: '0.5rem',
              borderRadius: '4px'
            }}
          /> 
        </div>
        
        <CombinedInput 
          label="Emission Intensity" 
          value={settings.glowIntensity} 
          onChange={(e) => handleSettingChange('glowIntensity', parseFloat(e.target.value))} 
          min={0} 
          max={3} 
          step={0.1}
        />
        
        <div style={{...inputGroupStyle, borderTop: '1px solid #333', paddingTop: '1rem', marginTop: '1rem' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: '#00ffff'
          }}>
            <input 
              type="checkbox" 
              checked={settings.showHelicopter} 
              onChange={(e) => handleSettingChange('showHelicopter', e.target.checked)}
              style={{ accentColor: '#00ffff' }}
            />
            Enable Mouse Tracker
          </label>
        </div>

        {/* ADDED: New checkbox for toggling XYZ Axis Helper */}
        <div style={{...inputGroupStyle, marginTop: '0.5rem' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: '#00ffff'
          }}>
            <input 
              type="checkbox" 
              checked={settings.showAxis} 
              onChange={(e) => handleSettingChange('showAxis', e.target.checked)}
              style={{ accentColor: '#00ffff' }}
            />
            Show XYZ Axis
          </label>
        </div>

        <div style={{...inputGroupStyle, borderTop: '1px solid #333', paddingTop: '1rem' }}>
            <label 
              onClick={() => setShowAdvanced(!showAdvanced)} 
              style={{
                cursor: 'pointer',
                color: '#00ffff',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            > 
              <span>{showAdvanced ? '▼' : '▶'}</span>
              Advanced Parameters
            </label>
            {showAdvanced && (
                <div style={{paddingLeft: '1rem', marginTop: '1rem', borderLeft: '2px solid #00ffff20'}}>
                    <CombinedInput label="Rotation Velocity" value={settings.rotationSpeed} onChange={(e) => handleSettingChange('rotationSpeed', parseFloat(e.target.value))} min={0} max={2} step={0.1}/>
                    <CombinedInput label="Position X" value={settings.position[0]} onChange={(e) => handlePositionChange(0, parseFloat(e.target.value))} min={-5} max={5} step={0.1}/>
                    <CombinedInput label="Position Y" value={settings.position[1]} onChange={(e) => handlePositionChange(1, parseFloat(e.target.value))} min={-5} max={5} step={0.1}/>
                    <CombinedInput label="Position Z" value={settings.position[2]} onChange={(e) => handlePositionChange(2, parseFloat(e.target.value))} min={-5} max={5} step={0.1}/>
                    
                    <h4 style={{
                      marginBottom: '0.75rem', 
                      marginTop: '1.5rem', 
                      borderTop: '1px solid #333', 
                      paddingTop: '1rem',
                      color: '#00ffff',
                      fontSize: '1rem'
                    }}>
                      Tracker Configuration
                    </h4>
                    <CombinedInput label="Scale Factor" value={settings.heliScale} onChange={(e) => handleSettingChange('heliScale', parseFloat(e.target.value))} min={0.5} max={5} step={0.1}/>
                    <CombinedInput label="Response Time" value={settings.heliSmoothness} onChange={(e) => handleSettingChange('heliSmoothness', parseFloat(e.target.value))} min={0.01} max={0.2} step={0.01}/>
                </div>
            )}
        </div>

        <div style={{ marginTop: '2rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
          <button 
            onClick={randomizeAll} 
            style={{
              ...buttonStyle, 
              width: '100%', 
              marginTop: '0.5rem', 
              padding: '0.75rem',
              background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}
          >
            🎲 RANDOMIZE ALL
          </button>
          
          <button 
            onClick={resetToDefaults} 
            style={{
              ...buttonStyle, 
              width: '100%', 
              marginTop: '0.5rem', 
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderColor: '#fff',
              borderRadius: '6px'
            }}
          >
            🔄 RESET DEFAULTS
          </button>
          
          <button 
            onClick={() => setAppState('menu')} 
            style={{
              ...buttonStyle, 
              width: '100%', 
              marginTop: '1rem', 
              background: 'rgba(255, 0, 0, 0.2)', 
              padding: '0.75rem',
              borderColor: '#ff4444',
              color: '#ff4444',
              borderRadius: '6px'
            }}
          >
            ← EXIT SIMULATION
          </button>
        </div>
      </div>

      <Canvas
        gl={{ 
          alpha: false, 
          antialias: true,
          preserveDrawingBuffer: false,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
        <color attach="background" args={['#000008']} />
        <Stars radius={100} depth={50} count={5000} factor={4 * settings.stars} saturation={0} fade speed={1} />
        <ParticleField />

        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00ffff" />
        <Model rotationSpeed={settings.rotationSpeed} position={settings.position} color={settings.color} />
        {settings.showHelicopter && <Helicopter scale={settings.heliScale} lerpFactor={settings.heliSmoothness} />}
        
        {/* ADDED: Conditionally render XYZ Axis Helper when showAxis is true */}
        {settings.showAxis && <axesHelper args={[5]} />}
        
        <EffectComposer>
          <Bloom 
            intensity={settings.glowIntensity} 
            luminanceThreshold={0.1} 
            luminanceSmoothing={0.2}
            mipmapBlur
            radius={0.85}
          />
        </EffectComposer>
      </Canvas>
    </main>
  )
}

// --- Reusable Styles ---
const menuStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', color: 'white', fontFamily: 'sans-serif', };
const buttonStyle: React.CSSProperties = { background: 'none', border: '1px solid white', color: 'white', padding: '1rem 2rem', fontSize: '1rem', cursor: 'pointer', marginTop: '2rem', };

// UPDATED: Removed glassmorphism, added sharp debug-style appearance
const uiPanelStyle: React.CSSProperties = { 
  position: 'absolute', 
  top: '20px', 
  left: '20px', 
  zIndex: 10, 
  background: '#1a1a1a',  // Solid dark background instead of transparent
  padding: '1rem', 
  // borderRadius removed for sharper look
  border: '1px solid #888',  // Sharp 1px solid border
  color: 'white', 
  fontFamily: 'sans-serif', 
  width: '250px' 
};

const enhancedUiPanelStyle: React.CSSProperties = { 
  position: 'absolute', 
  top: '20px', 
  left: '20px', 
  zIndex: 10, 
  background: '#1a1a1a',  // Solid dark background for debug/dev feel
  // backdropFilter removed - no glassmorphism
  padding: '1.5rem', 
  // borderRadius removed for sharper look
  border: '1px solid #888',  // Sharp 1px solid border
  color: 'white', 
  fontFamily: '"Roboto Mono", monospace', 
  width: '300px',
  // Simplified shadow - removed inset for cleaner debug look
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
};
const inputGroupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', marginTop: '1rem' };
