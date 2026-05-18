export type CategoryMeta = {
  slug: string;
  name: string;
  emoji: string;
  blurb: string;
  upstreamFile: string;
};

export const CATEGORIES: ReadonlyArray<CategoryMeta> = [
  { slug: 'beginners-guide',    name: 'Beginners Guide',     emoji: '◎', blurb: "Start here if you're new.",                upstreamFile: 'beginners-guide.md' },
  { slug: 'adblockvpnguide',    name: 'Adblockers / Privacy', emoji: '🛡', blurb: 'Adblockers, anti-tracking, VPN guides.',   upstreamFile: 'privacy.md' },
  { slug: 'storage',            name: 'Storage',              emoji: '📦', blurb: 'Hosting, file storage, transfer.',         upstreamFile: 'storage.md' },
  { slug: 'video',              name: 'Streaming',            emoji: '🎬', blurb: 'Movies, TV, anime, sports.',               upstreamFile: 'video.md' },
  { slug: 'video-tools',        name: 'Video Tools',          emoji: '🎞', blurb: 'Editors, players, downloaders.',           upstreamFile: 'video-tools.md' },
  { slug: 'audio',              name: 'Audio / Music',        emoji: '🎧', blurb: 'Streaming, downloads, podcasts.',          upstreamFile: 'audio.md' },
  { slug: 'gamingpiracyguide',  name: 'Gaming',               emoji: '🎮', blurb: 'Game tools, ROMs, emulation.',             upstreamFile: 'gaming.md' },
  { slug: 'edu',                name: 'Reading / Education',  emoji: '📚', blurb: 'Books, courses, learning resources.',      upstreamFile: 'educational.md' },
  { slug: 'reading',            name: 'Reading',              emoji: '📖', blurb: 'Books, comics, manga, news.',              upstreamFile: 'reading.md' },
  { slug: 'downloadpiracyguide', name: 'Downloads',           emoji: '⬇',  blurb: 'Direct downloads, torrent guides.',        upstreamFile: 'downloading.md' },
  { slug: 'torrenting',         name: 'Torrenting',           emoji: '🧲', blurb: 'Trackers, clients, magnet helpers.',       upstreamFile: 'torrenting.md' },
  { slug: 'android-iosguide',   name: 'Android / iOS',        emoji: '📱', blurb: 'Mobile tweaks, modded apps.',              upstreamFile: 'mobile.md' },
  { slug: 'social-media-tools', name: 'Social Media Tools',   emoji: '💬', blurb: 'Twitter, Reddit, Discord helpers.',        upstreamFile: 'social-media-tools.md' },
  { slug: 'ai',                 name: 'AI Tools',             emoji: '✦',  blurb: 'Free / open-source AI services.',          upstreamFile: 'ai.md' },
  { slug: 'devtools',           name: 'Developer Tools',      emoji: '⌬', blurb: 'IDEs, APIs, dev resources.',                upstreamFile: 'developer-tools.md' },
  { slug: 'img-tools',          name: 'Image Tools',          emoji: '🖼', blurb: 'Editing, compression, search.',            upstreamFile: 'image-tools.md' },
  { slug: 'system-tools',       name: 'System Tools',         emoji: '⚙',  blurb: 'Windows, Linux, macOS utilities.',         upstreamFile: 'system-tools.md' },
  { slug: 'linux-macos',        name: 'Linux / macOS',        emoji: '🐧', blurb: 'OS-specific utilities and guides.',        upstreamFile: 'linux-macos.md' },
  { slug: 'text-tools',         name: 'Text Tools',           emoji: '📝', blurb: 'Note apps, OCR, conversion.',              upstreamFile: 'text-tools.md' },
  { slug: 'file-tools',         name: 'File Tools',           emoji: '🗂', blurb: 'Compression, conversion, recovery.',       upstreamFile: 'file-tools.md' },
  { slug: 'internet-tools',     name: 'Internet Tools',       emoji: '🌐', blurb: 'Search, scraping, proxies.',               upstreamFile: 'internet-tools.md' },
  { slug: 'misc',               name: 'Miscellaneous',        emoji: '✱',  blurb: 'Things that fit nowhere else.',            upstreamFile: 'misc.md' },
  { slug: 'non-english',        name: 'Non-English',          emoji: '◐', blurb: 'Resources in other languages.',             upstreamFile: 'non-english.md' },
  { slug: 'sandbox',            name: 'Sandbox',              emoji: '⊞',  blurb: 'Test environments, throwaways.',           upstreamFile: 'sandbox.md' },
];

export function categoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
