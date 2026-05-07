'use client';

import { useEffect, useRef, useState } from 'react';

const TRIGGER = 'sudo';

type Line = { kind: 'in' | 'out'; text: string };

const COMMANDS: Record<string, string[]> = {
  help: [
    'available commands: ls, whoami, cat /etc/secrets, uptime, fortune, exit',
  ],
  ls: [
    'spectre.glb       skyline.jpg       Inter_Bold.json',
    'BACKLOG.md        STATUS.md         CLAUDE.md',
    'plans/            walkthroughs/     fragments/',
  ],
  whoami: ['guest@mythcorp ~ (you typed sudo, but we trust you anyway)'],
  uptime: ['up since the Chicago skyline first rendered. patiently.'],
  fortune: [
    'the best 3D scene is the one you forgot to optimise.',
  ],
  'cat /etc/secrets': [
    '#!/usr/bin/secret',
    'there is no secret. the secret was the friends we made along the way.',
    '(also: try the konami code)',
  ],
  clear: [],
  exit: [],
};

function runCommand(cmd: string): { lines: string[]; close?: boolean; clear?: boolean } {
  const trimmed = cmd.trim();
  if (!trimmed) return { lines: [] };
  if (trimmed === 'exit') return { lines: [], close: true };
  if (trimmed === 'clear') return { lines: [], clear: true };
  if (trimmed in COMMANDS) return { lines: COMMANDS[trimmed] };
  return { lines: [`zsh: command not found: ${trimmed}`] };
}

export function SudoTerminal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Line[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const buffer = useRef('');

  // Listen anywhere on the page for the literal `sudo`. Reset on any other key.
  useEffect(() => {
    if (open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      }
      if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
        buffer.current = (buffer.current + e.key.toLowerCase()).slice(-TRIGGER.length);
        if (buffer.current === TRIGGER) {
          buffer.current = '';
          setOpen(true);
          setHistory([
            { kind: 'out', text: 'mythcorp shell v0.1 (a fake one). type "help".' },
          ]);
        }
      } else {
        buffer.current = '';
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Esc to close, autofocus when opened.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    inputRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  const submit = () => {
    const line = input;
    setInput('');
    const result = runCommand(line);
    if (result.close) {
      setOpen(false);
      return;
    }
    if (result.clear) {
      setHistory([]);
      return;
    }
    setHistory((h) => [
      ...h,
      { kind: 'in', text: line },
      ...result.lines.map<Line>((t) => ({ kind: 'out', text: t })),
    ]);
  };

  return (
    <div
      role="dialog"
      aria-label="sudo shell"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="themed-surface w-[min(640px,92vw)] max-h-[70vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[color:var(--accent)]">
            sudo / mythcorp
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="close"
            className="font-mono text-xs text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]"
          >
            esc
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-6 text-[color:var(--fg)]">
          {history.map((l, i) => (
            <div key={i} className={l.kind === 'in' ? 'text-[color:var(--accent)]' : 'text-[color:var(--fg-muted)]'}>
              {l.kind === 'in' ? `> ${l.text}` : l.text}
            </div>
          ))}
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[color:var(--accent)]">{'>'}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
              }}
              spellCheck={false}
              autoComplete="off"
              className="flex-1 bg-transparent font-mono text-sm outline-none
                         text-[color:var(--fg)] placeholder:text-[color:var(--fg-subtle)]"
              placeholder="help"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
