# fmhy archive

Left over from the full-mirror version of `/fmhy`, before the pivot to a themed
directory of backup sites. Kept, not deleted, because the category navigation and
search were the interesting part and may be wanted again if `/fmhy` ever grows
past one flat list.

- `_components/CategoryNav.tsx`, `_components/SearchBox.tsx`: the old browse UI.
- `_data/categories.ts`, `_data/index.json`: the category index the mirror built.
- `_lib/types.ts`: the shape of that index.

The live page reads only `_data/backup-sites.json`, produced by
`scripts/fetch-fmhy.ts`. Nothing here is imported. Relative imports inside this
folder still resolve because the `_components` / `_data` / `_lib` layout was kept
intact on the way in.

A leading underscore makes these private folders, so the App Router will never
turn anything in here into a route.
