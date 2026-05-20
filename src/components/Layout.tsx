import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BackToTop } from './BackToTop';
import { Constellation } from './Constellation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative w-full overflow-hidden">
      {/* Neuronal Synapse Background */}
      <Constellation />

      {/* Global Noise Overlay Preset A */}
      <div className="noise-overlay pointer-events-none fixed inset-0 z-50">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <Header />
      
      <main className="flex-grow flex flex-col w-full relative z-10">
        {children}
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};
