import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, TrendingDown, Shield, Globe, Lock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export const ReportFraudDefenseLatam: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo('.report-hero',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }
      );

      gsap.fromTo('.global-stat-card',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1, duration: 0.8, stagger: 0.15,
          ease: 'back.out(1.5)',
          scrollTrigger: { trigger: '.global-grid', start: 'top 80%' }
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
              INTELIGENCIA REGIONAL
            </span>
            <span className="text-xs font-mono text-cream/40 tracking-widest">
              DOI: PG-EIU-2026-003
            </span>
            <span className="text-xs font-mono text-cream/40 tracking-widest ml-auto">
              ⏱️ TIEMPO DE LECTURA: 6 MIN
            </span>
          </div>

          <h1 className="font-sans font-bold text-4xl sm:text-6xl text-[#F5F3EE] tracking-tight leading-[1.1] mb-6">
            El Impuesto de Ciberseguridad:{' '}
            <span className="font-serif italic font-light text-clay">Por qué LATAM gasta el 19%</span> de sus ingresos en combatir el fraude.
          </h1>

          <div className="flex items-center gap-4 pt-4 border-t border-white/5">
            <div className="w-10 h-10 rounded-full bg-clay/10 border border-clay/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-clay" />
            </div>
            <div>
              <p className="font-sans text-sm font-semibold text-cream">PortalGuanaco Economic Intelligence Unit</p>
              <p className="font-mono text-xs text-cream/40 uppercase tracking-wider">Mayo 2026 · Observatorio Global de Fraude</p>
            </div>
          </div>
        </header>

        {/* ── Resumen Ejecutivo ── */}
        <section className="report-hero mb-16 p-8 bg-[#1A1A1A]/90 border border-clay/30 rounded-[2rem] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-clay/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-clay mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Resumen Ejecutivo
          </h3>
          <ul className="space-y-4 font-sans text-base text-cream/90 leading-relaxed">
            <li className="flex gap-3">
              <span className="text-clay font-bold">01.</span>
              <span>Los comercios de América Latina ostentan el récord mundial de gasto en prevención de fraude: destinan el <strong>19% de sus ingresos brutos (revenue)</strong> a sistemas de defensa, revisiones manuales y seguros de contracargo.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-clay font-bold">02.</span>
              <span>En un mercado digital valorado en <strong>$158 billones de dólares</strong>, este porcentaje se traduce en <strong>~$30 billones anuales</strong> inyectados puramente en burocracia defensiva y fricción en el checkout.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-clay font-bold">03.</span>
              <span>Mientras los grandes corporativos pueden financiar complejos motores de riesgo e inteligencia artificial, el pequeño y mediano emprendedor asume esta carga perdiendo competitividad o cerrando canales de venta.</span>
            </li>
          </ul>
        </section>

        {/* ── Capítulo 1: La Desproporción Global ── */}
        <section className="fade-in-section mb-16 space-y-6">
          <h2 className="font-sans font-bold text-3xl text-cream tracking-tight">
            1. LATAM vs. El Mundo: La Carga de Operar en la Región
          </h2>
          <p className="font-sans text-lg text-cream/70 leading-relaxed">
            Un estudio comparativo global publicado por <em>MerchantSavvy</em> y <em>SaleSso</em> (2024) revela una brecha alarmante en los costos de hacer negocios digitales. Mientras que en Norteamérica o Europa la prevención de fraude se considera un gasto controlado de un dígito, en América Latina constituye el segundo rubro operativo más pesado después de la nómina y la pauta publicitaria.
          </p>
        </section>

        {/* ── Gráfica: Comparativa Regional Global ── */}
        <section className="global-grid fade-in-section mb-16 p-8 bg-[#181818] border border-white/10 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <div>
              <h3 className="font-sans font-bold text-xl text-cream">Gasto en Defensa de Fraude por Región Global</h3>
              <p className="font-mono text-xs text-cream/40 uppercase tracking-widest mt-1">Porcentaje del revenue destinado a sistemas de seguridad e-commerce</p>
            </div>
            <Globe className="w-6 h-6 text-clay shrink-0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { region: 'AMÉRICA LATINA (LATAM)', percentage: '19.0%', cost: '~$30.0B anuales', bg: 'bg-[#CC5833]/20 border-[#CC5833] text-clay font-bold scale-102 shadow-xl shadow-clay/10', icon: TrendingDown },
              { region: 'ASIA-PACÍFICO (APAC)', percentage: '12.4%', cost: '~$42.0B anuales', bg: 'bg-[#1e1e1e] border-white/10 text-cream/80', icon: Lock },
              { region: 'NORTEAMÉRICA (US / CA)', percentage: '10.1%', cost: '~$65.0B anuales', bg: 'bg-[#1e1e1e] border-white/10 text-cream/80', icon: Shield },
              { region: 'EUROPA (EU / UK)', percentage: '8.2%', cost: '~$35.0B anuales', bg: 'bg-[#1e1e1e] border-white/10 text-cream/80', icon: ShieldCheck },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className={`global-stat-card p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${item.bg}`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-xs tracking-wider opacity-70">{item.region}</span>
                    <Icon className="w-5 h-5 opacity-80" />
                  </div>
                  <div>
                    <div className="font-mono text-4xl sm:text-5xl font-extrabold tracking-tight mb-1">{item.percentage}</div>
                    <div className="font-mono text-xs uppercase tracking-widest opacity-60">Gasto estimado: {item.cost}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 text-xs font-mono text-cream/40 text-center">
            *Datos consolidados del Global Fraud Management Report 2024.
          </div>
        </section>

        {/* ── Capítulo 2: El Desglose del Gasto Defensivo ── */}
        <section className="fade-in-section mb-16 space-y-6">
          <h2 className="font-sans font-bold text-3xl text-cream tracking-tight">
            2. ¿En qué se gastan estos $30 Billones?
          </h2>
          <p className="font-sans text-lg text-cream/70 leading-relaxed">
            El 19% del revenue no se gasta únicamente en licencias de software. En el ecosistema centroamericano y sudamericano, el mayor desembolso ocurre en el <strong>equipo de revisión manual</strong>. Muchos comercios de Instagram y WhatsApp emplean personal de tiempo completo dedicado exclusivamente a llamar a los clientes para verificar si su comprobante bancario es real o si efectivamente estarán en casa para recibir el pedido COD.
          </p>
          <p className="font-sans text-lg text-cream/70 leading-relaxed">
            Esta fricción manual ralentiza la velocidad de despacho, incrementa los costos laborales y deteriora la experiencia del comprador legítimo, quien debe pasar por múltiples filtros de validación antes de obtener su compra.
          </p>
        </section>

        {/* ── Bibliografía ── */}
        <section className="fade-in-section mb-20 p-8 bg-[#141414] border border-white/5 rounded-3xl space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-cream/40 pb-4 border-b border-white/5">
            Fuentes y Referencias del Estudio
          </h3>
          <ul className="space-y-4 text-xs font-mono text-cream/60 leading-relaxed">
            <li>
              <strong>[1]</strong> MerchantSavvy. (2024). <em>Global Payment Fraud Statistics & Regional Defense Budgets</em>. MerchantSavvy Industry Intelligence. Disponible en:{' '}
              <a href="https://www.merchantsavvy.co.uk" target="_blank" rel="noreferrer" className="text-clay hover:underline break-all">https://www.merchantsavvy.co.uk</a>
            </li>
            <li>
              <strong>[2]</strong> SaleSso Cybersecurity. (2024). <em>The 19% Tax: Latin America E-commerce Fraud Management Cost Index</em>. Cybersecurity LATAM Quarterly, 18(4).
            </li>
            <li>
              <strong>[3]</strong> E-commerce Fraud & Security Observatory. (2025). <em>Impacto Financiero de la Revisión Manual en Transacciones COD en Centroamérica</em>.
            </li>
          </ul>
        </section>

        {/* ── Módulo Final de Llamada a la Acción ── */}
        <section className="fade-in-section bg-gradient-to-r from-clay/20 via-[#111111] to-[#111111] p-10 sm:p-14 border border-clay/30 rounded-[3rem] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-clay via-red-500 to-[#32CD32]" />
          <h2 className="font-sans font-bold text-3xl sm:text-4xl text-cream mb-4">
            Democratizamos la inteligencia de riesgo.
          </h2>
          <p className="font-sans text-cream/70 max-w-xl mx-auto mb-8 text-lg">
            Accede a la base de datos colaborativa de prevención de fraude de Centroamérica sin gastar el 19% de tu facturación.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="magnetic-button bg-clay text-cream font-sans font-semibold px-10 py-4 rounded-2xl inline-flex items-center gap-3 hover:bg-clay/90 transition-all text-base shadow-lg shadow-clay/25"
          >
            Acceder al Escudo Colaborativo
            <ArrowRight className="w-5 h-5" />
          </button>
        </section>

      </div>
    </div>
  );
};
