import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Volver al inicio"
      className={`
        fixed bottom-8 right-8 z-50
        w-12 h-12 rounded-2xl
        bg-carbon/80 backdrop-blur-md
        border border-white/10
        flex items-center justify-center
        text-cream/60 hover:text-cream
        hover:border-clay/50 hover:bg-carbon
        shadow-xl shadow-black/40
        transition-all duration-300 ease-out
        ${visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
};
