// Snippet strings for the landing-flow walkthrough, split out so page.tsx
// stays under the ~250-line ceiling once the FlowStepper demo is embedded.

export const APPLOADER_SNIPPET = `// AppLoader: fixed-window boot gate in src/app/page.tsx
const LOADING_DURATION_MS = 3500;

function AppLoader({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsReady(true), LOADING_DURATION_MS);
    return () => clearTimeout(fadeTimer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const swapTimer = setTimeout(() => setShowChildren(true), 600);
    return () => clearTimeout(swapTimer);
  }, [isReady]);

  if (showChildren) return <>{children}</>;

  return (
    <div style={{ opacity: isReady ? 0 : 1, transition: 'opacity 600ms ease' }}>
      <LoadingScreen onFinished={() => {}} />
    </div>
  );
}`;

export const SESSION_SNIPPET = `useEffect(() => {
  let alreadyBooted = false;
  try {
    alreadyBooted = sessionStorage.getItem(SESSION_BOOTED_KEY) === '1';
  } catch {
    // sessionStorage is blocked in some private-browsing modes; fall through
  }
  setSkipBoot(alreadyBooted);
  if (alreadyBooted) {
    setIsReady(true);
    setShowChildren(true);
    return;
  }
  try { sessionStorage.setItem(SESSION_BOOTED_KEY, '1'); } catch { /* ignore */ }
}, []);`;

export const BINARY_SNIPPET = `// Inside BinaryDigit, position lerps from start to end each frame
useFrame(() => {
  if (textRef.current) {
    textRef.current.position.lerpVectors(startPosition, endPosition, progress);
  }
});

// Start position is end * 5: digits fly in from five times the distance
const startPos = endPos.clone().multiplyScalar(5);`;

export const PRELOAD_SNIPPET = `// At the top of LandingPage.tsx, outside the component:
useGLTF.preload('/spectre.glb');`;

export const GSAP_SNIPPET = `const tl = gsap.timeline({ onComplete: () => onTransitionComplete?.() });

tl.to(backgroundRef.current, { opacity: 0, duration: 1.5, ease: 'power2.in' }, 0);
tl.to(promptRef.current,    { opacity: 0, duration: 1.0, ease: 'power2.in' }, 0);

contentRef.current.traverse((child) => {
  const mat = child.material;
  if (mat) tl.to(mat, { opacity: 0, duration: 1, ease: 'power2.in' }, 0.2);
});`;
