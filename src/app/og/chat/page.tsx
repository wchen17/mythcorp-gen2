'use client';

import { useEffect, useRef, useState } from 'react';
import { SiteHeader } from '../../components/SiteHeader';
import { DraftBanner } from '../../components/DraftBanner';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file';
}

export default function ChatSketch() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'system',
      content:
        "Welcome to the chat sketch. Messages live in your browser's memory only, refresh and they're gone.",
      timestamp: new Date().toLocaleTimeString(),
      type: 'text',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState(() => `guest_${Math.floor(Math.random() * 1000)}`);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep scroll pinned to the bottom on new messages.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: username,
        content: inputMessage,
        timestamp: new Date().toLocaleTimeString(),
        type: 'text',
      },
    ]);
    setInputMessage('');
  };

  const sendFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: username,
        content: `Shared a file: ${file.name}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'file',
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto flex max-w-3xl flex-col px-4 pt-24 pb-8 sm:px-6">
        <DraftBanner note="A real chat UI with no real backend. Refresh wipes everything. Fun as a placeholder for a future WebSocket layer." />

        <div className="mb-4">
          <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            Chat sketch
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[color:var(--fg-muted)]">
            <span>handle:</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded border border-[color:var(--border)] bg-[color:var(--bg-elevated)]
                         px-2 py-1 text-sm text-[color:var(--fg)] focus:border-[color:var(--accent)] focus:outline-none"
            />
            <span className="inline-flex items-center gap-2 text-xs text-[color:var(--accent-warm)]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[color:var(--accent-warm)]" />
              local-only
            </span>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="mb-4 flex-1 overflow-y-auto rounded-lg border border-[color:var(--border)]
                     bg-[color:var(--bg-elevated)] p-4
                     min-h-[300px] max-h-[55vh]"
        >
          <div className="space-y-3">
            {messages.map((m) => {
              const mine = m.sender === username;
              const system = m.sender === 'system';
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={[
                      'max-w-[78%] rounded-lg p-3 text-sm',
                      system
                        ? 'border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/8 text-[color:var(--fg)]'
                        : mine
                          ? 'bg-[color:var(--accent)] text-[color:var(--bg)]'
                          : 'bg-[color:var(--bg-overlay)] text-[color:var(--fg)] border border-[color:var(--border)]',
                    ].join(' ')}
                  >
                    <div className="mb-1 flex items-baseline gap-2">
                      <span className="font-mono text-[11px] uppercase tracking-widest opacity-80">
                        {m.sender}
                      </span>
                      <span className="font-mono text-[10px] opacity-60">{m.timestamp}</span>
                    </div>
                    {m.type === 'file' ? (
                      <div className="flex items-center gap-2">📎 {m.content}</div>
                    ) : (
                      <p className="whitespace-pre-wrap break-words">{m.content}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={sendFile}
            className="hidden"
            aria-label="Upload file"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-overlay)]
                       px-3 transition-all hover:border-[color:var(--border-strong)]"
            title="Upload file"
          >
            📎
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="say something into the void…"
            className="flex-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)]
                       px-4 py-2.5 text-sm text-[color:var(--fg)]
                       placeholder:text-[color:var(--fg-subtle)]
                       focus:border-[color:var(--accent)] focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-[color:var(--accent)] px-5 py-2.5 text-sm font-bold
                       text-[color:var(--bg)] transition-all hover:scale-[1.03]
                       hover:shadow-[0_0_20px_var(--accent-glow-strong)]"
          >
            send
          </button>
        </form>
      </main>
    </div>
  );
}
