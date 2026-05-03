import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'BENSO',
  description: 'BENSO - Servicios profesionales para PyMEs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Preconnects para recursos externos */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        {/* Preload fuentes críticas */}
        <link rel="preload" href="/benso/Cocogoose_trial.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/benso/fonnts.com-TT-Commons-Bold.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/benso/fonnts.com-TT-Commons-Regular.otf" as="font" type="font/otf" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
