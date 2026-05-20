import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, FileText, ShieldCheck, Zap, ArrowRight, Database, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Ingresa el número',
    description: 'Escribe el número de teléfono del cliente en el módulo de consulta. El sistema acepta prefijos internacionales de El Salvador, Guatemala, Honduras y Estados Unidos.',
    detail: 'La búsqueda es instantánea: el motor indexa por número exacto y por similitud fonética para capturar variantes con espacios o guiones.',
    color: 'text-clay',
    border: 'border-clay/20',
    bg: 'bg-clay/5',
  },
  {
    number: '02',
    icon: Database,
    title: 'Consulta la red',
    description: 'El sistema cruza el número contra la base de datos colaborativa de PortalGuanaco, alimentada por operadores verificados de toda la región.',
    detail: 'Solo los reportes de miembros con identidad validada impactan el índice de reputación. El spam y las cuentas anónimas son descartados automáticamente.',
    color: 'text-moss',
    border: 'border-moss/20',
    bg: 'bg-moss/5',
  },
  {
    number: '03',
    icon: Activity,
    title: 'Analiza la firma de riesgo',
    description: 'Recibes un índice de reputación de 1 a 5 estrellas, las etiquetas de incidencia reportadas y la fecha del primer reporte registrado.',
    detail: 'El puntaje es el promedio ponderado de todos los reportes activos (no ocultos). Un número sin reportes muestra "Sin incidencias" — no asumimos culpabilidad.',
    color: 'text-amber-400',
    border: 'border-amber-400/20',
    bg: 'bg-amber-400/5',
  },
  {
    number: '04',
    icon: ShieldCheck,
    title: 'Decide con datos',
    description: 'Con la firma de riesgo en mano, toma tu decisión comercial: confirmar el despacho, solicitar pago anticipado o rechazar la orden.',
    detail: 'Cada consulta queda en tu historial de sesión. Puedes reportar el número en ese mismo momento si encuentras una nueva incidencia.',
    color: 'text-green-400',
    border: 'border-green-400/20',
    bg: 'bg-green-400/5',
  },
];

const tags = [
  { label: 'Falso', cat: 'red' },
  { label: 'No paga', cat: 'red' },
  { label: 'No responde', cat: 'red' },
  { label: 'Devolución constante', cat: 'yellow' },
  { label: 'Cancelación tardía', cat: 'yellow' },
  { label: 'Regateo agresivo', cat: 'yellow' },
  { label: 'Dirección incorrecta', cat: 'yellow' },
  { label: 'Mal trato', cat: 'yellow' },
  { label: 'Pedido completado', cat: 'green' },
];

const tagClass: Record<string, string> = {
  red: 'bg-red-500/10 text-red-300 border border-red-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20',
  green: 'bg-green-500/10 text-green-300 border border-green-500/20',
};

export const PageProtocol: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo('.proto-hero-text',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.15, ease: 'power3.out', delay: 0.1 }
      );
      gsap.fromTo('.proto-step',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.proto-steps-grid', start: 'top 75%' }
        }
      );
      gsap.fromTo('.proto-tag',
        { scale: 0.8, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: '.proto-tags', start: 'top 80%' }
        }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen pt-32 pb-24 px-6 max-w-6xl mx-auto">

      {/* ── Hero ── */}
      <div className="mb-24 text-center">
        <div className="proto-hero-text font-mono text-xs uppercase tracking-[0.3em] text-clay mb-6">Sistema de Consulta</div>
        <h1 className="proto-hero-text font-sans font-bold text-5xl md:text-7xl text-cream tracking-tight leading-[1.05] mb-8">
          El Protocolo<br />
          <span className="font-serif italic font-light text-clay">Guanaco.</span>
        </h1>
        <p className="proto-hero-text font-sans text-cream/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Un flujo de cuatro pasos diseñado para que conozcas el historial de cualquier número antes de confirmar una venta.
        </p>
        <div className="proto-hero-text flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => navigate('/#protocol')}
            className="magnetic-button bg-clay text-cream px-8 py-4 rounded-2xl font-sans font-medium text-sm flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Consultar ahora
          </button>
          <button
            onClick={() => navigate('/submit')}
            className="px-8 py-4 rounded-2xl font-sans font-medium text-sm text-cream/50 border border-white/10 hover:border-white/30 hover:text-cream transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Reportar número
          </button>
        </div>
      </div>

      {/* ── Steps ── */}
      <div className="proto-steps-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className={`proto-step bg-[#111111] border ${step.border} rounded-3xl p-8 flex flex-col gap-6 hover:scale-[1.01] transition-transform`}>
              <div className="flex items-start gap-5">
                <div className={`shrink-0 w-12 h-12 rounded-2xl ${step.bg} ${step.border} border flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <div>
                  <div className={`font-mono text-[10px] uppercase tracking-widest ${step.color} mb-1`}>Paso {step.number}</div>
                  <h3 className="font-sans font-bold text-xl text-cream">{step.title}</h3>
                </div>
              </div>
              <p className="font-sans text-cream/60 leading-relaxed">{step.description}</p>
              <div className={`p-4 rounded-2xl ${step.bg} border ${step.border}`}>
                <p className="font-mono text-[10px] text-cream/40 uppercase tracking-widest leading-relaxed">{step.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Etiquetas ── */}
      <div className="bg-[#111111] border border-white/5 rounded-3xl p-10 mb-24">
        <div className="mb-8 text-center">
          <div className="font-mono text-[10px] uppercase tracking-widest text-clay mb-3">Sistema de Clasificación</div>
          <h2 className="font-sans font-bold text-3xl text-cream">Etiquetas de Comportamiento</h2>
          <p className="font-sans text-cream/40 mt-3 text-sm max-w-lg mx-auto">
            Cada reporte puede incluir una o varias etiquetas. El sistema las agrupa para construir el perfil de incidencias.
          </p>
        </div>
        <div className="proto-tags flex flex-wrap gap-3 justify-center">
          {tags.map((t) => (
            <span key={t.label} className={`proto-tag font-mono text-xs px-4 py-2 rounded-full uppercase tracking-wider ${tagClass[t.cat]}`}>
              {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="text-center bg-clay/5 border border-clay/10 rounded-3xl p-12">
        <Zap className="w-10 h-10 text-clay mx-auto mb-6" />
        <h2 className="font-sans font-bold text-3xl text-cream mb-4">¿Listo para proteger tu negocio?</h2>
        <p className="font-sans text-cream/50 mb-8 max-w-md mx-auto">
          Crea tu cuenta gratis y empieza a consultar el historial de tus clientes antes de cada despacho.
        </p>
        <button
          onClick={() => navigate('/auth')}
          className="magnetic-button bg-clay text-cream px-10 py-4 rounded-2xl font-sans font-medium flex items-center gap-2 mx-auto"
        >
          Acceder ahora
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
