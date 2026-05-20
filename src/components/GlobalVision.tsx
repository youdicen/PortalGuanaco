import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, Network, Zap, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const expansionNodes = [
  { country: 'El Salvador', status: 'ACTIVO', flag: '🇸🇻', users: '2,847', color: '#CC5833' },
  { country: 'Guatemala', status: 'Q3 2026', flag: '🇬🇹', users: '—', color: '#F2F0E9' },
  { country: 'Honduras', status: 'Q3 2026', flag: '🇭🇳', users: '—', color: '#F2F0E9' },
  { country: 'Costa Rica', status: 'Q4 2026', flag: '🇨🇷', users: '—', color: '#F2F0E9' },
  { country: 'México', status: 'Q1 2027', flag: '🇲🇽', users: '—', color: '#F2F0E9' },
];

const techStack = [
  { layer: 'Frontend', tech: 'Next.js 14 · React 19', detail: 'SSR + Edge Functions', metric: '<50ms TTFB' },
  { layer: 'Backend', tech: 'Supabase · PostgreSQL', detail: 'Row Level Security · pgvector', metric: '99.99% Uptime' },
  { layer: 'AI Layer', tech: 'Sidere AI Engine', detail: 'Probabilistic NLP · Trust Scoring', metric: '98.7% Precision' },
  { layer: 'API Gateway', tech: 'REST + Webhooks', detail: 'Rate-limited · JWT Auth', metric: '<0.1s Latency' },
];

