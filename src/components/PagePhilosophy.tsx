import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Heart, Eye, Users, Shield, TrendingUp, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    icon: Heart,
    title: 'Emprendedor Primero',
    description: 'Diseñamos cada decisión pensando en el vendedor salvadoreño de a pie — el que vende por Facebook, entrega en moto y no tiene equipo de riesgo. Tú eres el centro.',
  },
  {
    icon: Eye,
    title: 'Transparencia sin Exposición',
    description: 'La información existe para protegerte, no para exponer a nadie. Por eso los reportes son anónimos para el público, verificados para la red y nunca monetizados.',
  },
  {
    icon: Users,
    title: 'Red, no Producto',
    description: 'PortalGuanaco solo funciona si todos contribuyen. Cada reporte que das protege a otro emprendedor que aún no conoces. La red crece con tu colaboración.',
  },
  {
    icon: Shield,
    title: 'Confianza Cero por Default',
    description: 'Ningún número entra a la red como "bueno". El historial limpio es el punto de partida, no la excepción. Desconfianza sistemática, no personal.',
  },
  {
    icon: TrendingUp,
    title: 'Datos que Evolucionan',
    description: 'Un cliente problemático puede cambiar. Un reporte del pasado no condena para siempre. El sistema refleja patrones, no sentencias.',
  },
  {
    icon: Sparkles,
    title: 'Tecnología al Servicio',
    description: 'Sidere AI procesa los datos, pero el criterio final siempre es tuyo. La plataforma entrega señales; tú tomas la decisión. Herramienta, no juez.',
  },
];

const timeline = [
  { year: '2024', event: 'Problema identificado', desc: 'Los fraudes en ventas online en El Salvador alcanzaron un punto crítico. Sin ninguna plataforma centralizada de reporte.' },
  { year: '2025', event: 'Primeros prototipos', desc: 'MVP desarrollado con un grupo cerrado de vendedores locales para validar el modelo colaborativo de reputación.' },
  { year: '2026', event: 'Lanzamiento público', desc: 'PortalGuanaco abre a todos los emprendedores de la región con soporte para SV, GT, HN y US.' },
  { year: 'HOY', event: 'Red en expansión', desc: 'Cientos de reportes activos. La base de datos crece orgánicamente con cada nuevo miembro verificado.' },
];

export const PagePhilosophy: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo('.phi-hero',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.15, ease: 'power3.out', delay: 0.1 }
      );
      gsap.fromTo('.phi-pillar',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.phi-pillars', start: 'top 75%' } }
      );
      gsap.fromTo('.phi-timeline-item',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.phi-timeline', start: 'top 80%' } }
      );
      gsap.fromTo('.phi-contrast',
        { scale: 0.96, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: '.phi-contrast', start: 'top 80%' } }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen pt-32 pb-24">

      {/* ── Hero ── */}
      <div className="px-6 max-w-6xl mx-auto mb-24">
        <div className="phi-hero font-mono text-xs uppercase tracking-[0.3em] text-clay mb-6">La Filosofía Sidere</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="phi-hero font-sans font-bold text-5xl md:text-7xl text-cream tracking-tight leading-[1.05] mb-8">
              No somos un directorio.<br />
              Somos un{' '}
              <span className="font-serif italic font-light text-clay">escudo.</span>
            </h1>
            <p className="phi-hero font-sans text-cream/60 text-lg leading-relaxed mb-6">
              Las plataformas tradicionales exponen datos sin control. En PortalGuanaco, transformamos la prevención de fraude bajo una arquitectura de confianza donde la información solo fluye hacia el emprendedor honesto.
            </p>
            <div className="phi-hero flex flex-col gap-3">
              {[
                'Privacidad asimétrica: tú ves las advertencias, los atacantes no ven tu base de datos.',
                'Validación cruzada de reportes para evitar difamaciones o usos maliciosos.',
                'Sin publicidad, sin venta de datos, sin modelos de monetización opaca.',
              ].map((pt, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-clay mt-2 shrink-0" />
                  <p className="font-mono text-xs text-cream/50 uppercase tracking-widest leading-relaxed">{pt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contrast Card */}
          <div className="phi-contrast bg-[#111111] border border-white/5 rounded-[2.5rem] p-10 flex flex-col gap-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-400">La industria genérica</span>
              </div>
              <p className="font-sans text-sm text-cream/40 leading-relaxed">
                Bases de datos públicas propensas a extracción masiva, falta de verificación de integridad y modelos de negocio basados en la monetización de tus contactos y comportamientos.
              </p>
            </div>
            <div className="w-full h-px bg-white/5" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-clay animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-clay">Arquitectura PortalGuanaco</span>
              </div>
              <p className="font-sans text-cream leading-relaxed font-medium">
                Inteligencia de riesgo protegida por <span className="text-clay">Sidere AI</span>. Red colaborativa de confianza donde la información solo fluye hacia el emprendedor honesto que la merece.
              </p>
              <div className="mt-2 bg-carbon/50 rounded-xl p-4 border border-white/5 flex items-center justify-between">
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => <div key={i} className="w-8 h-1 bg-clay/30 rounded-full" />)}
                </div>
                <span className="font-mono text-[9px] text-clay tracking-widest">PROTOCOLO ACTIVO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pilares ── */}
      <div className="bg-carbon py-24 px-6 mb-0 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-clay mb-4">Los 6 Pilares</div>
            <h2 className="font-sans font-bold text-4xl text-cream">Lo que guía cada decisión.</h2>
          </div>
          <div className="phi-pillars grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="phi-pillar bg-[#111111]/60 border border-white/5 rounded-3xl p-7 flex flex-col gap-4 hover:border-clay/20 hover:bg-clay/5 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-carbon border border-white/5 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-clay" />
                  </div>
                  <h3 className="font-sans font-bold text-cream text-lg">{p.title}</h3>
                  <p className="font-sans text-sm text-cream/50 leading-relaxed">{p.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="px-6 max-w-6xl mx-auto py-24">
        <div className="text-center mb-16">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-clay mb-4">Historia</div>
          <h2 className="font-sans font-bold text-4xl text-cream">De la idea al instrumento.</h2>
        </div>
        <div className="phi-timeline flex flex-col gap-0 max-w-2xl mx-auto">
          {timeline.map((t, i) => (
            <div key={t.year} className="phi-timeline-item flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-clay/10 border border-clay/30 flex items-center justify-center shrink-0">
                  <span className="font-mono text-[9px] text-clay font-bold">{t.year}</span>
                </div>
                {i < timeline.length - 1 && <div className="w-px flex-1 bg-white/5 my-2" />}
              </div>
              <div className="pb-10">
                <h4 className="font-sans font-bold text-cream text-lg mb-2">{t.event}</h4>
                <p className="font-sans text-sm text-cream/50 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="px-6 max-w-6xl mx-auto">
        <div className="text-center bg-clay/5 border border-clay/10 rounded-3xl p-12">
          <h2 className="font-sans font-bold text-3xl text-cream mb-4">Únete al escudo.</h2>
          <p className="font-sans text-cream/50 mb-8 max-w-md mx-auto">
            Cada operador que se une hace la red más fuerte para todos. Regístrate y empieza a reportar hoy.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="magnetic-button bg-clay text-cream px-10 py-4 rounded-2xl font-sans font-medium flex items-center gap-2 mx-auto"
          >
            Unirme a la red
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
