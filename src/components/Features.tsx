import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Zap, Lock, Cpu, Activity, Eye } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ── Micro-UI 1: Privacy Shuffler (Enmascaramiento Criptográfico) ──
const PrivacyShuffler = () => {
  const [text, setText] = useState('+503 7555 ####');
  const [isHovered, setIsHovered] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'encrypting' | 'masked'>('idle');

  useEffect(() => {
    if (!isHovered) {
      setPhase('idle');
      setText('+503 7555 ####');
      return;
    }
    setPhase('encrypting');
    const chars = '0123456789ABCDEF';
    let iterations = 0;
    const original = '+503 7555 1234';
    const interval = window.setInterval(() => {
      setText(
        original.split('').map((char, index) => {
          if (char === ' ' || char === '+') return char;
          if (index < iterations * 0.8) return '█';
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      iterations += 0.4;
      if (iterations >= 14) {
        clearInterval(interval);
        setText('SHA-256: a3f9••••e1c7');
        setPhase('masked');
      }
    }, 45);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div
      className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 h-28 flex flex-col justify-center items-center cursor-crosshair transition-all duration-500 hover:border-[#CC5833]/30 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="font-mono text-base tracking-widest text-[#CC5833] group-hover:text-cream transition-colors break-all text-center">{text}</div>
      <div className="text-[9px] uppercase tracking-[0.2em] text-cream/30 mt-2 font-mono">
        {phase === 'idle' && 'HOVER → ENCRIPTAR IDENTIFICADOR'}
        {phase === 'encrypting' && 'PROCESANDO SHA-256...'}
        {phase === 'masked' && '✓ PRIVACIDAD GARANTIZADA'}
      </div>
      <div className="flex gap-1 mt-2">
        {['bg-[#CC5833]', 'bg-[#CC5833]/60', 'bg-[#CC5833]/30'].map((c, i) => (
          <div key={i} className={`w-6 h-0.5 ${c} rounded-full transition-all duration-300`} style={{ opacity: phase !== 'idle' ? 1 : 0.3 }} />
        ))}
      </div>
    </div>
  );
};

// ── Micro-UI 2: Sidere AI Engine Live Feed ──
const SidereEngineLog = () => {
  const [lines, setLines] = useState<{ text: string; type: 'info' | 'warn' | 'block' }[]>([]);

  useEffect(() => {
    const logs: { text: string; type: 'info' | 'warn' | 'block' }[] = [
      { text: 'INICIANDO MOTOR SIDERE AI v2.4...', type: 'info' },
      { text: 'ANALIZANDO TRUST SCORE DINÁMICO...', type: 'info' },
      { text: 'NLP: PATRÓN DE TEXTO REPETITIVO DETECTADO', type: 'warn' },
      { text: 'FALSO POSITIVO DESCARTADO (98.7% conf.)', type: 'warn' },
      { text: 'MATCH CONFIRMADO · SCORE: 0.91 / 1.0', type: 'block' },
      { text: 'DECISIÓN: ⛔ TRANSACCIÓN BLOQUEADA', type: 'block' },
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        // ✅ FIX: capturar logs[i] ANTES del updater funcional
        // para evitar que React evalúe `i` después del i++ (closure bug)
        const currentLog = logs[i];
        i++;
        setLines(prev => {
          const next = [...prev, currentLog];
          return next.length > 4 ? next.slice(1) : next;
        });
      } else {
        i = 0;
        setLines([]);
      }
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const colorMap = { info: 'text-cream/50', warn: 'text-yellow-400', block: 'text-[#CC5833]' };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 h-28 flex flex-col justify-end overflow-hidden font-mono text-[10px]">
      {lines.map((line, i) => (
        <div key={i} className={`mb-0.5 ${colorMap[line.type]} ${i === lines.length - 1 ? 'font-bold' : 'opacity-70'}`}>
          &gt; {line.text}
        </div>
      ))}
      <div className="w-2 h-3 bg-[#CC5833] animate-pulse mt-1 shadow-[0_0_8px_#CC5833]" />
    </div>
  );
};

// ── Micro-UI 3: Latency Monitor ──
const LatencyMonitor = () => {
  const [value, setValue] = useState(87);
  useEffect(() => {
    const interval = setInterval(() => {
      setValue(70 + Math.floor(Math.random() * 30));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 h-28 flex flex-col justify-center gap-3 group hover:border-[#CC5833]/20 transition-colors">
      <div className="flex justify-between items-center">
        <span className="font-mono text-[9px] text-cream/40 uppercase tracking-widest flex items-center gap-1">
          <Activity className="w-3 h-3" /> Latencia API
        </span>
        <span className="font-mono text-xs text-[#CC5833] font-bold">{value}ms</span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
        <div
          className="h-full rounded-full shadow-[0_0_8px_#CC5833] transition-all duration-700"
          style={{ width: `${(value / 200) * 100}%`, background: '#CC5833' }}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="font-mono text-[9px] text-cream/40 uppercase tracking-widest">Tiempo de consulta</span>
        <span className="font-mono text-xs text-cream font-bold">&lt; 0.1s</span>
      </div>
    </div>
  );
};

const aiEngineFeatures = [
  {
    id: 'trust-score',
    icon: Cpu,
    label: 'Motor Sidere AI · Componente 01',
    title: 'Trust Score Dinámico',
    body: 'Ponderación probabilística de riesgo basada en telemetría de comportamiento, huella digital del dispositivo y factor tiempo con decay exponencial. Cada reporte tiene un peso que decrece si no hay corroboración de la red, eliminando señales obsoletas de forma automática.',
    microUI: <SidereEngineLog />,
  },
  {
    id: 'nlp-detection',
    icon: Eye,
    label: 'Motor Sidere AI · Componente 02',
    title: 'Detección de Falsos Positivos mediante NLP',
    body: 'Inteligencia Artificial que analiza patrones lingüísticos y de frecuencia en los reportes para identificar y bloquear intentos de sabotaje competitivo, difamaciones coordinadas o spam de datos. Solo la inteligencia legítima llega a tu consulta.',
    microUI: <PrivacyShuffler />,
  },
  {
    id: 'privacy-design',
    icon: Lock,
    label: 'Motor Sidere AI · Componente 03',
    title: 'Privacy by Design & Enmascaramiento Criptográfico',
    body: 'Cumplimiento de estándares éticos globales de datos (GDPR, LGPD) mientras entregamos inteligencia comercial exclusiva al emprendedor. Los identificadores son hasheados con SHA-256 antes de ser almacenados: tú ves el riesgo, nunca el dato crudo.',
    microUI: <LatencyMonitor />,
  },
];

const businessCapabilities = [
  { icon: Zap, title: 'Webhooks de Alertas Proactivas Premium', desc: 'Monitoreo continuo de tu cartera de clientes activos. Cuando un número registrado en tu base de datos es reportado en cualquier zona del país, recibes una alerta instantánea vía webhook antes de procesar tu próximo despacho.' },
  { icon: ShieldCheck, title: 'API REST Empresarial', desc: 'Integración nativa con tu stack actual: WooCommerce, Shopify, sistemas de mensajería y pasarelas de pago. Un único endpoint, latencia sub-100ms, sin fricción operativa.' },
  { icon: Activity, title: 'Dashboard de Inteligencia de Riesgo', desc: 'Panel centralizado con scoring por zona geográfica, evolución temporal de reportes y segmentación por tipo de fraude. Decisiones basadas en datos, no en intuición.' },
];

export const Features: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.features-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );
      gsap.fromTo('.feature-card',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.18, ease: 'power3.out', scrollTrigger: { trigger: '.feature-card', start: 'top 80%' } }
      );
      gsap.fromTo('.biz-card',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.biz-card', start: 'top 80%' } }
      );
      // Mouse glow
      document.querySelectorAll('.feature-card').forEach((card: any) => {
        card.addEventListener('mousemove', (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--x', `${e.clientX - rect.left}px`);
          card.style.setProperty('--y', `${e.clientY - rect.top}px`);
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-32 px-6 w-full max-w-6xl mx-auto relative z-10">

      {/* ── Ambient ── */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-moss/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-[#CC5833]/5 blur-[140px] rounded-full pointer-events-none" />

      {/* ── Section Header: AI Engine ── */}
      <div className="features-header mb-20">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#CC5833] mb-4 block">§ 02 · Sidere AI Engine · Núcleo Tecnológico</span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-cream tracking-tight leading-[1.05]">
              Tres capas de inteligencia.{' '}
              <span className="font-serif italic font-light text-[#CC5833]">Un escudo invulnerable.</span>
            </h2>
            <div className="w-16 h-px bg-white/10 my-6" />
            <p className="font-sans text-sm md:text-base text-cream/55 leading-relaxed">
              El motor probabilístico de Sidere AI no solo almacena reportes: los valida, les asigna peso dinámico
              y filtra el ruido competitivo para entregarte inteligencia de mercado genuina.
            </p>
          </div>
        </div>
      </div>

      {/* ── AI Engine Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {aiEngineFeatures.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              className="feature-card group relative bg-[#0f0f0f]/80 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-8 flex flex-col gap-6 transition-all duration-500 hover:border-[#CC5833]/25 hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(500px circle at var(--x) var(--y), rgba(204,88,51,0.07), transparent 40%)' }}
              />
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-[#CC5833]/10 border border-[#CC5833]/20 rounded-2xl">
                  <Icon className="w-5 h-5 text-[#CC5833]" />
                </div>
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-widest text-cream/30 mb-0.5">{feat.label}</p>
                  <h3 className="font-sans font-bold text-base text-cream leading-tight">{feat.title}</h3>
                </div>
              </div>
              <p className="relative z-10 font-sans text-xs text-cream/55 leading-relaxed">{feat.body}</p>
              <div className="relative z-10 mt-auto">{feat.microUI}</div>
            </div>
          );
        })}
      </div>

      {/* ── Business Model & API Section ── */}
      <div className="features-header mb-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#CC5833] mb-4 block">§ 03 · Modelo B2B SaaS · API Capabilities</span>
        <h2 className="font-sans font-bold text-3xl md:text-4xl lg:text-5xl text-cream tracking-tight leading-[1.05] max-w-3xl">
          Infraestructura de confianza{' '}
          <span className="font-serif italic font-light text-[#CC5833]">lista para tu stack.</span>
        </h2>
        <div className="w-16 h-px bg-white/10 my-6" />
        <p className="font-sans text-sm text-cream/55 leading-relaxed max-w-2xl">
          Diseñado para empresas de mensajería, tiendas en línea y pasarelas de pago que necesitan inteligencia de riesgo
          sin reconstruir su infraestructura. Conecta tu sistema en minutos, no semanas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {businessCapabilities.map((cap) => {
          const Icon = cap.icon;
          return (
            <div
              key={cap.title}
              className="biz-card group relative bg-[#0f0f0f]/60 border border-white/5 rounded-[2rem] p-7 flex flex-col gap-4 transition-all duration-400 hover:border-[#CC5833]/25 hover:-translate-y-1 overflow-hidden"
            >
              <div className="p-2.5 bg-[#CC5833]/10 border border-[#CC5833]/15 rounded-xl w-fit">
                <Icon className="w-4 h-4 text-[#CC5833]" />
              </div>
              <h3 className="font-sans font-bold text-sm text-cream leading-snug">{cap.title}</h3>
              <p className="font-sans text-xs text-cream/50 leading-relaxed">{cap.desc}</p>
              {/* Animated bottom line */}
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-[#CC5833]/0 via-[#CC5833]/50 to-[#CC5833]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          );
        })}
      </div>
    </section>
  );
};
