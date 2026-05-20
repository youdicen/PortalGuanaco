import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Lock, ShieldCheck, Zap, Globe, Clock, Users,
  CheckCircle2, ArrowRight, Shield, Fingerprint,
  BarChart3, Network
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ── Micro-UI 1: Encriptación en vivo ────────────────────────────────────────
const MicroPrivacy: React.FC = () => {
  const [text, setText] = useState('+503 7555 5555');
  const [phase, setPhase] = useState<'idle' | 'encrypting' | 'done'>('idle');

  const handleClick = () => {
    if (phase !== 'idle') return;
    setPhase('encrypting');
    const chars = '0123456789ABCDEF*#@!';
    let iter = 0;
    const original = '+503 7555 5555';
    const masked   = '+503 **** ****';
    const iv = setInterval(() => {
      setText(original.split('').map((ch, i) => {
        if (ch === ' ' || ch === '+' || ch === '-') return ch;
        if (i < iter) return masked[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      iter += 0.6;
      if (iter >= original.length) {
        clearInterval(iv);
        setText(masked);
        setPhase('done');
        setTimeout(() => { setText(original); setPhase('idle'); }, 2200);
      }
    }, 45);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream/30 mb-1">
        Demostración en vivo — clic para cifrar
      </div>
      <button
        onClick={handleClick}
        className={`w-full rounded-2xl border px-5 py-4 text-center font-mono text-xl tracking-widest transition-all duration-300
          ${phase === 'done'
            ? 'bg-moss/20 border-moss/40 text-moss'
            : phase === 'encrypting'
            ? 'bg-clay/10 border-clay/30 text-clay animate-pulse'
            : 'bg-carbon/60 border-white/10 text-cream hover:border-clay/30 hover:bg-clay/5'
          }`}
      >
        {text}
      </button>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] text-cream/20 uppercase tracking-widest">
          {phase === 'idle' ? 'Número visible para ti' : phase === 'encrypting' ? 'Cifrando...' : 'Protegido ✓'}
        </span>
        <span className="font-mono text-[9px] text-clay/60 uppercase tracking-widest">AES-256</span>
      </div>
    </div>
  );
};

// ── Micro-UI 2: Terminal de validación ───────────────────────────────────────
const MicroTerminal: React.FC = () => {
  const [lines, setLines] = useState<{ text: string; type: string }[]>([]);
  useEffect(() => {
    const sequence = [
      { text: 'INICIANDO CONSULTA...', type: 'neutral' },
      { text: 'CRUZANDO BASE COLABORATIVA...', type: 'neutral' },
      { text: 'REGISTROS ENCONTRADOS: 4', type: 'neutral' },
      { text: 'INCIDENCIAS: FRAUDE × 3', type: 'danger' },
      { text: 'FIRMA DE RIESGO: ★★★★★', type: 'danger' },
      { text: 'ALERTA: NO DESPACHAR', type: 'danger' },
    ];
    let i = 0;
    const iv = setInterval(() => {
      if (i < sequence.length) {
        const item = sequence[i]; // ← snapshot antes de i++
        i++;
        setLines(p => [...p.slice(-4), item]);
      } else {
        i = 0;
        setLines([]);
      }
    }, 750);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="bg-black/40 rounded-2xl border border-white/5 p-4 h-40 flex flex-col justify-end overflow-hidden">
      <div className="font-mono text-[9px] text-cream/20 uppercase tracking-widest mb-2">
        PortalGuanaco › Terminal de Consulta
      </div>
      {lines.filter(Boolean).map((l, i) => (
        <div key={i} className={`font-mono text-xs mb-1 ${
          l.type === 'danger' ? 'text-red-400 font-bold' :
          i === lines.length - 1 ? 'text-clay' : 'text-cream/40'
        }`}>
          {'>'} {l.text}
        </div>
      ))}
      <div className="w-1.5 h-3 bg-clay mt-1 animate-pulse shadow-[0_0_8px_#CC5833]" />
    </div>
  );
};

// ── Micro-UI 3: Métricas de velocidad ───────────────────────────────────────
const MicroSpeed: React.FC = () => {
  const [active, setActive] = useState(false);
  return (
    <div
      className="flex flex-col gap-3 cursor-pointer"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream/30 mb-1">
        Latencia del sistema — hover
      </div>
      {[
        { label: 'Búsqueda en BD', val: '12ms', pct: '92%' },
        { label: 'Cross-check colaborativo', val: '38ms', pct: '74%' },
        { label: 'Render de resultados', val: '8ms', pct: '97%' },
      ].map((m) => (
        <div key={m.label} className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[9px] text-cream/30 uppercase tracking-widest">{m.label}</span>
            <span className="font-mono text-xs text-clay font-bold">{m.val}</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-0.5 overflow-hidden">
            <div
              className="h-full bg-clay rounded-full shadow-[0_0_8px_#CC5833] transition-all duration-1000 ease-out"
              style={{ width: active ? m.pct : '0%' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Data ─────────────────────────────────────────────────────────────────────
const PILLARS = [
  {
    id: 'privacidad',
    Icon: Lock,
    label: 'Pilar 01',
    title: 'Privacidad Total',
    headline: 'Tu inteligencia comercial nunca se vuelve pública.',
    body: 'Operamos en red cerrada. Solo miembros verificados con token activo acceden al detalle completo de cada reporte. Tu historial de consultas es tuyo, y ningún tercero puede rastrear tu actividad.',
    points: [
      'Red cerrada de operadores verificados',
      'Tokens de sesión con expiración automática',
      'Sin indexación pública de reportes',
      'Cifrado AES-256 en dato en reposo',
    ],
    Micro: MicroPrivacy,
    accent: 'from-clay/5 to-transparent',
    tag: '#PRIVACIDAD',
  },
  {
    id: 'validacion',
    Icon: ShieldCheck,
    label: 'Pilar 02',
    title: 'Validación Real',
    headline: 'Identifica fraude antes de despachar.',
    body: 'En segundos cruzas un número contra la base colaborativa de operadores. Fraude, devoluciones constantes, cancelaciones repetidas — todo queda etiquetado con categoría y firma de riesgo de 1 a 5 estrellas.',
    points: [
      'Cruce automático contra base colaborativa',
      'Etiquetas por categoría de incidencia',
      'Firma de riesgo de 1 a 5 estrellas',
      'Historial de reportes permanente',
    ],
    Micro: MicroTerminal,
    accent: 'from-red-900/10 to-transparent',
    tag: '#VALIDACIÓN',
  },
  {
    id: 'velocidad',
    Icon: Zap,
    label: 'Pilar 03',
    title: 'Decisión Ágil',
    headline: 'Resultados en menos de 0.1 segundos.',
    body: 'Diseñado para vendedores que gestionan decenas de órdenes por día. Búsqueda por número exacto, interfaz mobile-first, sin instalación ni configuración técnica. Solo abrir y consultar.',
    points: [
      'Interfaz optimizada para mobile',
      'Búsqueda por número exacto en tiempo real',
      'Sin instalación ni setup técnico',
      'Disponible 24/7 desde cualquier dispositivo',
    ],
    Micro: MicroSpeed,
    accent: 'from-moss/5 to-transparent',
    tag: '#VELOCIDAD',
  },
];

const GRID_EXTRAS = [
  { Icon: Globe,        title: 'Multi-País',               body: 'El Salvador, Guatemala, Honduras, EE.UU. La red crece con la comunidad.' },
  { Icon: Clock,        title: 'Historial Permanente',      body: 'Los reportes no desaparecen. El historial queda archivado en tu perfil.' },
  { Icon: Users,        title: 'Red Colaborativa',          body: 'Cada reporte publicado fortalece la seguridad de todos los operadores.' },
  { Icon: CheckCircle2, title: 'Identidad Verificada',      body: 'Solo correos verificados pueden publicar. Sin anonimato malicioso.' },
  { Icon: BarChart3,    title: 'Estadísticas por Perfil',   body: 'Visualiza cuántos reportes tienes, en qué categorías y tu ratio de validación.' },
  { Icon: Network,      title: 'API Abierta (próximo)',     body: 'Integra PortalGuanaco en tu sistema de gestión de pedidos directamente.' },
  { Icon: Fingerprint,  title: 'Auditoría de Acceso',       body: 'Cada consulta queda registrada. Transparencia total en el uso de la plataforma.' },
  { Icon: Shield,       title: 'Sin Comisión',              body: 'Acceso completo sin retención sobre tus ventas ni comisión por consulta.' },
];

// ── Main Component ────────────────────────────────────────────────────────────
export const PageFeatures: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo('.pf-hero-tag', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 });
      gsap.fromTo('.pf-hero-h1',  { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out', delay: 0.25 });
      gsap.fromTo('.pf-hero-sub', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.45 });
      gsap.fromTo('.pf-hero-stats', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.6 });

      // Pillar cards
      gsap.utils.toArray<HTMLElement>('.pf-pillar').forEach((el, i) => {
        gsap.fromTo(el,
          { y: 70, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 80%' }, delay: i * 0.05 }
        );
      });

      // Grid extras
      gsap.fromTo('.pf-extra',
        { y: 40, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out',
          scrollTrigger: { trigger: '.pf-extras-grid', start: 'top 82%' } }
      );

      // CTA
      gsap.fromTo('.pf-cta',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.pf-cta', start: 'top 88%' } }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-carbon overflow-x-hidden">

      {/* ── Noise texture ── */}
      <svg className="noise-overlay" aria-hidden="true">
        <filter id="noise-feat">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-feat)" />
      </svg>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-28 px-6">
        {/* Background glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(204,88,51,0.08) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="pf-hero-tag inline-flex items-center gap-2 bg-clay/10 border border-clay/20 rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-clay">Capacidades del Sistema</span>
          </div>

          <h1 className="pf-hero-h1 font-sans font-bold text-5xl sm:text-6xl md:text-7xl text-cream leading-[1.04] tracking-tight mb-6">
            Todo lo que necesitas<br />
            para{' '}
            <em className="font-serif font-light italic text-clay not-italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              vender con confianza.
            </em>
          </h1>

          <p className="pf-hero-sub font-sans text-cream/55 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Construido específicamente para emprendedores que venden en línea, gestionan entregas y necesitan protección contra fraude — sin complicaciones técnicas.
          </p>

          {/* Stats row */}
          <div className="mt-14 flex flex-wrap justify-center gap-6 md:gap-12">
            {[
              { val: '< 0.1s', label: 'Tiempo de consulta' },
              { val: '99.8%', label: 'Precisión de validación' },
              { val: '4 países', label: 'Cobertura de red' },
              { val: '24/7', label: 'Disponibilidad' },
            ].map(s => (
              <div key={s.label} className="pf-hero-stats flex flex-col items-center gap-1">
                <span className="font-mono text-2xl md:text-3xl font-bold text-cream">{s.val}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-cream/35">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tres Pilares ─────────────────────────────────────────────────── */}
      <section className="px-6 pb-28 max-w-6xl mx-auto flex flex-col gap-6">
        {PILLARS.map((p, idx) => {
          const MicroUI = p.Micro;
          const isEven = idx % 2 === 0;
          return (
            <div
              key={p.id}
              className={`pf-pillar relative group bg-[#111111]/80 border border-white/5 rounded-[2.5rem] overflow-hidden
                hover:border-white/10 transition-all duration-500`}
            >
              {/* Accent glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-60 pointer-events-none`} />

              <div className={`relative z-10 grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[420px]`}>

                {/* Content side */}
                <div className={`flex flex-col justify-between p-10 md:p-12 ${!isEven ? 'md:order-2' : ''}`}>
                  {/* Top meta */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-cream/25">{p.label}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-clay/50 border border-clay/20 rounded-full px-3 py-1">{p.tag}</span>
                  </div>

                  {/* Icon + Title */}
                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-clay/10 border border-clay/20 flex items-center justify-center group-hover:bg-clay/20 transition-colors">
                        <p.Icon className="w-6 h-6 text-clay" />
                      </div>
                      <h2 className="font-sans font-bold text-2xl md:text-3xl text-cream">{p.title}</h2>
                    </div>
                    <p
                      className="font-serif italic text-cream/70 text-xl md:text-2xl leading-tight mb-5"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {p.headline}
                    </p>
                    <p className="font-sans text-sm text-cream/45 leading-relaxed">{p.body}</p>
                  </div>

                  {/* Points */}
                  <ul className="flex flex-col gap-2.5">
                    {p.points.map(pt => (
                      <li key={pt} className="flex items-center gap-3">
                        <div className="w-1 h-1 rounded-full bg-clay shrink-0" />
                        <span className="font-mono text-[10px] text-cream/35 uppercase tracking-widest">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Micro-UI side */}
                <div className={`flex items-center justify-center bg-white/[0.015] border-white/5
                  ${!isEven ? 'md:border-r md:order-1' : 'md:border-l'} border-t md:border-t-0 p-8 md:p-12`}>
                  <div className="w-full max-w-sm">
                    <MicroUI />
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </section>

      {/* ── Divisor ── */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-white/5" />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-cream/25">Más capacidades</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>
      </div>

      {/* ── Grid de extras ────────────────────────────────────────────────── */}
      <section className="pf-extras-grid px-6 pb-28 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {GRID_EXTRAS.map(e => (
          <div
            key={e.title}
            className="pf-extra group flex flex-col gap-4 bg-[#111111] border border-white/5 rounded-3xl p-7
              hover:border-clay/20 hover:bg-clay/[0.03] transition-all duration-400 cursor-default"
          >
            <div className="w-10 h-10 rounded-2xl bg-carbon border border-white/8 flex items-center justify-center group-hover:border-clay/25 transition-colors">
              <e.Icon className="w-5 h-5 text-clay/70 group-hover:text-clay transition-colors" />
            </div>
            <div>
              <h4 className="font-sans font-semibold text-cream text-base mb-2">{e.title}</h4>
              <p className="font-sans text-xs text-cream/40 leading-relaxed">{e.body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── CTA final ─────────────────────────────────────────────────────── */}
      <section className="pf-cta px-6 pb-28 max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-clay/15 bg-clay/5 p-14 text-center">
          {/* Glow center */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(204,88,51,0.12) 0%, transparent 65%)' }}
          />
          <div className="relative z-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-clay/60 mb-5">Comienza ahora</div>
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-cream mb-4">
              Protege cada venta.<br />
              <em className="font-serif font-light italic text-clay" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Hoy mismo.
              </em>
            </h2>
            <p className="font-sans text-cream/45 text-base max-w-md mx-auto mb-10 leading-relaxed">
              Sin tarjeta de crédito. Sin contrato. Solo verificación de correo electrónico y acceso inmediato a la red.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/auth')}
                className="magnetic-button bg-clay text-cream px-8 py-4 rounded-2xl font-sans font-semibold text-sm flex items-center gap-2 shadow-lg shadow-clay/20 hover:shadow-clay/40 transition-shadow"
              >
                Crear cuenta gratis
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/protocolo')}
                className="magnetic-button border border-white/10 text-cream/60 px-8 py-4 rounded-2xl font-sans text-sm flex items-center gap-2 hover:border-white/20 hover:text-cream transition-all"
              >
                Ver cómo funciona
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
