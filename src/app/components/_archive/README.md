# components archive

Superseded components kept for reference, matching the `landing/_archive/`
pattern. Nothing in here is imported.

- `LandingPage.tsx`: the 3D MYTHCORP title card from the two-stage boot, where
  `page.tsx` ran `loading -> landing -> homepage`. The boot now goes straight from
  `LoadingScreen` to `NewLandingPage`, so this stopped being mounted.

Worth keeping rather than deleting: the `/wc/learn/landing-flow` walkthrough still
teaches this file by name, including the `useGLTF.preload` pattern declared at its
top. That walkthrough needs either a rewrite against the current boot or a note
that it documents the older flow.
