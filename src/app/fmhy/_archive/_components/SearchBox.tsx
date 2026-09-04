'use client';

interface SearchBoxProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  resultsLabel?: string;
}

export function SearchBox({ value, onChange, placeholder, resultsLabel }: SearchBoxProps) {
  return (
    <div className="relative">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search the catalog...'}
        className="w-full rounded-[var(--radius)] border border-[color:var(--border)]
                   bg-[color:var(--bg-elevated)] px-4 py-3 pr-28
                   font-mono text-sm text-[color:var(--fg)]
                   placeholder:text-[color:var(--fg-subtle)]
                   focus:border-[color:var(--accent)] focus:outline-none"
      />
      {resultsLabel && (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2
                         font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">
          {resultsLabel}
        </span>
      )}
    </div>
  );
}
