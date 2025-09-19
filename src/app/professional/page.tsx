// src/app/professional/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ThemeType, getTheme, toggleTheme as toggleThemeUtil, getSectionColors } from '../lib/themes';

/**
 * Professional Interactive Hub - Main dashboard with comprehensive theme system
 */
export default function ProfessionalPage() {
  const [theme, setTheme] = useState<ThemeType>('cool-professional');
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleToggleTheme = () => {
    setTheme(prev => toggleThemeUtil(prev));
  };

  const currentTheme = getTheme(theme);
  const sectionColors = getSectionColors(theme);

  const sections = [
    {
      id: 'portal',
      title: 'PORTAL',
      subtitle: 'Interactive Experience',
      icon: '⚡',
      description: 'Enter the interactive 3D environment with full customization controls',
      link: '/mysterious',
      color: sectionColors.portal
    },
    {
      id: 'nexus',
      title: 'NEXUS',
      subtitle: '3D Environment',
      icon: '🌀',
      description: 'Advanced 3D simulation with dynamic lighting and particle effects',
      link: '/betademo',
      color: sectionColors.nexus
    },
    {
      id: 'games',
      title: 'GAMES',
      subtitle: 'Interactive Systems',
      icon: '🎯',
      description: 'Incremental progression and interactive gaming experiences',
      link: '/minigame',
      color: sectionColors.games
    },
    {
      id: 'dashboard',
      title: 'DASHBOARD',
      subtitle: 'Control Center',
      icon: '📊',
      description: 'Main navigation hub with system status and controls',
      link: '/',
      color: sectionColors.dashboard
    }
  ];

  return (
    <main 
      className="h-screen w-screen relative overflow-hidden transition-all duration-1000"
      style={{ background: currentTheme.background }}
    >
      {/* Animated Background */}
      <div 
        className="absolute inset-0 transition-all duration-700"
        style={{
          backgroundImage: `url('/chicagoskyline.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
          filter: `blur(2px) brightness(0.3) contrast(1.2)`,
          transform: `scale(1.1) rotate(${(mousePos.x - 50) * 0.01}deg)`,
        }}
      />

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(${currentTheme.primary}44 1px, transparent 1px),
            linear-gradient(90deg, ${currentTheme.primary}44 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}
      />

      {/* Navigation Header */}
      <header className="relative z-50 p-6">
        <div className="flex justify-between items-center">
          <Link 
            href="/"
            className="flex items-center space-x-3 group"
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ 
                background: currentTheme.primary + '33',
                border: `2px solid ${currentTheme.primary}`
              }}
            >
              <span style={{ color: currentTheme.primary }}>←</span>
            </div>
            <span 
              className="font-mono text-lg font-bold"
              style={{ color: currentTheme.text }}
            >
              NEXUS CORP
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleToggleTheme}
              className="px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 hover:scale-105"
              style={{
                background: currentTheme.cardBg,
                border: `1px solid ${currentTheme.border}`,
                color: currentTheme.accent
              }}
            >
              {theme === 'cool' ? '◐' : '◑'} {currentTheme.name}
            </button>

            <div 
              className="px-3 py-2 rounded-lg font-mono text-xs"
              style={{
                background: currentTheme.primary + '22',
                border: `1px solid ${currentTheme.primary}`,
                color: currentTheme.primary
              }}
            >
              ONLINE
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 px-8 pb-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 
            className="text-6xl md:text-8xl font-mono font-bold mb-4 transition-all duration-500"
            style={{ 
              color: currentTheme.primary,
              textShadow: `0 0 30px ${currentTheme.primary}66`,
              filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))'
            }}
          >
            {theme === 'cool' ? 'NEXUS' : 'NEXUS PRO'}
          </h1>
          <p 
            className="text-xl font-mono tracking-wider"
            style={{ color: currentTheme.textSecondary }}
          >
            INTERACTIVE CONTROL CENTER
          </p>
        </div>

        {/* Interactive Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {sections.map((section, index) => (
            <Link
              key={section.id}
              href={section.link}
              className="group relative"
              onMouseEnter={() => setActiveSection(section.id)}
              onMouseLeave={() => setActiveSection(null)}
            >
              <div 
                className="h-64 rounded-xl p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                style={{
                  background: activeSection === section.id 
                    ? `linear-gradient(135deg, ${section.color}22, ${currentTheme.cardBg})`
                    : currentTheme.cardBg,
                  border: `2px solid ${activeSection === section.id ? section.color : currentTheme.border}`,
                  boxShadow: activeSection === section.id 
                    ? `0 20px 40px ${section.color}33, inset 0 1px 0 rgba(255,255,255,0.1)`
                    : '0 10px 30px rgba(0,0,0,0.3)',
                }}
              >
                {/* Icon */}
                <div 
                  className="text-4xl mb-4 transition-all duration-300"
                  style={{ 
                    transform: activeSection === section.id ? 'scale(1.2) rotate(5deg)' : 'scale(1)',
                    filter: activeSection === section.id ? `drop-shadow(0 0 10px ${section.color})` : 'none'
                  }}
                >
                  {section.icon}
                </div>

                {/* Title */}
                <h3 
                  className="text-xl font-mono font-bold mb-2 transition-colors duration-300"
                  style={{ 
                    color: activeSection === section.id ? section.color : currentTheme.text 
                  }}
                >
                  {section.title}
                </h3>

                {/* Subtitle */}
                <p 
                  className="text-sm font-mono mb-3 opacity-80"
                  style={{ color: currentTheme.textSecondary }}
                >
                  {section.subtitle}
                </p>

                {/* Description */}
                <p 
                  className="text-xs leading-relaxed mb-4"
                  style={{ color: currentTheme.textSecondary }}
                >
                  {section.description}
                </p>

                {/* Action Indicator */}
                <div 
                  className="absolute bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: activeSection === section.id ? section.color : currentTheme.border,
                    transform: activeSection === section.id ? 'scale(1.2)' : 'scale(1)'
                  }}
                >
                  <span 
                    className="text-sm font-bold"
                    style={{ 
                      color: activeSection === section.id ? currentTheme.background : currentTheme.text 
                    }}
                  >
                    →
                  </span>
                </div>

                {/* Hover Effect Overlay */}
                {activeSection === section.id && (
                  <div 
                    className="absolute inset-0 rounded-xl transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(45deg, transparent, ${section.color}11, transparent)`,
                      animation: 'shimmer 2s infinite'
                    }}
                  />
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Status Bar */}
        <div className="fixed bottom-6 left-6 right-6 z-50">
          <div 
            className="flex justify-between items-center px-6 py-3 rounded-lg backdrop-blur-md"
            style={{
              background: currentTheme.background,
              border: `1px solid ${currentTheme.border}`
            }}
          >
            <div 
              className="flex items-center space-x-3"
              style={{ color: currentTheme.textSecondary }}
            >
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: currentTheme.primary }}
              />
              <span className="font-mono text-sm">SYSTEM OPERATIONAL</span>
            </div>

            <div 
              className="flex items-center space-x-4 font-mono text-xs"
              style={{ color: currentTheme.textSecondary }}
            >
              <span>THEME: {currentTheme.name.toUpperCase()}</span>
              <span>STATUS: ACTIVE</span>
              <span>NEXUS v2.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              backgroundColor: i % 2 === 0 ? currentTheme.primary : currentTheme.secondary,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              opacity: 0.6
            }}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </main>
  );
}