// src/app/chat/page.tsx
'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file';
  fileName?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'System',
      content: 'Welcome to MYTHCORP Chat. This is a placeholder for future real-time messaging functionality.',
      timestamp: new Date().toLocaleTimeString(),
      type: 'text',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('Guest_' + Math.floor(Math.random() * 1000));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: username,
        content: inputMessage,
        timestamp: new Date().toLocaleTimeString(),
        type: 'text',
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: username,
        content: `Shared a file: ${file.name}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'file',
        fileName: file.name,
      };
      setMessages([...messages, newMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: Menu */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
            </div>
            <span className="text-sm font-medium">MENU</span>
          </div>

          {/* Center: Logo */}
          <div className="flex flex-col items-center">
            <Link href="/" className="text-2xl font-bold font-serif tracking-wide">
              MYTHCORP
            </Link>
            <span className="text-xs font-sans tracking-wider opacity-70">
              FOUNDED IN CHICAGO
            </span>
          </div>

          {/* Right: Navigation */}
          <div className="flex space-x-8">
            <Link href="/about" className="text-sm font-medium hover:underline">
              ABOUT US
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline">
              CONTACT
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-6 px-6 max-w-6xl mx-auto w-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">MYTHCORP CHATROOM</h1>
          <p className="text-lg opacity-70">Real-time messaging and file sharing</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-white/50">Username:</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-3 py-1 bg-white/10 border border-white/20 rounded text-sm focus:outline-none focus:border-cyan-400"
            />
            <span className="inline-flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
              <span className="text-orange-400">Demo Mode</span>
            </span>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-6 mb-4 overflow-y-auto min-h-[400px] max-h-[500px]">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.sender === username ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.sender === 'System'
                      ? 'bg-cyan-500/20 border border-cyan-500/30'
                      : message.sender === username
                      ? 'bg-cyan-500 text-black'
                      : 'bg-white/10'
                  }`}
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-sm">
                      {message.sender}
                    </span>
                    <span className="text-xs opacity-60">
                      {message.timestamp}
                    </span>
                  </div>
                  {message.type === 'file' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📎</span>
                      <span>{message.content}</span>
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all"
            title="Upload File"
          >
            📎
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-400 text-white placeholder-white/50"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-lg transition-all"
          >
            Send
          </button>
        </form>

        {/* Info Banner */}
        <div className="mt-6 bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
          <p className="text-sm text-orange-300">
            <strong>⚠️ Demo Mode:</strong> This is a local demo. Messages are not sent to other users. 
            Real-time WebSocket functionality will be added in future updates for true peer-to-peer communication.
          </p>
        </div>
      </main>
    </div>
  );
}
