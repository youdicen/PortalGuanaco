import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Hero: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-title',
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out', stagger: 0.2 }
      );
      gsap.fromTo(
        '.hero-data',
        { opacity: 0 },
        { opacity: 1, duration: 2, delay: 1, ease: 'power2.out' }
      );
    }, container);
    
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={container}
      className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background with Dark Forest / Organic Texture from Unsplash */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1544468641-da151b75c808?q=80&w=2574&auto=format&fit=crop")',
        }}
      ></div>
      {/* Gradient to solid carbon at the bottom for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-carbon/70 via-carbon/80 to-carbon z-0 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col items-center text-center mt-20">
        <h1 className="flex flex-col gap-2 md:gap-4 w-full">
          <span className="hero-title block font-sans font-bold text-4xl md:text-6xl lg:text-8xl tracking-tighter text-cream leading-none">
            REPUTACIÓN REAL.
          </span>
          <span className="hero-title block font-serif italic font-light text-5xl md:text-7xl lg:text-9xl text-clay leading-none">
            Certeza Absoluta.
          </span>
        </h1>
        
        <p className="hero-data mt-8 md:mt-12 font-mono text-xs md:text-sm uppercase tracking-[0.2em] text-cream/70 max-w-2xl">
          El primer ecosistema de inteligencia de riesgo para emprendedores de El Salvador. 
          Prevención de fraude, validación de clientes y transacciones seguras.
        </p>

        <div className="hero-data mt-12 flex flex-col sm:flex-row gap-6 items-center">
          <button className="magnetic-button bg-moss text-cream px-8 py-4 font-sans font-semibold text-sm w-full sm:w-auto hover:bg-moss/80">
            Consultar Número
          </button>
          <a href="#protocol" className="font-mono text-xs uppercase tracking-widest text-clay hover:text-white transition-colors underline decoration-clay/30 underline-offset-8">
            Ver Protocolo
          </a>
        </div>
      </div>
    </section>
  );
};