export const GlobalVision: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.vision-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );
      gsap.fromTo('.vision-node',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.vision-node', start: 'top 80%' } }
      );
      gsap.fromTo('.tech-row',
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.tech-row', start: 'top 80%' } }
      );
      gsap.fromTo('.vision-cta',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '.vision-cta', start: 'top 85%' } }
      );
      // Parallax orbs
      gsap.to(orb1Ref.current, {
        y: -120, scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
      gsap.to(orb2Ref.current, {
        y: 100, scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
      });
      // Pulsing active node
      gsap.to('.node-active-pulse', { scale: 1.15, opacity: 0.6, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="global-vision"
      className="relative py-32 w-full overflow-hidden bg-transparent"
    >
      {/* ── Orbs parallax ── */}
      <div ref={orb1Ref} className="absolute z-0 blur-[130px] opacity-15 pointer-events-none"
        style={{ width: '45vw', height: '45vw', top: '5%', right: '-10%', background: 'radial-gradient(circle, #2E4036 0%, transparent 70%)' }}
      />
      <div ref={orb2Ref} className="absolute z-0 blur-[110px] opacity-10 pointer-events-none"
        style={{ width: '40vw', height: '40vw', bottom: '5%', left: '-8%', background: 'radial-gradient(circle, #CC5833 0%, transparent 70%)' }}
      />

      {/* ── Top accent ── */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* ── Header ── */}
        <div className="vision-header mb-20 max-w-3xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#CC5833] mb-4 block">
            § 04 · Visión Global &amp; Escalabilidad
          </span>
          <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-cream tracking-tight leading-[1.05] mb-6">
            Construido en El Salvador.{' '}
            <span className="font-serif italic font-light text-[#CC5833]">Escalando a Latinoamérica.</span>
          </h2>
          <p className="font-sans text-base text-cream/55 leading-relaxed max-w-2xl">
            La red colaborativa de PortalGuanaco opera sobre una arquitectura cloud-native optimizada para
            baja latencia y expansión geográfica inmediata. El modelo de red se fortalece con cada nuevo nodo:
            más usuarios = más inteligencia = mayor protección para todos.
          </p>
        </div>

        {/* ── Network Expansion Grid ── */}
        <div className="mb-20">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40 mb-6 flex items-center gap-2">
            <Network className="w-3 h-3" /> Expansión de Red · Roadmap 2026–2027
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {expansionNodes.map((node) => (
              <div
                key={node.country}
                className={`vision-node group relative bg-[#0f0f0f]/70 border rounded-[1.8rem] p-5 flex flex-col gap-3 transition-all duration-400 overflow-hidden
                  ${node.status === 'ACTIVO' ? 'border-[#CC5833]/40 hover:border-[#CC5833]/70' : 'border-white/5 hover:border-white/15'}`}
              >
                {node.status === 'ACTIVO' && (
                  <div className="node-active-pulse absolute top-3 right-3 w-2 h-2 rounded-full bg-[#CC5833]" />
                )}
                <span className="text-3xl">{node.flag}</span>
                <div>
                  <p className="font-sans font-bold text-sm text-cream">{node.country}</p>
                  <p className="font-mono text-[9px] uppercase tracking-widest mt-0.5"
                    style={{ color: node.status === 'ACTIVO' ? '#CC5833' : 'rgba(242,240,233,0.3)' }}>
                    {node.status}
                  </p>
                </div>
                {node.users !== '—' && (
                  <p className="font-mono text-xs text-cream/40">{node.users} operadores</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Tech Stack Architecture ── */}
        <div className="mb-20">
          <div className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-8 md:p-12">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#CC5833] mb-8 flex items-center gap-2">
              <Zap className="w-3 h-3" /> Stack Tecnológico · Arquitectura de Producción
            </h3>
            <div className="flex flex-col gap-0 divide-y divide-white/5">
              {techStack.map((row) => (
                <div key={row.layer} className="tech-row grid grid-cols-2 md:grid-cols-4 gap-4 py-5 items-center hover:bg-white/[0.02] transition-colors rounded-xl px-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#CC5833]">{row.layer}</span>
                  <span className="font-sans font-bold text-sm text-cream">{row.tech}</span>
                  <span className="font-sans text-xs text-cream/45 hidden md:block">{row.detail}</span>
                  <span className="font-mono text-xs text-cream font-bold text-right">{row.metric}</span>
                </div>
              ))}
            </div>

            {/* Network effect callout */}
            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#CC5833]" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#CC5833]">Efecto de Red</span>
              </div>
              <p className="font-sans text-sm text-cream/55 leading-relaxed">
                Cada nuevo operador que reporta enriquece el modelo predictivo para toda la red. La barrera competitiva
                no es el código — es el{' '}
                <span className="font-serif italic text-cream">dataset colaborativo irreplicable</span>{' '}
                que se consolida con cada transacción validada.
              </p>
            </div>
          </div>
        </div>

        {/* ── Closing CTA ── */}
        <div className="vision-cta relative bg-gradient-to-br from-[#CC5833]/15 to-[#2E4036]/10 border border-[#CC5833]/25 rounded-[2.5rem] p-10 md:p-14 overflow-hidden text-center">
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #CC5833 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
          <div className="relative z-10 flex flex-col items-center gap-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#CC5833]">
              Red de Inteligencia Colectiva · B2B SaaS
            </span>
            <h2 className="font-sans font-bold text-3xl md:text-5xl text-cream tracking-tight leading-tight max-w-2xl">
              El Guanaco no espera.{' '}
              <span className="font-serif italic font-light text-[#CC5833]">Protege primero.</span>
            </h2>
            <p className="font-sans text-base text-cream/55 leading-relaxed max-w-xl">
              Únete a la red que está redefiniendo la confianza digital en El Salvador y Centroamérica.
              Cada reporte es un escudo. Cada operador, un nodo de inteligencia colectiva.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <a
                href="/submit"
                id="vision-cta-primary"
                className="group relative inline-flex items-center gap-3 overflow-hidden bg-[#CC5833] text-cream font-sans font-bold text-sm uppercase tracking-widest px-10 py-4 rounded-full transition-transform duration-300 hover:scale-[1.03] shadow-[0_0_50px_rgba(204,88,51,0.35)]"
              >
                <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                <Globe className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Verificar Ahora</span>
              </a>
              <a
                href="mailto:soporte@portalguanaco.com"
                id="vision-cta-api"
                className="group inline-flex items-center gap-3 border border-cream/20 text-cream/70 hover:text-cream font-sans text-sm uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:border-cream/40"
              >
                Acceso API Empresarial
              </a>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream/30 mt-2">
              Impulsado por Sidere AI · Nodo Central: San Salvador, SV
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
