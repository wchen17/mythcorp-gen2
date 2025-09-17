// src/app/contact/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

/**
 * Contact Page - MYTHCORP Contact Information and Form
 */
export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-2xl font-mono">Loading...</div>
      </div>
    );
  }

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
            CONTACT
          </h1>
          <h2 className="text-2xl md:text-3xl font-mono text-cyan-400 mb-4">
            GET IN TOUCH WITH MYTHCORP
          </h2>
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-1/2 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-black/30 border border-cyan-400/20 rounded-lg p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-mono text-cyan-400 mb-6 flex items-center">
                <span className="mr-3 text-3xl">📡</span>
                COMMUNICATION CHANNELS
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-cyan-400/20 rounded-lg flex items-center justify-center mt-1">
                    <span className="text-cyan-400">🌐</span>
                  </div>
                  <div>
                    <div className="text-gray-300 font-mono">Website</div>
                    <div className="text-cyan-400">mythcorp.org</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-cyan-400/20 rounded-lg flex items-center justify-center mt-1">
                    <span className="text-cyan-400">📧</span>
                  </div>
                  <div>
                    <div className="text-gray-300 font-mono">Email</div>
                    <div className="text-cyan-400">contact@mythcorp.org</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-cyan-400/20 rounded-lg flex items-center justify-center mt-1">
                    <span className="text-cyan-400">🏢</span>
                  </div>
                  <div>
                    <div className="text-gray-300 font-mono">Headquarters</div>
                    <div className="text-cyan-400">Chicago, IL</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-cyan-400/20 rounded-lg flex items-center justify-center mt-1">
                    <span className="text-cyan-400">⏰</span>
                  </div>
                  <div>
                    <div className="text-gray-300 font-mono">Availability</div>
                    <div className="text-cyan-400">24/7 Digital Presence</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Panel */}
            <div className="bg-black/30 border border-green-400/20 rounded-lg p-6 backdrop-blur-sm">
              <h4 className="text-lg font-mono text-green-400 mb-4 flex items-center">
                <span className="mr-2">📊</span>
                SYSTEM STATUS
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-mono text-sm">Communication Array</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">ONLINE</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-mono text-sm">Response System</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">ACTIVE</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-mono text-sm">Security Protocol</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-yellow-400 text-sm">WORK IN PROGRESS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-black/30 border border-cyan-400/20 rounded-lg p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-mono text-cyan-400 mb-6 flex items-center">
              <span className="mr-3 text-3xl">📝</span>
              SEND MESSAGE
            </h3>

            {submitted ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✓</div>
                <div className="text-green-400 font-mono text-xl mb-2">MESSAGE TRANSMITTED</div>
                <div className="text-gray-400 text-sm">Your message has been received and will be processed.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cyan-400 font-mono text-sm mb-2">NAME</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-black/50 border border-cyan-400/30 rounded-md px-4 py-3 text-gray-300 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-cyan-400 font-mono text-sm mb-2">EMAIL</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-black/50 border border-cyan-400/30 rounded-md px-4 py-3 text-gray-300 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-colors"
                      placeholder="your.email@domain.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-cyan-400 font-mono text-sm mb-2">SUBJECT</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black/50 border border-cyan-400/30 rounded-md px-4 py-3 text-gray-300 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-colors"
                    placeholder="What is this regarding?"
                  />
                </div>
                
                <div>
                  <label className="block text-cyan-400 font-mono text-sm mb-2">MESSAGE</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full bg-black/50 border border-cyan-400/30 rounded-md px-4 py-3 text-gray-300 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-colors resize-none"
                    placeholder="Enter your message here..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400/50 hover:border-cyan-400 text-cyan-400 py-4 rounded-md font-mono transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>TRANSMIT MESSAGE</span>
                  <span>→</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="bg-black/20 border border-cyan-400/10 rounded-lg p-6 backdrop-blur-sm">
            <div className="text-gray-400 font-mono text-sm mb-2">
              MYTHCORP Digital Communications Division
            </div>
            <div className="text-cyan-400 font-mono text-xs">
              Secure • Encrypted • Always Online
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}