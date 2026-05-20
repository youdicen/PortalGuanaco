import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SearchModule } from './SearchProtocol';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const [demonym, setDemonym] = useState('GUANACO');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered entrance for badge
      gsap.fromTo('.hero-badge',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
      // Main titles
      gsap.fromTo('.hero-title',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: 'power3.out', stagger: 0.18, delay: 0.2 }
      );
      // Subtext & CTA
      gsap.fromTo('.hero-data',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.9, ease: 'power2.out' }
      );
      // Stats counter entrance
      gsap.fromTo('.hero-stat',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.9, delay: 1.4, stagger: 0.1, ease: 'back.out(1.7)' }
      );
      // Orbs float
      gsap.to('.hero-orb-1', { y: -35, x: 15, duration: 8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to('.hero-orb-2', { y: 28, x: -18, duration: 11, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 });
      gsap.to('.hero-orb-3', { y: -22, x: 12, duration: 13, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 });
      // Scan line animation
      gsap.to('.hero-scanline', { y: '100%', duration: 2.5, ease: 'none', repeat: -1, delay: 1.5 });
    }, container);

    // Demonym cycling animation
    const words = ["GRINGO", "AZTECA", "CHAPÍN", "CATRACHO", "GUANACO", "TICO", "CANALERO", "GUANACO"];
    let currentIndex = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        currentIndex++;
        if (currentIndex < words.length) {
          setDemonym(words[currentIndex]);
        } else {
          clearInterval(interval);
        }
      }, 150);
      return () => clearInterval(interval);
    }, 800);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      ref={container}
      className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden py-32"
    >
      {/* ── Base background ── */}
      <div className="absolute inset-0 z-0 bg-transparent" />

      {/* ── Scan Line Effect ── */}
      <div
        className="hero-scanline absolute left-0 w-full h-[2px] z-0 pointer-events-none opacity-5"
        style={{ top: '-2px', background: 'linear-gradient(90deg, transparent, #CC5833, transparent)' }}
      />

      {/* ── Ambient Orbs ── */}
      <div
        className="hero-orb-1 absolute z-0 rounded-full blur-[130px] opacity-25 pointer-events-none"
        style={{ width: '60vw', height: '60vw', top: '-20%', left: '-15%', background: 'radial-gradient(circle, #2E4036 0%, transparent 70%)' }}
      />
      <div
        className="hero-orb-2 absolute z-0 rounded-full blur-[150px] opacity-20 pointer-events-none"
        style={{ width: '55vw', height: '55vw', bottom: '-25%', right: '-8%', background: 'radial-gradient(circle, #CC5833 0%, transparent 70%)' }}
      />
      <div
        className="hero-orb-3 absolute z-0 rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{ width: '35vw', height: '35vw', top: '35%', right: '20%', background: 'radial-gradient(circle, #3a5245 0%, transparent 70%)' }}
      />

      {/* ── Grid Overlay ── */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #F2F0E9 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      {/* ── Vignette ── */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 25%, #0a0d0b 100%)' }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-64 z-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #1A1A1A, transparent)' }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col items-center text-center">

        {/* ── H1: El nombre Guanaco como identidad de orgullo y poder ── */}
        <h1 className="flex flex-col gap-1 w-full mb-6">
          <span className="hero-title block font-sans font-bold text-5xl md:text-7xl lg:text-[6.5rem] tracking-[-0.03em] text-cream leading-none drop-shadow-2xl">
            EL {demonym}
          </span>
          <span className="hero-title block font-serif italic font-light text-4xl md:text-6xl lg:text-7xl leading-tight drop-shadow-xl"
            style={{ color: '#CC5833' }}>
            no paga por fraude.
          </span>
          <span className="hero-title block font-sans font-bold text-4xl md:text-6xl lg:text-[5.5rem] tracking-[-0.03em] text-cream leading-none">
            YA PROTEGE SU RED.
          </span>
        </h1>

        {/* ── H2: Propuesta de valor de alto impacto ── */}
        <p className="hero-title font-sans text-base md:text-lg text-cream/55 max-w-3xl leading-relaxed mb-12">
          La primera plataforma latinoamericana de{' '}
          <span className="text-cream font-semibold">Inteligencia de Riesgos Colaborativa</span>{' '}
          que detiene el fraude COD antes de que el mensajero salga. Impulsado por{' '}
          <span className="font-serif italic text-[#CC5833]">Sidere AI</span>.
        </p>

        {/* ── Search Module ── */}
        <div className="hero-data w-full flex flex-col items-center">
          <SearchModule />

          {/* Removed redundant CTAs */}

          {/* ── Live Stats ── */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: '30–40%', label: 'Tasa RTO de envíos COD en SV', accent: true },
              { value: '<0.1s', label: 'Latencia de consulta API', accent: false },
              { value: '5 países', label: 'Expansión proyectada 2026', accent: false },
            ].map((stat) => (
              <div key={stat.label} className="hero-stat flex flex-col items-center gap-1">
                <span
                  className="font-mono text-2xl md:text-3xl font-bold tracking-tight"
                  style={{ color: stat.accent ? '#CC5833' : '#F2F0E9' }}
                >
                  {stat.value}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* ── Bottom links ── */}
          <div className="mt-12 flex items-center gap-6 relative z-20">
            <Link to="/privacy" className="text-[10px] font-mono uppercase tracking-wide text-cream/40 hover:text-clay transition-colors">
              Privacidad &amp; Aviso Legal
            </Link>
            <div className="w-px h-3 bg-white/10" />
            <Link to="/auth" className="text-[10px] font-mono uppercase tracking-wide text-cream/40 hover:text-clay transition-colors">
              Terminal de Operador B2B
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
