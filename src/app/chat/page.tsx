'use client';

import { useEffect, useRef, useState } from 'react';
import { SiteHeader } from '../components/SiteHeader';

interface Message {
  id: string;
  user: string;
  text: string;
  ts: number;
}

type ConnectionState = 'connecting' | 'open' | 'closed';

function buildWsUrl(): string {
  const base = new URL(window.location.href);
  const protocol = base.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${base.host}/api/chat`;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(() => `guest_${Math.floor(Math.random() * 1000)}`);
  const [status, setStatus] = useState<ConnectionState>('connecting');
  const wsRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Open the WebSocket once on mount. Reconnect logic is intentionally
  // minimal; if the connection drops, refreshing the page resets state.
  useEffect(() => {
    let active = true;
    let socket: WebSocket | null = null;
    try {
      socket = new WebSocket(buildWsUrl());
    } catch {
      setStatus('closed');
      return;
    }
    wsRef.current = socket;

    socket.addEventListener('open', () => {
      if (!active) return;
      setStatus('open');
    });

    socket.addEventListener('message', (e) => {
      if (!active) return;
      try {
        const data = JSON.parse(e.data) as
          | { type: 'history'; messages: Message[] }
          | { type: 'message'; message: Message };
        if (data.type === 'history') {
          setMessages(data.messages);
        } else if (data.type === 'message') {
          setMessages((prev) => [...prev, data.message]);
        }
      } catch {
        /* ignore malformed payload */
      }
    });

    socket.addEventListener('close', () => {
      if (!active) return;
      setStatus('closed');
    });

    socket.addEventListener('error', () => {
      if (!active) return;
      setStatus('closed');
    });

    return () => {
      active = false;
      socket?.close();
      wsRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ user, text }));
    setInput('');
  };

  const sendFileNote = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ user, text: `📎 shared a file: ${file.name}` }));
    e.target.value = '';
  };

  const statusBadge = {
    connecting: { label: 'connecting', color: 'var(--accent-warm)' },
    open: { label: 'live', color: 'var(--accent)' },
    closed: { label: 'offline', color: 'var(--fg-subtle)' },
  }[status];

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto flex max-w-3xl flex-col px-4 pt-24 pb-8 sm:px-6">
        <div className="mb-4">
          <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            Global chat
          </h1>
          <p className="mt-1 text-sm text-[color:var(--fg-muted)]">
            One room, everyone. Last 50 messages persist via a Cloudflare Durable Object.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[color:var(--fg-muted)]">
            <span>handle:</span>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              maxLength={32}
              className="rounded border border-[color:var(--border)] bg-[color:var(--bg-elevated)]
                         px-2 py-1 text-sm text-[color:var(--fg)] focus:border-[color:var(--accent)] focus:outline-none"
            />
            <span
              className="inline-flex items-center gap-2 text-xs"
              style={{ color: statusBadge.color }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: statusBadge.color, animation: status === 'open' ? 'pulse 2s ease-in-out infinite' : undefined }}
              />
              {statusBadge.label}
            </span>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="mb-4 flex-1 overflow-y-auto rounded-lg border border-[color:var(--border)]
                     bg-[color:var(--bg-elevated)] p-4
                     min-h-[300px] max-h-[55vh]"
        >
          {messages.length === 0 ? (
            <p className="text-sm text-[color:var(--fg-subtle)]">
              {status === 'open' ? 'no messages yet, say hi.' : 'waiting for the room...'}
            </p>
          ) : (
            <div className="space-y-3">
              {messages.map((m) => {
                const mine = m.user === user;
                return (
                  <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={[
                        'max-w-[78%] rounded-lg p-3 text-sm',
                        mine
                          ? 'bg-[color:var(--accent)] text-[color:var(--bg)]'
                          : 'bg-[color:var(--bg-overlay)] text-[color:var(--fg)] border border-[color:var(--border)]',
                      ].join(' ')}
                    >
                      <div className="mb-1 flex items-baseline gap-2">
                        <span className="font-mono text-[11px] uppercase tracking-widest opacity-80">
                          {m.user}
                        </span>
                        <span className="font-mono text-[10px] opacity-60">
                          {new Date(m.ts).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <form onSubmit={send} className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={sendFileNote}
            className="hidden"
            aria-label="Upload file"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-overlay)]
                       px-3 transition-all hover:border-[color:var(--border-strong)]"
            title="Share a filename"
            disabled={status !== 'open'}
          >
            📎
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={status === 'open' ? 'say something…' : 'connecting…'}
            disabled={status !== 'open'}
            maxLength={1024}
            className="flex-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)]
                       px-4 py-2.5 text-sm text-[color:var(--fg)]
                       placeholder:text-[color:var(--fg-subtle)]
                       focus:border-[color:var(--accent)] focus:outline-none
                       disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status !== 'open' || !input.trim()}
            className="themed-button px-5 py-2.5 text-sm disabled:opacity-50"
          >
            send
          </button>
        </form>
      </main>
    </div>
  );
}
