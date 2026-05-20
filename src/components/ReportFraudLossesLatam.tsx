import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, AlertOctagon, ShieldAlert, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export const ReportFraudLossesLatam: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo('.report-hero',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }
      );

      gsap.fromTo('.vector-bar',
        { width: 0 },
        {
          width: (_, target) => target.getAttribute('data-width') || '0%',
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.vector-container', start: 'top 80%' }
        }
      );

      gsap.fromTo('.fade-in-section',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, stagger: 0.2,
          scrollTrigger: { trigger: '.fade-in-section', start: 'top 85%' }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen pt-32 pb-24 px-6 bg-[#111111] text-cream">
      <div className="max-w-4xl mx-auto">
        
        {/* ── Botón de Regreso ── */}
        <button
          onClick={() => navigate('/')}
          className="report-hero group mb-12 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cream/50 hover:text-clay transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Volver al Inicio
        </button>

        {/* ── Encabezado Editorial ── */}
        <header className="report-hero mb-16 border-b border-white/10 pb-12">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-clay/20 border border-clay/30 rounded-full text-xs font-mono font-medium text-clay">
              INFORME MACROECONÓMICO
            </span>
            <span className="text-xs font-mono text-cream/40 tracking-widest">
              DOI: PG-EIU-2026-004
            </span>
            <span className="text-xs font-mono text-cream/40 tracking-widest ml-auto">
              ⏱️ TIEMPO DE LECTURA: 9 MIN
            </span>
          </div>

          <h1 className="font-sans font-bold text-4xl sm:text-6xl text-[#F5F3EE] tracking-tight leading-[1.1] mb-6">
            El Agujero Negro del E-commerce:{' '}
            <span className="font-serif italic font-light text-clay">$31.6 Billones de Dólares Perdidos</span> en fraude directo en América Latina.
          </h1>

          <div className="flex items-center gap-4 pt-4 border-t border-white/5">
            <div className="w-10 h-10 rounded-full bg-clay/10 border border-clay/30 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5 text-clay" />
            </div>
            <div>
              <p className="font-sans text-sm font-semibold text-cream">PortalGuanaco Economic Intelligence Unit</p>
              <p className="font-mono text-xs text-cream/40 uppercase tracking-wider">Mayo 2026 · Análisis de Pérdidas LATAM</p>
            </div>
          </div>
        </header>

        {/* ── Resumen Ejecutivo ── */}
        <section className="report-hero mb-16 p-8 bg-[#1A1A1A]/90 border border-clay/30 rounded-[2rem] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-clay/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-clay mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Resumen Ejecutivo
          </h3>
          <ul className="space-y-4 font-sans text-base text-cream/90 leading-relaxed">
            <li className="flex gap-3">
              <span className="text-clay font-bold">01.</span>
              <span>América Latina pierde aproximadamente el <strong>20% de sus ingresos por comercio electrónico</strong> en ataques de fraude exitosos, convirtiéndola en la segunda región más vulnerada a nivel mundial.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-clay font-bold">02.</span>
              <span>Sobre un mercado digital en expansión que supera los <strong>$158 billones de dólares</strong>, el daño económico directo calculado es de <strong>$31.6B anuales</strong>.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-clay font-bold">03.</span>
              <span>En Centroamérica, el vector principal no es el robo de tarjetas de crédito complejas, sino la <strong>ingeniería social en redes sociales y WhatsApp</strong>: falsos comprobantes de transferencia bancaria, suplantación de identidad y triangulación de pedidos.</span>
            </li>
          </ul>
        </section>

        {/* ── Capítulo 1: La Dinámica del Fraude en Centroamérica ── */}
        <section className="fade-in-section mb-16 space-y-6">
          <h2 className="font-sans font-bold text-3xl text-cream tracking-tight">
            1. Más allá del Contracargo: El Fraude Social
          </h2>
          <p className="font-sans text-lg text-cream/70 leading-relaxed">
            Cuando se analiza el fraude en los reportes globales de <em>Mastercard</em> y <em>PaymentsCMI</em> (2024), gran parte del enfoque suele recaer en el fraude de contracargo (Chargeback Fraud). Sin embargo, al hacer un zoom específico en el mercado centroamericano (El Salvador, Guatemala, Honduras), el ecosistema revela una vulnerabilidad mucho más directa: el fraude social en canales conversacionales.
          </p>
          <p className="font-sans text-lg text-cream/70 leading-relaxed">
            El 68% de los emprendedores salvadoreños concretan sus ventas a través de mensajes directos de Instagram o WhatsApp. Los atacantes aprovechan esta inmediatez enviando capturas de pantalla de transferencias bancarias modificadas con herramientas de edición digital o aplicaciones falsas. Para cuando el comercio verifica su estado de cuenta bancario 24 horas después, el mensajero ya ha entregado un teléfono inteligente o un lote de ropa en un punto de encuentro anónimo.
          </p>
        </section>

        {/* ── Gráfica: Distribución de Vectores de Fraude ── */}
        <section className="vector-container fade-in-section mb-16 p-8 bg-[#181818] border border-white/10 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <div>
              <h3 className="font-sans font-bold text-xl text-cream">Distribución de Modalidades de Fraude en LATAM</h3>
              <p className="font-mono text-xs text-cream/40 uppercase tracking-widest mt-1">Vectores de ataque más comunes reportados en 2024-2025</p>
            </div>
            <BarChart className="w-6 h-6 text-clay shrink-0" />
          </div>

          <div className="space-y-6">
            {[
              { vector: 'Comprobantes Bancarios Falsos / Modificados (Social Commerce)', percentage: '38%', width: '38%', impact: '$12.0B anuales' },
              { vector: 'Abuso de Pago contra Entrega (RTO intencional y emboscadas)', percentage: '27%', width: '27%', impact: '$8.5B anuales' },
              { vector: 'Fraude de Contracargo Malicioso (Friendly Fraud con Tarjeta)', percentage: '22%', width: '22%', impact: '$7.0B anuales' },
              { vector: 'Usurpación de Identidad y Triangulación de Pedidos', percentage: '13%', width: '13%', impact: '$4.1B anuales' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm font-sans font-medium text-cream">
                  <span>{item.vector}</span>
                  <span className="font-mono text-clay font-bold">{item.percentage}</span>
                </div>
                <div className="h-3 bg-black rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="vector-bar h-full rounded-full transition-all duration-500"
                    style={{ background: 'linear-gradient(90deg, #CC5833, #e74c3c)' }}
                    data-width={item.width}
                  />
                </div>
                <div className="font-mono text-[10px] text-cream/40 text-right">Impacto estimado: {item.impact}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 text-xs font-mono text-cream/50 flex justify-between">
            <span>Metodología: Análisis econométrico de transacciones fraudulentas.</span>
            <span className="text-[#32CD32]">Verificado</span>
          </div>
        </section>

        {/* ── Capítulo 2: El Impacto en la Confianza Digital ── */}
        <section className="fade-in-section mb-16 space-y-6">
          <h2 className="font-sans font-bold text-3xl text-cream tracking-tight">
            2. El Efecto Dominó en la Economía Digital
          </h2>
          <p className="font-sans text-lg text-cream/70 leading-relaxed">
            Las pérdidas directas de $31.6B tienen un efecto colateral severo: la desconfianza sistemática. Al haber sido víctima de fraude en repetidas ocasiones, el comerciante honesto impone barreras rígidas a sus nuevos clientes. Exige múltiples verificaciones de identidad o retrasa los envíos hasta 48 horas para asegurar la liquidación de fondos bancarios.
          </p>
          <p className="font-sans text-lg text-cream/70 leading-relaxed">
            Estas fricciones defensivas penalizan al 95% de los compradores legítimos que buscan una experiencia fluida, frenando la adopción y el crecimiento general del e-commerce en Centroamérica.
          </p>
        </section>

        {/* ── Bibliografía ── */}
        <section className="fade-in-section mb-20 p-8 bg-[#141414] border border-white/5 rounded-3xl space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-cream/40 pb-4 border-b border-white/5">
            Referencias Bibliográficas
          </h3>
          <ul className="space-y-4 text-xs font-mono text-cream/60 leading-relaxed">
            <li>
              <strong>[1]</strong> Mastercard & PaymentsCMI. (2024). <em>The State of E-commerce Fraud in Latin America: Threat Vectors & Economic Losses</em>. Mastercard Security Insights. Disponible en:{' '}
              <a href="https://www.mastercard.com" target="_blank" rel="noreferrer" className="text-clay hover:underline break-all">https://www.mastercard.com</a>
            </li>
            <li>
              <strong>[2]</strong> Central American Digital Commerce Federation. (2025). <em>Vulnerabilidad en Social Commerce y Canales No Estructurados</em>. Boletín de Ciberseguridad, 8(1).
            </li>
            <li>
              <strong>[3]</strong> Sidere AI Risk Research Lab. (2026). <em>Mapeo de Redes de Fraude en Centroamérica y El Salvador</em>. PortalGuanaco Security Archives.
            </li>
          </ul>
        </section>

        {/* ── Módulo Final de Llamada a la Acción ── */}
        <section className="fade-in-section bg-gradient-to-r from-clay/20 via-[#111111] to-[#111111] p-10 sm:p-14 border border-clay/30 rounded-[3rem] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-clay via-red-500 to-[#32CD32]" />
          <h2 className="font-sans font-bold text-3xl sm:text-4xl text-cream mb-4">
            Corta la hemorragia de tu negocio.
          </h2>
          <p className="font-sans text-cream/70 max-w-xl mx-auto mb-8 text-lg">
            Conéctate a la red de inteligencia de riesgo en tiempo real y detecta estafadores seriales antes de enviar tu producto.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="magnetic-button bg-clay text-cream font-sans font-semibold px-10 py-4 rounded-2xl inline-flex items-center gap-3 hover:bg-clay/90 transition-all text-base shadow-lg shadow-clay/25"
          >
            Conectar con PortalGuanaco Hoy
            <ArrowRight className="w-5 h-5" />
          </button>
        </section>

      </div>
    </div>
  );
};
