// src/app/about/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

/**
 * About Us Page - MYTHCORP Information
 */
export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('company');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-2xl font-mono">Loading...</div>
      </div>
    );
  }

  const sections = {
    company: {
      title: 'THE COMPANY',
      icon: '🏢',
      content: (
        <div className="space-y-6">
          <p className="text-gray-300 leading-relaxed">
            MYTHCORP represents the pinnacle of technological innovation and digital experience design. 
            Founded in the convergence of imagination and reality, we specialize in creating immersive 
            digital environments that push the boundaries of what's possible.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Our mission is to bridge the gap between the physical and digital worlds, creating experiences 
            that are not just interactive, but transformative. We believe that technology should inspire, 
            engage, and elevate human potential.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-black/30 border border-cyan-400/20 rounded-lg p-4">
              <div className="text-cyan-400 font-mono text-lg mb-2">Founded</div>
              <div className="text-gray-300">2024</div>
            </div>
            <div className="bg-black/30 border border-cyan-400/20 rounded-lg p-4">
              <div className="text-cyan-400 font-mono text-lg mb-2">Focus</div>
              <div className="text-gray-300">Digital Innovation</div>
            </div>
          </div>
        </div>
      )
    },
    technology: {
      title: 'TECHNOLOGY',
      icon: '⚡',
      content: (
        <div className="space-y-6">
          <p className="text-gray-300 leading-relaxed">
            Our technology stack represents cutting-edge web development and 3D graphics capabilities. 
            We leverage the latest in JavaScript frameworks, WebGL, and real-time rendering to create 
            seamless interactive experiences.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-cyan-400 font-mono text-lg border-b border-cyan-400/30 pb-2">Frontend</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  <span>Next.js 15.3.3</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  <span>React Three Fiber</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  <span>Three.js</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  <span>GSAP Animations</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-cyan-400 font-mono text-lg border-b border-cyan-400/30 pb-2">Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Real-time 3D Rendering</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Interactive UI Elements</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Responsive Design</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Progressive Enhancement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    vision: {
      title: 'OUR VISION',
      icon: '🔮',
      content: (
        <div className="space-y-6">
          <p className="text-gray-300 leading-relaxed">
            We envision a future where digital experiences are indistinguishable from reality, 
            where users don't just interact with interfaces but become part of living, breathing 
            digital ecosystems.
          </p>
          <div className="bg-gradient-to-r from-cyan-400/10 to-purple-400/10 border border-cyan-400/20 rounded-lg p-6">
            <h4 className="text-cyan-400 font-mono text-lg mb-4">Work In Progress</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 border border-yellow-400 rounded-sm animate-pulse"></div>
                <span>Neural Interface Integration</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 border border-yellow-400 rounded-sm animate-pulse"></div>
                <span>Quantum Computing Backend</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 border border-yellow-400 rounded-sm animate-pulse"></div>
                <span>Multi-dimensional Experiences</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 border border-yellow-400 rounded-sm animate-pulse"></div>
                <span>AI-Driven Personalization</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <main className="min-h-screen w-screen bg-black relative">
      {/* Background */}
      <div 
        className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: 'url(/chicagoskyline.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px) grayscale(1)',
        }}
      />

      {/* Navigation */}
      <div className="relative z-10 flex items-center justify-between p-8">
        <Link 
          href="/mythcorp"
          className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 text-gray-300 hover:text-white px-6 py-3 rounded-md transition-all duration-300 backdrop-blur-sm font-mono"
        >
          ← Back to MYTHCORP
        </Link>
        
        <Link 
          href="/"
          className="bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 text-cyan-400 hover:text-cyan-300 px-6 py-3 rounded-md transition-all duration-300 backdrop-blur-sm font-mono"
        >
          → NEXUS Home
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 mb-8">
            ABOUT
          </h1>
          <h2 className="text-3xl md:text-4xl font-mono text-cyan-400 mb-4">
            MYTHCORP
          </h2>
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-1/2 mx-auto"></div>
        </div>

        {/* Section Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-black/50 border border-cyan-400/30 rounded-lg p-2 backdrop-blur-sm flex space-x-2">
            {Object.entries(sections).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`px-6 py-3 rounded-md font-mono text-sm transition-all duration-300 ${
                  activeSection === key
                    ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                    : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Section Content */}
        <div className="bg-black/30 border border-cyan-400/20 rounded-lg p-8 backdrop-blur-sm">
          <div className="mb-8">
            <h3 className="text-3xl font-mono text-cyan-400 mb-2 flex items-center">
              <span className="mr-3 text-4xl">{sections[activeSection as keyof typeof sections].icon}</span>
              {sections[activeSection as keyof typeof sections].title}
            </h3>
            <div className="h-px bg-gradient-to-r from-cyan-400 to-transparent w-1/3"></div>
          </div>
          
          {sections[activeSection as keyof typeof sections].content}
        </div>

        {/* Footer Quote */}
        <div className="text-center mt-16">
          <blockquote className="text-xl md:text-2xl text-gray-300 font-mono italic border-l-4 border-cyan-400 pl-6 max-w-3xl mx-auto">
            "The future belongs to those who can imagine beyond the boundaries of today's reality."
          </blockquote>
          <div className="text-cyan-400 font-mono mt-4">— MYTHCORP Foundation</div>
        </div>
      </div>
    </main>
  );
}