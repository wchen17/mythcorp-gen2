// src/app/components/Scene.tsx
'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useState, useRef } from 'react'
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
const DEFAULTS = {
    rotationSpeed: 0.2,
    position: [0, 0, 0],
    color: '#00ffff',
    glowIntensity: 0.5,
    stars: 1,
    showHelicopter: false,
    heliScale: 1.5,
    heliSmoothness: 0.1,
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
    }
  })
  return <primitive ref={modelRef} object={scene} scale={1.5} position={position}>
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
  </primitive>
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
        <div style={inputGroupStyle}>
            <label>{label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="range" min={min} max={max} step={step} value={value} onChange={onChange} style={{ width: '100%' }}/>
                <input type="number" step={step} value={value.toFixed ? value.toFixed(2) : value} onChange={onChange} style={{ width: '70px', background: '#333', border: '1px solid #555', color: 'white' }}/>
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
      `}</style>
      <div style={{...menuStyle, background: `url('/city-bg.jpg') no-repeat center center / cover`, animation: 'panBackground 40s linear infinite alternate', position: 'absolute', top: 0, left: 0, zIndex: 1}}></div>
      <div style={{...menuStyle, background: 'rgba(0,0,0,0.5)', position: 'relative', zIndex: 2}}>
        <h1 style={{ fontSize: '3rem', letterSpacing: '0.5rem' }}>MYTHCORP</h1>
        <button onClick={onStart} style={buttonStyle}>Enter Experience</button>
        <button onClick={onSettings} style={{...buttonStyle, marginTop: '1rem', fontSize: '0.8rem', padding: '0.5rem 1rem'}}>Settings</button>
        <button style={{...buttonStyle, marginTop: '1rem', fontSize: '0.8rem', padding: '0.5rem 1rem', opacity: 0.5, cursor: 'not-allowed'}}>More Choices (Coming Soon)</button>
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
    <main className='h-screen w-screen bg-black'>
      <div style={uiPanelStyle}>
        <h3 style={{ marginTop: 0, borderBottom: '1px solid white', paddingBottom: '0.5rem' }}>Controls</h3>
        
        <div style={inputGroupStyle}> <label>Glow Color</label> <input type="text" value={settings.color} onChange={(e) => handleSettingChange('color', e.target.value)} /> </div>
        <CombinedInput label="Glow Intensity" value={settings.glowIntensity} onChange={(e) => handleSettingChange('glowIntensity', parseFloat(e.target.value))} min={0} max={3} step={0.1}/>
        
        <div style={{...inputGroupStyle, borderTop: '1px solid #555', paddingTop: '1rem', marginTop: '1rem' }}>
          <input type="checkbox" checked={settings.showHelicopter} onChange={(e) => handleSettingChange('showHelicopter', e.target.checked)} />
          <label>Show Mouse Tracker</label>
        </div>

        <div style={{...inputGroupStyle, borderTop: '1px solid #555', paddingTop: '1rem' }}>
            <label onClick={() => setShowAdvanced(!showAdvanced)} style={{cursor: 'pointer'}}> {showAdvanced ? '▼' : '►'} Advanced Settings </label>
            {showAdvanced && (
                <div style={{paddingLeft: '1rem', marginTop: '0.5rem'}}>
                    <CombinedInput label="Rotation Speed" value={settings.rotationSpeed} onChange={(e) => handleSettingChange('rotationSpeed', parseFloat(e.target.value))} min={0} max={2} step={0.1}/>
                    <CombinedInput label="Position X" value={settings.position[0]} onChange={(e) => handlePositionChange(0, parseFloat(e.target.value))} min={-5} max={5} step={0.1}/>
                    <CombinedInput label="Position Y" value={settings.position[1]} onChange={(e) => handlePositionChange(1, parseFloat(e.target.value))} min={-5} max={5} step={0.1}/>
                    <CombinedInput label="Position Z" value={settings.position[2]} onChange={(e) => handlePositionChange(2, parseFloat(e.target.value))} min={-5} max={5} step={0.1}/>
                    <h4 style={{marginBottom: '0.5rem', marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem'}}>Tracker Settings</h4>
                    <CombinedInput label="Tracker Size" value={settings.heliScale} onChange={(e) => handleSettingChange('heliScale', parseFloat(e.target.value))} min={0.5} max={5} step={0.1}/>
                    <CombinedInput label="Tracker Smoothness" value={settings.heliSmoothness} onChange={(e) => handleSettingChange('heliSmoothness', parseFloat(e.target.value))} min={0.01} max={0.2} step={0.01}/>
                </div>
            )}
        </div>

        <button onClick={randomizeAll} style={{...buttonStyle, width: '100%', marginTop: '1rem', padding: '0.5rem'}}>Randomize All</button>
        <button onClick={resetToDefaults} style={{...buttonStyle, width: '100%', marginTop: '0.5rem', padding: '0.5rem'}}>Reset to Defaults</button>
        <button onClick={() => setAppState('menu')} style={{...buttonStyle, width: '100%', marginTop: '1rem', background: '#333', padding: '0.5rem' }}>Back to Menu</button>
      </div>

      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
        <color attach="background" args={['black']} />
        <Stars radius={100} depth={50} count={5000} factor={4 * settings.stars} saturation={0} fade speed={1} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Model rotationSpeed={settings.rotationSpeed} position={settings.position} color={settings.color} />
        {settings.showHelicopter && <Helicopter scale={settings.heliScale} lerpFactor={settings.heliSmoothness} />}
        <EffectComposer><Bloom intensity={settings.glowIntensity} luminanceThreshold={0.1} luminanceSmoothing={0.2} /></EffectComposer>
      </Canvas>
    </main>
  )
}

// --- Reusable Styles ---
const menuStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', color: 'white', fontFamily: 'sans-serif', };
const buttonStyle: React.CSSProperties = { background: 'none', border: '1px solid white', color: 'white', padding: '1rem 2rem', fontSize: '1rem', cursor: 'pointer', marginTop: '2rem', };
const uiPanelStyle: React.CSSProperties = { position: 'absolute', top: '20px', left: '20px', zIndex: 10, background: 'rgba(0, 0, 0, 0.5)', padding: '1rem', borderRadius: '8px', color: 'white', fontFamily: 'sans-serif', width: '250px' };
const inputGroupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', marginTop: '0.5rem' };
