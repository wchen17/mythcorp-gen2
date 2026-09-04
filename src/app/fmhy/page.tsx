import { SiteHeader } from '../components/SiteHeader';
import backupData from './_data/backup-sites.json';

type BackupSite = { name: string; url: string; note: string };
type BackupGroup = { heading: string; sites: BackupSite[] };
type BackupDataFile = { fetchedAt: string; groups: BackupGroup[] };

const DATA = backupData as BackupDataFile;

const FETCHED_DATE = new Date(DATA.fetchedAt).toLocaleDateString('en-US', {
  year: 'numeric', month: 'short', day: 'numeric',
});
const TOTAL = DATA.groups.reduce((n, g) => n + g.sites.length, 0);

export const metadata = {
  title: 'FMHY Backup Sites, MYTHCORP',
  description: 'When fmhy.net is down, these mirrors have you covered.',
};

export default function FmhyPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader tagline="FMHY BACKUP" />

      <main className="mx-auto max-w-4xl px-4 pt-24 pb-16 sm:px-6">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
            [ /FMHY / wip ]
          </p>
          <h1 className="themed-heading mt-3 text-4xl font-semibold sm:text-5xl">
            FMHY backup sites
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[color:var(--fg-muted)] sm:text-base">
            When{' '}
            <a
              href="https://fmhy.net"
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]"
            >
              fmhy.net
            </a>{' '}
            is down, these {TOTAL} mirrors have you covered. Sourced from{' '}
            <a
              href="https://github.com/fmhy/edit/blob/main/docs/other/backups.md"
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]"
            >
              fmhy/edit
            </a>
            . Snapshot {FETCHED_DATE}.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {DATA.groups.map((group) => (
            <BackupSection key={group.heading} group={group} />
          ))}
        </div>

        <div className="mt-12 rounded-[var(--radius)] border border-[color:var(--border)] p-5">
          <p className="text-sm text-[color:var(--fg-muted)]">
            These mirrors are community-maintained. Availability varies by site. The upstream source
            is{' '}
            <a
              href="https://github.com/fmhy/edit/blob/main/docs/other/backups.md"
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--accent)] underline underline-offset-4"
            >
              docs/other/backups.md
            </a>{' '}
            on the FMHY edit repo, refreshed weekly via{' '}
            <code className="font-mono text-[color:var(--accent-soft)]">npm run fetch:fmhy</code>.
          </p>
        </div>
      </main>
    </div>
  );
}

function BackupSection({ group }: { group: BackupGroup }) {
  return (
    <section>
      <h2 className="themed-heading text-xl font-semibold">{group.heading}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {group.sites.map((site) => (
          <li key={site.url}>
            <BackupCard site={site} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function BackupCard({ site }: { site: BackupSite }) {
  return (
    <a
      href={site.url}
      target="_blank"
      rel="noreferrer"
      className="themed-surface themed-surface-interactive block p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-[color:var(--fg)]">{site.name}</span>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent-soft)]">
          ↗
        </span>
      </div>
      <div className="mt-0.5 truncate font-mono text-[11px] text-[color:var(--fg-subtle)]">
        {site.url.replace(/^https?:\/\//, '')}
      </div>
      {site.note && (
        <p className="mt-1.5 text-xs text-[color:var(--fg-muted)]">{site.note}</p>
      )}
    </a>
  );
}
