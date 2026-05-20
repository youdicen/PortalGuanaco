import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingDown, Package, Ghost, AlertOctagon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// Cálculos verificables:
// Mercado e-commerce SV 2025: $703M (trade.gov / ecdb.com)
// 75% de transacciones SV son COD → $527M en volumen COD
// RTO 30-40% de $527M → $158M–$211M en envíos perdidos/año
// Mercado LATAM e-commerce: $158B (ResearchAndMarkets 2024)
// 19% de $158B en gestión de fraude → $30B
// 20% de $158B en pérdidas por fraude → $31.6B

const problems = [
  {
    icon: Ghost,
    metric: '30–40%',
    money: '$158M–$211M/año',
    moneyLabel: 'Solo en El Salvador',
    title: 'Tasa RTO en El Salvador',
    description:
      'Entre el 30% y el 40% de los pedidos COD en El Salvador nunca son entregados exitosamente. Con el 75% de transacciones en efectivo sobre un mercado de $703M, el daño anual supera los $158M.',
    source: 'fufills.com · trade.gov · ecdb.com, 2024',
    color: '#CC5833',
    slug: '/reportajes/tasa-rto-el-salvador',
  },
  {
    icon: Package,
    metric: 'Hasta 59%',
    money: 'Del precio original',
    moneyLabel: 'Costo real por envío fallido',
    title: 'Del Valor del Producto: Destruido',
    description:
      'El costo total de un envío fallido —transporte ida y vuelta, reempaque, almacenamiento y atención al cliente— puede consumir hasta el 59% del precio de venta original. Cada rechazo destruye margen neto.',
    source: 'TheLogisticsWorld · Logística Inversa en LATAM, 2024',
    color: '#CC5833',
    slug: '/reportajes/costo-destruccion-margen',
  },
  {
    icon: TrendingDown,
    metric: '19%',
    money: '~$30B anuales',
    moneyLabel: 'Gastados en gestión de fraude · LATAM',
    title: 'Del Revenue: Absorbido por Fraude',
    description:
      'Los comercios latinoamericanos destinan el 19% de su revenue anual a combatir el fraude — la tasa más alta del mundo. Sobre un mercado de $158B, eso equivale a $30B en costos de defensa.',
    source: 'MerchantSavvy / SaleSso · Global Fraud Management Report, 2024',
    color: '#CC5833',
    slug: '/reportajes/revenue-absorbido-fraude-latam',
  },
  {
    icon: AlertOctagon,
    metric: '~20%',
    money: '>$31.6B anuales',
    moneyLabel: 'Pérdidas por fraude · E-commerce LATAM',
    title: 'Del E-commerce LATAM: Fraude',
    description:
      'América Latina pierde el 20% de su revenue de e-commerce en fraude — segunda región más afectada del mundo. Sobre el mercado de $158B+, el impacto calculado supera los $31.6B al año.',
    source: 'Mastercard / PaymentsCMI · E-commerce Fraud LATAM, 2024',
    color: '#CC5833',
    slug: '/reportajes/impacto-fraude-ecommerce-latam',
  },
];


export const EcosystemProblem: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.problem-header',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );
      gsap.fromTo('.problem-card',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.problem-card', start: 'top 80%' },
        }
      );
      // Counter animation for metric numbers
      document.querySelectorAll('.problem-metric').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.7 },
          {
            opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ecosystem-problem"
      className="relative py-32 w-full overflow-hidden bg-transparent"
    >
      {/* ── Warning accent line ── */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #CC5833 30%, #CC5833 70%, transparent)' }} />

      {/* ── Ambient ── */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 38px, #CC5833 38px, #CC5833 40px)', backgroundSize: '100% 40px' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* ── Header ── */}
        <div className="problem-header mb-20 max-w-3xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#CC5833] mb-4 block">
            § 01 · El Dolor del Mercado
          </span>
          <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-cream tracking-tight leading-[1.05] mb-6">
            El fraude COD es la{' '}
            <span className="font-serif italic font-light text-[#CC5833]">hemorragia invisible</span>{' '}
            del e-commerce latinoamericano.
          </h2>
          <p className="font-sans text-base text-cream/55 leading-relaxed max-w-2xl">
            En modelos Cash-on-Delivery, el poder está del lado del comprador. Sin mecanismos preventivos,
            los comercios financian el fraude de sus propios clientes — pedido tras pedido, mensajero tras mensajero.
            <span className="text-cream font-medium"> PortalGuanaco lo termina.</span>
          </p>
        </div>

        {/* ── Problem Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="problem-card group relative bg-[#111111]/70 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 md:p-10 flex flex-col gap-6 overflow-hidden transition-all duration-500 hover:border-[#CC5833]/30 hover:-translate-y-1"
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at top right, rgba(204,88,51,0.12), transparent 70%)' }}
                />

                <div className="flex items-start justify-between gap-4">
                  <div className="p-3 bg-[#CC5833]/10 border border-[#CC5833]/20 rounded-2xl shrink-0">
                    <Icon className="w-5 h-5" style={{ color: p.color }} />
                  </div>
                  {/* Doble métrica: % arriba + $ abajo */}
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="problem-metric font-mono text-4xl md:text-5xl font-bold tracking-tight leading-none" style={{ color: p.color }}>
                      {p.metric}
                    </span>
                    {p.money && (
                      <div className="flex flex-col items-end">
                        <span className="font-mono text-sm md:text-base font-bold text-cream/80 tracking-tight leading-none">
                          {p.money}
                        </span>
                        <span className="font-mono text-[8px] uppercase tracking-widest text-cream/30 mt-0.5">
                          {p.moneyLabel}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-sans font-bold text-xl text-cream mb-3">{p.title}</h3>
                  <p className="font-sans text-sm text-cream/55 leading-relaxed">{p.description}</p>
                  {p.source && (
                    <p className="font-mono text-[9px] uppercase tracking-widest text-cream/25 mt-3 border-t border-white/5 pt-3">
                      📌 {p.source}
                    </p>
                  )}
                </div>

                {/* Botón de Enlace al Reportaje */}
                <div className="mt-2 pt-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => navigate(p.slug)}
                    className="group/btn inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-clay hover:text-[#e67e22] transition-colors z-10 cursor-pointer"
                  >
                    Leer Reportaje de Investigación
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                  <span className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse" />
                </div>

                {/* Bottom bar */}
                <div className="w-0 group-hover:w-full h-px bg-gradient-to-r from-[#CC5833]/60 to-transparent transition-all duration-700 ease-out mt-auto" />
              </div>

            );
          })}
        </div>

        {/* ── Investor Pull Quote ── */}
        <div className="mt-16 bg-[#CC5833]/8 border border-[#CC5833]/20 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#CC5833]/20 flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-[#CC5833]" />
          </div>
          <div>
            <p className="font-serif italic text-xl md:text-2xl text-cream leading-relaxed">
              "Cada envío rechazado no es solo una pérdida operativa. Es capital semilla destruido, moral de equipo erosionada y
              un cliente que el competidor conquistará mañana."
            </p>
            <span className="font-mono text-[10px] uppercase tracking-widest text-cream/40 mt-3 block">
              — Análisis de Impacto · Sidere AI Research Lab · 2026
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)' }}
      />
    </section>
  );
};
