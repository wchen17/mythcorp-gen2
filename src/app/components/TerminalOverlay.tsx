'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { THEMES, useTheme, type ThemeName } from '../contexts/ThemeContext';

/**
 * Press "/" anywhere to open a cosmetic terminal. It looks real but has no
 * shell access; commands are canned, except `cd` and `boot`, which navigate.
 * Theme-aware, keyboard-driven, closes on Esc / `exit` / outside click.
 */

const ROUTES: ReadonlyArray<string> = [
  '/', '/experience', '/fmhy', '/animals', '/about', '/contact',
  '/wc', '/wc/about', '/wc/papers', '/wc/papers/ai-cybercrime',
  '/wc/learn', '/wc/learn/theme-system', '/og', '/og/interactive', '/og/chat',
];

type Line = { kind: 'in' | 'out' | 'err' | 'sys'; text: string };

const BANNER: Line[] = [
  { kind: 'sys', text: 'mythcorp shell, v1. type `help` for commands, `exit` to close.' },
];

export function TerminalOverlay() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Global "/" to open, when not typing into a field and not already open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open) return;
      const t = e.target as HTMLElement | null;
      const tag = (t?.tagName ?? '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || t?.isContentEditable) return;
      if (e.key === '/') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Focus the input and keep the log scrolled to the bottom when open.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines, open]);

  const print = (next: Line[]) => setLines((prev) => [...prev, ...next]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    print([{ kind: 'in', text: cmd }]);
    if (!cmd) return;
    setHistory((h) => [...h, cmd]);

    const [name, ...args] = cmd.split(/\s+/);
    const arg = args.join(' ');

    switch (name.toLowerCase()) {
      case 'help':
        print([{ kind: 'out', text: 'help  ls  cd <route>  whoami  cat readme  theme [name]  boot  date  clear  exit' }]);
        break;
      case 'ls':
        print(ROUTES.map((r) => ({ kind: 'out' as const, text: r })));
        break;
      case 'cd': {
        if (!arg || arg === '~' || arg === '/') return navigate('/');
        const target = arg.startsWith('/') ? arg : `/${arg}`;
        if (ROUTES.includes(target)) return navigate(target);
        print([{ kind: 'err', text: `cd: no such route: ${arg}` }]);
        break;
      }
      case 'whoami':
        print([{ kind: 'out', text: 'a curious visitor' }]);
        break;
      case 'cat':
        if (arg.toLowerCase() === 'readme' || arg.toLowerCase() === 'readme.md') {
          print([{ kind: 'out', text: 'MYTHCORP, a personal site built as a sandbox. The codebase is annotated at /wc/learn. Front is theatre, /wc is the workshop.' }]);
        } else {
          print([{ kind: 'err', text: `cat: ${arg || 'missing operand'}: no such file` }]);
        }
        break;
      case 'theme': {
        if (!arg) {
          print([{ kind: 'out', text: `current: ${theme}. options: ${THEMES.map((t) => t.name).join(', ')}` }]);
          break;
        }
        const next = arg.toLowerCase() as ThemeName;
        if (THEMES.some((t) => t.name === next)) {
          setTheme(next);
          print([{ kind: 'out', text: `theme set to ${next}` }]);
        } else {
          print([{ kind: 'err', text: `theme: unknown theme: ${arg}` }]);
        }
        break;
      }
      case 'boot':
      case 'replay':
        print([{ kind: 'sys', text: 'replaying boot sequence...' }]);
        setOpen(false);
        router.push('/?boot=1');
        break;
      case 'date':
        print([{ kind: 'out', text: new Date().toString() }]);
        break;
      case 'sudo':
        print([{ kind: 'err', text: 'nice try. the spectre is watching.' }]);
        break;
      case 'clear':
        setLines([]);
        break;
      case 'exit':
        setOpen(false);
        break;
      default:
        print([{ kind: 'err', text: `command not found: ${name}. try \`help\`` }]);
    }
  };

  const navigate = (path: string) => {
    print([{ kind: 'sys', text: `→ ${path}` }]);
    setOpen(false);
    router.push(path);
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
      setHistIdx(null);
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const idx = histIdx === null ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(history[idx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx === null) return;
      const idx = histIdx + 1;
      if (idx >= history.length) {
        setHistIdx(null);
        setInput('');
      } else {
        setHistIdx(idx);
        setInput(history[idx]);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9000] flex flex-col" role="dialog" aria-label="Terminal">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div
        className="terminal-in relative max-h-[60vh] min-h-[14rem] w-full
                   border-b border-[color:var(--border-strong)]
                   bg-[color:var(--bg-overlay)] backdrop-blur-md"
        onClick={() => inputRef.current?.focus()}
      >
        <style>{`
          @keyframes terminalIn { from { transform: translateY(-100%); } to { transform: translateY(0); } }
          .terminal-in { animation: terminalIn 0.22s ease-out; }
        `}</style>

        <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--accent)]">
            visitor@mythcorp
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]
                       transition-colors hover:text-[color:var(--accent)]"
          >
            esc to close
          </button>
        </div>

        <div
          ref={scrollRef}
          className="max-h-[calc(60vh-5.5rem)] overflow-y-auto px-4 py-3 font-mono text-sm leading-relaxed"
        >
          {lines.map((l, i) => (
            <Row key={i} line={l} />
          ))}

          <div className="flex items-center gap-2">
            <span className="text-[color:var(--accent)]">visitor@mythcorp:~$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKey}
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal input"
              className="flex-1 bg-transparent text-[color:var(--fg)] outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ line }: { line: Line }): ReactNode {
  if (line.kind === 'in') {
    return (
      <div className="flex items-center gap-2 text-[color:var(--fg-muted)]">
        <span className="text-[color:var(--accent)]">visitor@mythcorp:~$</span>
        <span>{line.text}</span>
      </div>
    );
  }
  const color =
    line.kind === 'err'
      ? 'text-[color:var(--accent-warm)]'
      : line.kind === 'sys'
        ? 'text-[color:var(--fg-subtle)]'
        : 'text-[color:var(--fg)]';
  return <div className={color}>{line.text}</div>;
}
