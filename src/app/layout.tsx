import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { HelpDot } from "./components/HelpDot";

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

// Inline so it runs before paint and avoids a flash of the wrong theme.
const themeBootstrap = `(function(){try{var t=localStorage.getItem('mythcorp-theme');if(t==='cyberpunk'||t==='luxury'||t==='paper'){document.documentElement.dataset.theme=t;}else{document.documentElement.dataset.theme='cyberpunk';}}catch(e){document.documentElement.dataset.theme='cyberpunk';}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="cyberpunk" suppressHydrationWarning>
      <head>
        {/* Preload the heavy assets the boot sequence depends on so the
            crossfade into the landing has no waterfall. */}
        <link rel="preload" href="/spectre.glb" as="fetch" type="model/gltf-binary" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Inter_Bold.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/chicagoskyline.jpg" as="image" />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <HelpDot />
        </ThemeProvider>
      </body>
    </html>
  );
}
