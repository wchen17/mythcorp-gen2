'use client';

import { ThemeSwitcher } from '../../../components/ThemeSwitcher';
import { Walkthrough, Section, Code, Aside } from '../_components/Walkthrough';
import { DemoPanel } from '../_components/DemoPanel';
import { TokenPlayground } from '../_components/TokenPlayground';

export default function ThemeSystemWalkthrough() {
  return (
    <Walkthrough
      eyebrow="[ /wc/learn/theme-system / wip ]"
      title="A theme system from CSS variables"
      intro={
        <>
          The site has three themes, <em>cyberpunk</em>, <em>luxury</em>, and{' '}
          <em>paper</em>, and you can switch between them at any time. The
          switcher is built into the header, but here&rsquo;s a copy you can
          poke at while you read:
          <div className="mt-4 inline-block rounded-lg border border-[color:var(--border)]
                          bg-[color:var(--bg-elevated)] p-3">
            <ThemeSwitcher />
          </div>
        </>
      }
    >
      <Section title="Why CSS variables, not a styling library">
        <p>
          The whole theme system lives in one CSS file (
          <code className="font-mono text-[color:var(--accent-soft)]">src/app/globals.css</code>
          ), three React files, and zero dependencies. No <code className="font-mono">next-themes</code>,
          no <code className="font-mono">styled-components</code>, no theme-aware Tailwind plugin.
          A <code className="font-mono">data-theme</code> attribute on{' '}
          <code className="font-mono">&lt;html&gt;</code> swaps every token at once.
        </p>
        <p>
          Every component reads the tokens via <code className="font-mono">var(--accent)</code>,{' '}
          <code className="font-mono">var(--bg)</code>, etc., so a single attribute change cascades through
          the entire tree without a re-render.
        </p>
      </Section>

      <Section title="Step 1: define the tokens">
        <p>Each theme is a block of CSS variables under a selector:</p>
        <Code>{`[data-theme="cyberpunk"] {
  --bg: #0a0a0a;
  --fg: #ededed;
  --accent: #00ffff;
  --accent-glow: rgba(0, 255, 255, 0.5);
  /* …font tokens, border tokens, skyline tints… */
}

[data-theme="luxury"] {
  --bg: #0d0a14;
  --fg: #f5e6c8;
  --accent: #d4a574;
  /* …warm midnight, cream, gold… */
}

[data-theme="paper"] {
  --bg: #f5efe6;
  --fg: #2a2520;
  --accent: #b85c38;
  /* …warm off-white reading room… */
}`}</Code>
        <Aside>
          The same variable names exist in every theme block, just with different
          values. Components never have to know what theme is active, they
          always reach for <code className="font-mono">--accent</code> and trust the
          right colour will be in scope.
        </Aside>
      </Section>

      <Section title="Step 2: make components consume the tokens">
        <p>
          Tailwind v4 lets you reference custom properties directly with the{' '}
          <code className="font-mono">[color:var(--name)]</code> escape, so theme migration is mostly
          search-and-replace:
        </p>
        <Code>{`// Before, hardcoded:
<button className="bg-cyan-400 text-black hover:bg-cyan-300">

// After, theme-aware:
<button
  className="bg-[color:var(--accent)] text-[color:var(--bg)]
             hover:shadow-[0_0_20px_var(--accent-glow-strong)]"
>`}</Code>
      </Section>

      <Section title="Step 3: switch the theme without a flash">
        <p>
          The trick is to set <code className="font-mono">data-theme</code> <em>before</em> React
          hydrates. We do that with a tiny inline script in{' '}
          <code className="font-mono">layout.tsx</code> that runs synchronously
          in <code className="font-mono">&lt;head&gt;</code>:
        </p>
        <Code>{`<script dangerouslySetInnerHTML={{ __html:
  "(function(){try{var t=localStorage.getItem('mythcorp-theme');" +
  "if(t==='cyberpunk'||t==='luxury'||t==='paper')" +
  "{document.documentElement.dataset.theme=t;}" +
  "else{document.documentElement.dataset.theme='cyberpunk';}}" +
  "catch(e){document.documentElement.dataset.theme='cyberpunk';}})();"
}} />`}</Code>
        <p>
          By the time the first paint happens, the browser already knows which theme
          to use. No flash of unstyled colour, no flash of <em>wrong</em> colour.
        </p>
      </Section>

      <Section title="Step 4: persist + transition">
        <p>
          The <code className="font-mono">ThemeContext</code> writes the chosen
          theme to <code className="font-mono">localStorage</code> and updates the{' '}
          <code className="font-mono">data-theme</code> attribute. CSS handles the
          fade with a 400ms <code className="font-mono">background-color</code> /{' '}
          <code className="font-mono">color</code> transition on{' '}
          <code className="font-mono">&lt;body&gt;</code>, gated behind a{' '}
          <code className="font-mono">.theme-ready</code> class so the very first
          paint isn&rsquo;t animated.
        </p>
      </Section>

      <Section title="Now break it (safely)">
        <p>
          Tokens are just custom properties on <code className="font-mono">&lt;html&gt;</code>,
          so you can overwrite them live. The pickers on the right call{' '}
          <code className="font-mono">setProperty</code> on the root element. An
          inline style outranks the <code className="font-mono">[data-theme]</code>{' '}
          block on specificity, so the page recolors the instant you drag a
          swatch, this very article included.
        </p>
        <DemoPanel
          code={
            <Code filename="the whole trick" highlight={[5, 6]}>{`/* globals.css: one value per theme block */
[data-theme="paper"] { --accent: #b85c38; }

/* an inline style on <html> outranks that block */
document.documentElement.style
  .setProperty('--accent', pickedColor);`}</Code>
          }
          demo={<TokenPlayground />}
        />
        <Aside>
          The playground never writes <code className="font-mono">localStorage</code>{' '}
          and never touches <code className="font-mono">dataset.theme</code>. It
          remembers every token it overrides and removes exactly those on reset,
          on unmount, and whenever you switch themes from the header, so it can
          repaint the page without ever corrupting your saved theme.
        </Aside>
      </Section>

      <Section title="Where to look">
        <p>The whole system is four files:</p>
        <ul className="list-inside list-disc space-y-1 break-all font-mono text-sm">
          <li><code>src/app/globals.css</code>, token definitions</li>
          <li><code>src/app/contexts/ThemeContext.tsx</code>, provider + hook</li>
          <li><code>src/app/components/ThemeSwitcher.tsx</code>, UI</li>
          <li><code>src/app/layout.tsx</code>, pre-paint bootstrap script</li>
        </ul>
        <Aside>
          Want to add a new theme? Add a fourth <code className="font-mono">[data-theme=&quot;...&quot;]</code> block
          in <code className="font-mono">globals.css</code>, append it to{' '}
          <code className="font-mono">THEMES</code> in <code className="font-mono">ThemeContext.tsx</code>,
          and update the bootstrap script&rsquo;s validation. That&rsquo;s it.
        </Aside>
      </Section>
    </Walkthrough>
  );
}
