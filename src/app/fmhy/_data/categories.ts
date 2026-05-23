import type { IndexCategory, IndexFile } from '../_lib/types';
import indexData from './index.json';

export type CategoryMeta = IndexCategory;

const INDEX = indexData as IndexFile;

export const CATEGORIES: ReadonlyArray<CategoryMeta> = INDEX.categories;

export const ROOT_CATEGORIES = CATEGORIES.filter((c) => c.namespace === 'root');
export const OTHER_DOCS = CATEGORIES.filter((c) => c.namespace === 'other');
export const POSTS = CATEGORIES.filter((c) => c.namespace === 'posts');

export const FETCHED_AT = INDEX.fetchedAt;

// Display overrides for root catalog pages. Anything missing here gets a derived
// title-case name, the default emoji, and an empty blurb. This is the only
// hand-curated table in the mirror — everything else is auto-discovered.
export const ROOT_OVERRIDES: Record<string, { name: string; emoji: string; blurb: string }> = {
  'beginners-guide':    { name: 'Beginners Guide',     emoji: '◎', blurb: "Start here if you're new." },
  'privacy':            { name: 'Adblockers / Privacy', emoji: '🛡', blurb: 'Adblockers, anti-tracking, VPN guides.' },
  'storage':            { name: 'Storage',              emoji: '📦', blurb: 'Hosting, file storage, transfer.' },
  'video':              { name: 'Streaming',            emoji: '🎬', blurb: 'Movies, TV, anime, sports.' },
  'video-tools':        { name: 'Video Tools',          emoji: '🎞', blurb: 'Editors, players, downloaders.' },
  'audio':              { name: 'Audio / Music',        emoji: '🎧', blurb: 'Streaming, downloads, podcasts.' },
  'gaming':             { name: 'Gaming',               emoji: '🎮', blurb: 'Game tools, ROMs, emulation.' },
  'gaming-tools':       { name: 'Gaming Tools',         emoji: '🕹', blurb: 'Modding, cheats, performance utilities.' },
  'educational':        { name: 'Reading / Education',  emoji: '📚', blurb: 'Books, courses, learning resources.' },
  'reading':            { name: 'Reading',              emoji: '📖', blurb: 'Books, comics, manga, news.' },
  'downloading':        { name: 'Downloads',            emoji: '⬇',  blurb: 'Direct downloads, torrent guides.' },
  'torrenting':         { name: 'Torrenting',           emoji: '🧲', blurb: 'Trackers, clients, magnet helpers.' },
  'mobile':             { name: 'Android / iOS',        emoji: '📱', blurb: 'Mobile tweaks, modded apps.' },
  'social-media-tools': { name: 'Social Media Tools',   emoji: '💬', blurb: 'Twitter, Reddit, Discord helpers.' },
  'ai':                 { name: 'AI Tools',             emoji: '✦',  blurb: 'Free / open-source AI services.' },
  'developer-tools':    { name: 'Developer Tools',      emoji: '⌬', blurb: 'IDEs, APIs, dev resources.' },
  'image-tools':        { name: 'Image Tools',          emoji: '🖼', blurb: 'Editing, compression, search.' },
  'system-tools':       { name: 'System Tools',         emoji: '⚙',  blurb: 'Windows, Linux, macOS utilities.' },
  'linux-macos':        { name: 'Linux / macOS',        emoji: '🐧', blurb: 'OS-specific utilities and guides.' },
  'text-tools':         { name: 'Text Tools',           emoji: '📝', blurb: 'Note apps, OCR, conversion.' },
  'file-tools':         { name: 'File Tools',           emoji: '🗂', blurb: 'Compression, conversion, recovery.' },
  'internet-tools':     { name: 'Internet Tools',       emoji: '🌐', blurb: 'Search, scraping, proxies.' },
  'misc':               { name: 'Miscellaneous',        emoji: '✱',  blurb: 'Things that fit nowhere else.' },
  'non-english':        { name: 'Non-English',          emoji: '◐', blurb: 'Resources in other languages.' },
  'sandbox':            { name: 'Sandbox',              emoji: '⊞',  blurb: 'Test environments, throwaways.' },
  'startpage':          { name: 'Startpage',            emoji: '⌂', blurb: 'Custom browser homepage layouts.' },
  'unsafe':             { name: 'Unsafe Sites',         emoji: '⚠', blurb: 'Risky links, kept for completeness.' },
};

export const OTHER_OVERRIDES: Record<string, { name: string; emoji: string; blurb: string }> = {
  'selfhosting':  { name: 'Self-Hosting Guide', emoji: '🏠', blurb: 'Run your own FMHY instance.' },
  'backups':      { name: 'Backups',            emoji: '💾', blurb: 'Mirrors and archive snapshots.' },
  'FAQ':          { name: 'FAQ',                emoji: '?',  blurb: 'Frequently asked questions.' },
  'contributing': { name: 'Contributing',       emoji: '✎', blurb: 'How to suggest edits to FMHY.' },
  'wallpapers':   { name: 'Wallpapers',         emoji: '🖼', blurb: 'FMHY-themed desktop wallpapers.' },
};
