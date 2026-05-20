import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Crown, Check, X, Zap, Shield, TrendingUp, Bell, Download, Star, ArrowRight, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Explorador',
    price: 'Consultas Limitadas',
    period: '10 / día',
    description: 'Para emprendedores que quieren empezar a protegerse sin compromiso.',
    badge: null,
    buttonLabel: 'Empezar gratis',
    buttonStyle: 'border border-white/10 text-cream hover:border-white/30 hover:bg-white/5',
    features: [
      { label: 'Hasta 10 consultas por día', ok: true },
      { label: 'Reportar números', ok: true },
      { label: 'Historial propio básico', ok: true },
      { label: 'Etiquetas de comportamiento', ok: true },
      { label: 'Exportar reportes (CSV)', ok: false },
      { label: 'Alertas de nuevos reportes', ok: false },
      { label: 'Acceso a API REST', ok: false },
      { label: 'Soporte prioritario', ok: false },
    ],
  },
  {
    name: 'Operador',
    price: '$4.99',
    period: 'al mes',
    description: 'Para vendedores activos que gestionan decenas de pedidos diarios y necesitan herramientas avanzadas.',
    badge: 'Más popular',
    buttonLabel: 'Activar Operador',
    buttonStyle: 'bg-clay text-cream hover:bg-clay/90 shadow-[0_0_30px_rgba(204,88,51,0.3)]',
    features: [
      { label: 'Consultas en web (1,000 consultas/mes)', ok: true },
      { label: 'Reportar números', ok: true },
      { label: 'Historial propio completo', ok: true },
      { label: 'Etiquetas de comportamiento', ok: true },
      { label: 'Exportar reportes (CSV)', ok: true },
      { label: 'Alertas de nuevos reportes', ok: true },
      { label: 'API REST', ok: false },
      { label: 'Soporte prioritario', ok: false },
    ],
  },
  {
    name: 'Red Enterprise',
    price: '$19.99',
    period: 'al mes',
    description: 'Para negocios con equipos de ventas, logística y necesidad de integración técnica.',
    badge: 'Próximamente',
    buttonLabel: 'Contactar',
    buttonStyle: 'border border-clay/30 text-clay hover:bg-clay/10',
    features: [
      { label: 'Consultas en web (5,000 consultas/mes)', ok: true },
      { label: 'Reportar números', ok: true },
      { label: 'Historial propio completo', ok: true },
      { label: 'Etiquetas de comportamiento', ok: true },
      { label: 'Exportar reportes (CSV)', ok: true },
      { label: 'Alertas de nuevos reportes', ok: true },
      { label: 'API REST (5,000 consultas/mes)', ok: true },
      { label: 'Soporte prioritario', ok: true },
    ],
  },
];

const upcomingFeatures = [
  { icon: Bell, title: 'Alertas en Tiempo Real', desc: 'Recibe una notificación al instante cuando un número que consultaste anteriormente recibe un nuevo reporte en la red.' },
  { icon: Download, title: 'Exportación CSV/Excel', desc: 'Descarga tu historial de reportes y consultas en formato de hoja de cálculo para análisis interno o auditorías.' },
  { icon: Zap, title: 'API REST', desc: 'Integra PortalGuanaco directamente en tu sistema de gestión de pedidos o CRM con nuestra API documentada.' },
  { icon: TrendingUp, title: 'Analíticas de Red', desc: 'Dashboard de estadísticas para entender tendencias de fraude en tu zona geográfica y categoría de producto.' },
  { icon: Shield, title: 'Perfil de Reputación Público', desc: 'Muestra tu badge de "Vendedor Verificado" en tus redes sociales como señal de confianza para tus compradores.' },
  { icon: Star, title: 'Prioridad en Reportes', desc: 'Tus reportes tienen mayor peso en el algoritmo de reputación colectiva de la red Premium.' },
];

