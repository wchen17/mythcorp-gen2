// Removes .next and .open-next before a Cloudflare build.
//
// Why this exists: on Windows, Next's standalone output and OpenNext's bundle
// step both contain symlinked node_modules trees. Building over a previous
// build makes the tooling stat and copy the old tree, which fails as
// `EPERM: scandir .next/standalone/node_modules/react` or `EBUSY: rmdir
// .open-next/assets`. Both look like permission bugs and are really staleness.
// A clean directory each time costs a few seconds and removes the whole class.
//
// fs.rmSync unlinks symlinks rather than following them, so this cannot walk
// into the real package directories. Do not "improve" this into a shell rm or
// a PowerShell Remove-Item: PowerShell 5.1 can delete THROUGH a junction and
// take node_modules with it.
import { rmSync } from 'node:fs';

for (const dir of ['.next', '.open-next']) {
  rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  console.log(`cleaned ${dir}`);
}
