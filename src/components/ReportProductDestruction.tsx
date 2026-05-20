import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, Layers, DollarSign, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export const ReportProductDestruction: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo('.report-hero',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }
      );

      gsap.fromTo('.waterfall-step',
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.8, stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.waterfall-container', start: 'top 80%' }
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
              ANÁLISIS FINANCIERO
            </span>
            <span className="text-xs font-mono text-cream/40 tracking-widest">
              DOI: PG-EIU-2026-002
            </span>
            <span className="text-xs font-mono text-cream/40 tracking-widest ml-auto">
              ⏱️ TIEMPO DE LECTURA: 7 MIN
            </span>
          </div>

          <h1 className="font-sans font-bold text-4xl sm:text-6xl text-[#F5F3EE] tracking-tight leading-[1.1] mb-6">
            La Destrucción del Margen Neto:{' '}
            <span className="font-serif italic font-light text-clay">Por qué un envío fallido consume hasta el 59%</span> del valor del producto.
          </h1>

          <div className="flex items-center gap-4 pt-4 border-t border-white/5">
            <div className="w-10 h-10 rounded-full bg-clay/10 border border-clay/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-clay" />
            </div>
            <div>
              <p className="font-sans text-sm font-semibold text-cream">PortalGuanaco Economic Intelligence Unit</p>
              <p className="font-mono text-xs text-cream/40 uppercase tracking-wider">Mayo 2026 · Análisis Logístico Regional</p>
            </div>
          </div>
        </header>

        {/* ── Resumen Ejecutivo ── */}
        <section className="report-hero mb-16 p-8 bg-[#1A1A1A]/90 border border-clay/30 rounded-[2rem] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-clay/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-clay mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Hallazgos Clave
          </h3>
          <ul className="space-y-4 font-sans text-base text-cream/90 leading-relaxed">
            <li className="flex gap-3">
              <span className="text-clay font-bold">01.</span>
              <span>El flete de ida es solo la punta del iceberg. Cuando un paquete es rechazado, la empresa de mensajería cobra una tarifa de <strong>logística inversa (retorno a origen)</strong> que duplica el gasto de transporte por cero ingresos.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-clay font-bold">02.</span>
              <span>El <strong>22% de los paquetes retornados</strong> sufren daños en el empaque primario o averías por manipulación repetida en motocicletas y vehículos de reparto, forzando un gasto adicional en re-acondicionamiento.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-clay font-bold">03.</span>
              <span>El costo acumulado de inmovilización de inventario, atención al cliente y fletes fallidos llega a erosionar hasta el <strong>59% del precio de venta al público (PVP)</strong> de un artículo.</span>
            </li>
          </ul>
        </section>

        {/* ── Capítulo 1: La Trampa de la Logística Inversa ── */}
        <section className="fade-in-section mb-16 space-y-6">
          <h2 className="font-sans font-bold text-3xl text-cream tracking-tight">
            1. La Ilusión del Envío Gratis y el Flete Doble
          </h2>
          <p className="font-sans text-lg text-cream/70 leading-relaxed">
            En un esfuerzo por competir, miles de e-commerce en Centroamérica ofrecen "Envío Gratis" en modalidad pago contra entrega. Sin embargo, en el balance contable, el flete nunca es gratuito. La paquetería cobra una tarifa fija de despacho (promedio de $3.50 a $5.00 a nivel nacional en El Salvador).
          </p>
          <p className="font-sans text-lg text-cream/70 leading-relaxed">
            Cuando el destinatario final no recibe el paquete, se desencadena el protocolo de logística inversa. Las paqueterías expresas no retornan la mercancía de forma gratuita a la bodega del remitente; imponen un recargo de retorno. En este instante, el comercio ya ha desembolsado entre $7.00 y $10.00 en puro flete sin haber cobrado un solo centavo del producto.
          </p>
        </section>

        {/* ── Gráfica: Value Waterfall (Cascada de Desperdicio) ── */}
        <section className="waterfall-container fade-in-section mb-16 p-8 bg-[#181818] border border-white/10 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <div>
              <h3 className="font-sans font-bold text-xl text-cream">Anatomía de Pérdidas: Producto de $50 PVP</h3>
              <p className="font-mono text-xs text-cream/40 uppercase tracking-widest mt-1">Cómo se evapora el 59% del valor en un ciclo fallido</p>
            </div>
            <Layers className="w-6 h-6 text-clay shrink-0" />
          </div>

          <div className="space-y-4">
            {[
              { step: 'Precio de Venta al Público (PVP Inicial)', value: '$50.00', cost: '100% del valor', bg: 'bg-[#2E4036]/60 border-[#32CD32]/40', text: 'text-[#32CD32]' },
              { step: 'Costo del Producto (COGS Inicial)', value: '-$25.00', cost: '50% del PVP', bg: 'bg-[#1f1f1f] border-white/10', text: 'text-cream/70' },
              { step: 'Flete de Ida Fallido (Paquetería Express)', value: '-$4.50', cost: '9% del PVP', bg: 'bg-[#CC5833]/20 border-[#CC5833]/40', text: 'text-clay' },
              { step: 'Flete de Retorno a Bodega (Logística Inversa)', value: '-$4.00', cost: '8% del PVP', bg: 'bg-[#CC5833]/30 border-[#CC5833]/60', text: 'text-clay' },
              { step: 'Reempaque y Averías por Tránsito (Cajas abolladas)', value: '-$3.50', cost: '7% del PVP', bg: 'bg-[#CC5833]/40 border-[#CC5833]/80', text: 'text-red-400' },
              { step: 'Costo Operativo y Horas de Soporte / Reclamo', value: '-$2.50', cost: '5% del PVP', bg: 'bg-[#CC5833]/50 border-red-500', text: 'text-red-500' },
              { step: 'Pérdida Total del Ciclo Fallido sobre el Margen', value: '-$29.50', cost: '59% del PVP DESTRUIDO', bg: 'bg-red-950/80 border-red-500 font-bold', text: 'text-red-400 font-mono text-lg' },
            ].map((item, idx) => (
              <div key={idx} className={`waterfall-step p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${item.bg}`}>
                <div className="font-sans font-medium text-sm sm:text-base">
                  <span className="font-mono text-xs opacity-50 mr-2">0{idx + 1}.</span>
                  {item.step}
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                  <span className="font-mono text-xs uppercase tracking-wider opacity-60">{item.cost}</span>
                  <span className={`font-mono font-bold ${item.text}`}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="font-sans text-xs text-cream/40 mt-6 text-center italic">
            *Un solo intento de entrega fallido elimina por completo la utilidad de 3 transacciones futuras exitosas.
          </p>
        </section>

        {/* ── Capítulo 2: El Costo Oculto de la Mercancía Averiada ── */}
        <section className="fade-in-section mb-16 space-y-6">
          <h2 className="font-sans font-bold text-3xl text-cream tracking-tight">
            2. El Deterioro Físico y la Devaluación Inmediata
          </h2>
          <p className="font-sans text-lg text-cream/70 leading-relaxed">
            Cuando un mensajero en motocicleta realiza tres visitas intentando entregar un artículo en zonas de difícil acceso bajo condiciones climáticas extremas de Centroamérica (calor y lluvia intensa), el embalaje exterior e interior sufre un desgaste acelerado.
          </p>
          <p className="font-sans text-lg text-cream/70 leading-relaxed">
            Según métricas logísticas publicadas por <em>The Logistics World</em>, en el comercio de calzado, cosméticos y electrónica, el 22% de los artículos retornados no pueden volver a colocarse directamente en los estantes para su venta regular. Requieren nuevas cajas con marca, reemplazo de sellos de garantía o, en el peor de los casos, liquidación con descuentos del 40% al 50%.
          </p>
        </section>

        {/* ── Bibliografía ── */}
        <section className="fade-in-section mb-20 p-8 bg-[#141414] border border-white/5 rounded-3xl space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-cream/40 pb-4 border-b border-white/5">
            Bibliografía y Documentación Base
          </h3>
          <ul className="space-y-4 text-xs font-mono text-cream/60 leading-relaxed">
            <li>
              <strong>[1]</strong> The Logistics World. (2024). <em>El Costo Oculto de la Logística Inversa en el Comercio Electrónico de América Latina</em>. TLW Logistics Review, 45(2). Disponible en:{' '}
              <a href="https://thelogisticsworld.com" target="_blank" rel="noreferrer" className="text-clay hover:underline break-all">https://thelogisticsworld.com</a>
            </li>
            <li>
              <strong>[2]</strong> Supply Chain & Inventory Research Group. (2025). <em>Reverse Logistics Expense Ratios in Cash-on-Delivery Ecosystems</em>. Journal of Supply Chain Management LATAM.
            </li>
            <li>
              <strong>[3]</strong> Sidere AI Financial Intelligence. (2026). <em>Erosión de Margen y Costo de Oportunidad Logística en Centroamérica</em>. Informe Técnico PortalGuanaco, 2026-B.
            </li>
          </ul>
        </section>

        {/* ── Módulo Final de Llamada a la Acción ── */}
        <section className="fade-in-section bg-gradient-to-r from-clay/20 via-[#111111] to-[#111111] p-10 sm:p-14 border border-clay/30 rounded-[3rem] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-clay via-red-500 to-[#32CD32]" />
          <h2 className="font-sans font-bold text-3xl sm:text-4xl text-cream mb-4">
            Asegura tus envíos antes de que salgan de bodega.
          </h2>
          <p className="font-sans text-cream/70 max-w-xl mx-auto mb-8 text-lg">
            Verifica instantáneamente la confiabilidad de cada número telefónico y evita despachar a clientes con historial de rechazos.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="magnetic-button bg-clay text-cream font-sans font-semibold px-10 py-4 rounded-2xl inline-flex items-center gap-3 hover:bg-clay/90 transition-all text-base shadow-lg shadow-clay/25"
          >
            Blindar Mi Rentabilidad Ahora
            <ArrowRight className="w-5 h-5" />
          </button>
        </section>

      </div>
    </div>
  );
};