export const PagePremium: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo('.prem-hero',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.15, ease: 'power3.out', delay: 0.1 }
      );
      gsap.fromTo('.prem-plan',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.prem-plans', start: 'top 75%' } }
      );
      gsap.fromTo('.prem-feature',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.prem-features', start: 'top 80%' } }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen pt-32 pb-24 px-6 max-w-6xl mx-auto">

      {/* ── Hero ── */}
      <div className="mb-24 text-center">
        <div className="prem-hero inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-clay mb-6 px-4 py-2 rounded-full border border-clay/20 bg-clay/5">
          <Crown className="w-3 h-3" />
          Planes y Precios
        </div>
        <h1 className="prem-hero font-sans font-bold text-5xl md:text-7xl text-cream tracking-tight leading-[1.05] mb-8">
          Protección a tu<br />
          <span className="font-serif italic font-light text-clay">medida.</span>
        </h1>
        <p className="prem-hero font-sans text-cream/60 text-lg max-w-2xl mx-auto leading-relaxed">
          Empieza gratis y escala cuando lo necesites. Sin contratos. Sin sorpresas. Cancela en cualquier momento.
        </p>
      </div>

      {/* ── Plans ── */}
      <div className="prem-plans grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`prem-plan relative bg-[#111111] rounded-[2.5rem] p-8 flex flex-col gap-6 transition-all hover:-translate-y-1 duration-300
              ${plan.name === 'Operador' ? 'border border-clay/30 shadow-[0_0_40px_rgba(204,88,51,0.08)]' : 'border border-white/5'}`}
          >
            {plan.badge && (
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest px-4 py-1 rounded-full
                ${plan.badge === 'Más popular' ? 'bg-clay text-cream' : 'bg-white/10 text-cream/50 border border-white/10'}`}>
                {plan.badge}
              </div>
            )}

            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-cream/40 mb-1">{plan.name}</div>
              <div className="flex items-end gap-2 mb-3">
                <span className="font-sans font-bold text-4xl text-cream">{plan.price}</span>
                <span className="font-mono text-xs text-cream/30 pb-1">/ {plan.period}</span>
              </div>
              <p className="font-sans text-sm text-cream/50 leading-relaxed">{plan.description}</p>
            </div>

            <div className="w-full h-px bg-white/5" />

            <div className="flex flex-col gap-3 flex-1">
              {plan.features.map((f) => (
                <div key={f.label} className={`flex items-center gap-3 ${!f.ok ? 'opacity-30' : ''}`}>
                  {f.ok
                    ? <Check className="w-4 h-4 text-green-400 shrink-0" />
                    : <X className="w-4 h-4 text-cream/20 shrink-0" />
                  }
                  <span className="font-sans text-sm text-cream/70">{f.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/auth')}
              className={`w-full py-3.5 rounded-2xl font-sans font-medium text-sm transition-all ${plan.buttonStyle}`}
            >
              {plan.buttonLabel}
            </button>
          </div>
        ))}
      </div>

      {/* ── Upcoming Features ── */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-clay mb-4">Hoja de Ruta</div>
          <h2 className="font-sans font-bold text-4xl text-cream">Lo que viene en Premium.</h2>
          <p className="font-sans text-cream/40 mt-3 max-w-md mx-auto text-sm">
            Estas funciones están en desarrollo activo. Los suscriptores actuales tendrán acceso anticipado.
          </p>
        </div>
        <div className="prem-features grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingFeatures.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="prem-feature bg-[#111111] border border-white/5 rounded-3xl p-6 flex flex-col gap-3 hover:border-clay/20 hover:bg-clay/5 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-carbon border border-white/5 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-clay" />
                </div>
                <h4 className="font-sans font-bold text-cream">{f.title}</h4>
                <p className="font-mono text-[10px] text-cream/40 uppercase tracking-widest leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="bg-[#111111] border border-white/5 rounded-3xl p-10 mb-24">
        <h2 className="font-sans font-bold text-2xl text-cream mb-8 text-center">Preguntas Frecuentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            { q: '¿Necesito tarjeta de crédito para el plan gratis?', a: 'No. El plan Explorador es 100% gratuito y solo requiere verificación de correo electrónico. Tienes hasta 10 consultas diarias sin costo.' },
            { q: '¿Puedo cancelar Premium en cualquier momento?', a: 'Sí. La cancelación es efectiva inmediatamente. No hay penalizaciones ni períodos de aviso.' },
            { q: '¿Los datos de pago están seguros?', a: 'Todos los pagos son procesados por Stripe con cifrado PCI-DSS. PortalGuanaco nunca almacena datos de tarjeta.' },
            { q: '¿Qué pasa con mis reportes si cancelo?', a: 'Tus reportes permanecen en la red. Solo pierdes acceso a las funciones avanzadas como exportación y alertas.' },
          ].map((faq, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <Lock className="w-4 h-4 text-clay mt-0.5 shrink-0" />
                <p className="font-sans font-bold text-cream text-sm">{faq.q}</p>
              </div>
              <p className="font-sans text-sm text-cream/50 leading-relaxed pl-7">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="text-center bg-clay/5 border border-clay/10 rounded-3xl p-12">
        <Crown className="w-10 h-10 text-clay mx-auto mb-6" />
        <h2 className="font-sans font-bold text-3xl text-cream mb-4">Empieza gratis hoy.</h2>
        <p className="font-sans text-cream/50 mb-8 max-w-md mx-auto">
          Sin compromiso. Sin tarjeta. Solo tu correo y estarás protegiendo tu negocio en minutos.
        </p>
        <button
          onClick={() => navigate('/auth')}
          className="magnetic-button bg-clay text-cream px-10 py-4 rounded-2xl font-sans font-medium flex items-center gap-2 mx-auto"
        >
          Crear cuenta gratis
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
