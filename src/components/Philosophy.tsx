import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Philosophy: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.philosophy-text',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );
      gsap.fromTo('.philosophy-card',
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: '.philosophy-card', start: 'top 80%' } }
      );
      gsap.to(orb1Ref.current, { y: -100, scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.to(orb2Ref.current, { y: 100, scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="py-32 relative w-full overflow-hidden mt-0 bg-transparent"
    >
      {/* ── Cinematic Background Orbs ── */}
      <div
        ref={orb1Ref}
        className="absolute z-0 blur-[120px] opacity-20 pointer-events-none"
        style={{ width: '40vw', height: '40vw', top: '10%', right: '-10%', background: 'radial-gradient(circle, #CC5833 0%, transparent 70%)' }}
      />
      <div
        ref={orb2Ref}
        className="absolute z-0 blur-[100px] opacity-15 pointer-events-none"
        style={{ width: '35vw', height: '35vw', bottom: '10%', left: '-5%', background: 'radial-gradient(circle, #2E4036 0%, transparent 70%)' }}
      />
      {/* ── Noise ── */}
      <div className="absolute inset-0 z-0 opacity-[0.025] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Left: La Visión */ }
        <div className="flex flex-col gap-6">
          <span className="philosophy-text font-mono text-[10px] uppercase tracking-[0.25em] text-[#CC5833]">§ La Filosofía Sidere</span>
          <h2 className="philosophy-text font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-cream tracking-tight leading-tight">
            No somos una base <br />
            de datos. Somos una{' '}
            <span className="font-serif italic font-light text-[#CC5833]">red viva.</span>
          </h2>
          <div className="philosophy-text w-12 h-px bg-white/15 my-2" />
          <p className="philosophy-text font-sans text-cream/65 leading-relaxed text-base">
            Las plataformas genéricas exponen datos sin control, monetizan tu base de contactos y dejan al fraude
            evolucionar más rápido que sus defensas. En <span className="text-cream font-bold">PortalGuanaco</span>,
            cada decisión técnica está orientada a un principio único: la inteligencia debe fluir
            hacia el emprendedor honesto, nunca hacia el defraudador.
          </p>
          <div className="philosophy-text flex flex-col gap-4 mt-2">
            {[
              'Privacidad asimétrica: tú ves las advertencias, los atacantes nunca ven tu base de datos.',
              'Validación cruzada de reportes mediante NLP para eliminar difamaciones competitivas.',
              'Cada nuevo operador fortalece el modelo para toda la red — el escudo crece contigo.',
            ].map((point) => (
              <div key={point} className="flex gap-4 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-[#CC5833] mt-2 shrink-0" />
                <p className="font-mono text-xs text-cream/50 uppercase tracking-widest leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Contrast Card */}
        <div className="philosophy-card bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 flex flex-col gap-10 shadow-2xl relative overflow-hidden group">

          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

          {/* Old way */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-red-500">Sistemas Genéricos</span>
            </div>
            <p className="font-sans text-sm text-cream/35 leading-relaxed">
              Bases de datos públicas expuestas a scraping masivo. Sin verificación de integridad.
              Modelos de negocio que monetizan tus contactos. Cero diferenciación entre emprendedor honesto
              y defraudador recurrente.
            </p>
          </div>

          <div className="w-full h-px bg-white/5" />

          {/* PortalGuanaco way */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#CC5833] animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#CC5833]">Arquitectura PortalGuanaco</span>
            </div>
            <p className="font-sans text-base text-cream leading-relaxed font-medium">
              Inteligencia de riesgo protegida por{' '}
              <span className="text-[#CC5833] font-bold">Sidere AI</span>. Red colaborativa de confianza donde
              la información fluye con propósito: empoderar al negocio honesto y detener al defraudador
              <span className="font-serif italic"> antes del primer envío.</span>
            </p>

            {/* Status mini-UI */}
            <div className="mt-2 bg-[#0e0e0e]/60 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-8 h-1 bg-[#CC5833]/30 rounded-full" style={{ opacity: 0.3 + i * 0.3 }} />
                ))}
              </div>
              <span className="font-mono text-[9px] text-[#CC5833] tracking-widest">PROTOCOLO ACTIVO</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
