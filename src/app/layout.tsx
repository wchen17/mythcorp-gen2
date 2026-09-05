import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { HelpDot } from "./components/HelpDot";
import { KonamiEgg } from "./components/KonamiEgg";
import { TerminalOverlay } from "./components/TerminalOverlay";
import { PlainField } from "./components/plain/PlainField";
import { PlainHold } from "./components/plain/PlainHold";
import { PLAIN_OPEN_PREFIXES, HOLD_ATTR } from "./components/plain/holdState";
import { SCHEME_ATTR, SCHEME_KEY } from "./components/plain/holdScheme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MYTHCORP - Discover Your Potential",
  description: "Founded in Chicago - Discover Your Potential with MYTHCORP",
};

// Inline so it runs before paint: it avoids a flash of the wrong theme, and
// in plain mode a flash of the real page before the holding screen covers it.
//
// The storage key carries a version. Bumping it to v2 when plain became the
// default is what holds returning visitors too: an older `mythcorp-theme`
// value is simply not read, so everyone starts on plain and anyone who leaves
// writes their choice under the new key.
const themeBootstrap = `(function(){var o=${JSON.stringify(PLAIN_OPEN_PREFIXES)};var d=document.documentElement;var t='plain';try{var s=localStorage.getItem('mythcorp-theme-v2');if(s==='cyberpunk'||s==='luxury'||s==='paper'||s==='plain'){t=s;}}catch(e){}d.dataset.theme=t;if(t==='plain'){var p=location.pathname.replace(/\\/+$/,'')||'/';var open=false;for(var i=0;i<o.length;i++){if(p===o[i]||p.indexOf(o[i]+'/')===0){open=true;break;}}if(!open){d.setAttribute('${HOLD_ATTR}','on');}var c='system';try{var q=localStorage.getItem('${SCHEME_KEY}');if(q==='light'||q==='dark'||q==='system'){c=q;}}catch(e){}var dark=c==='dark'||(c==='system'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);d.setAttribute('${SCHEME_ATTR}',dark?'dark':'light');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The font variables must live on <html>, not <body>: the theme tokens
    // that reference them (--font-display and friends) are declared on
    // <html>, and a custom property resolves where it is DECLARED. On <body>
    // they were undefined at that point, so every token computed to an
    // invalid value and the whole site silently rendered in Times.
    <html
      lang="en"
      data-theme="plain"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preload the heavy assets the boot sequence depends on so the
            crossfade into the landing has no waterfall. */}
        <link rel="preload" href="/spectre.glb" as="fetch" type="model/gltf-binary" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Inter_Bold.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/chicagoskyline.jpg" as="image" />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <PlainField />
          <PlainHold />
          {/* Everything the holding screen hides lives inside #page-root.
              The field, the hold chrome and the terminal stay outside it. */}
          <div id="page-root">
            {children}
            <HelpDot />
            <KonamiEgg />
          </div>
          <TerminalOverlay />
        </ThemeProvider>
      </body>
    </html>
  );
}
