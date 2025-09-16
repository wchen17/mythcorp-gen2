import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MythCorp - Enter the Experience",
  description: "An immersive digital experience by MythCorp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-mono">
        {children}
      </body>
    </html>
  );
}
