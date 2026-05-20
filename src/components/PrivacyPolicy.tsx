import React, { useEffect } from 'react';
import { Shield, ArrowLeft, Lock, Scale, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.policy-content', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-carbon text-cream font-sans selection:bg-clay selection:text-cream">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-24 relative z-10">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-clay hover:text-clay/80 transition-colors mb-12 group policy-content"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs uppercase tracking-widest">Volver al Portal</span>
        </button>

        <header className="mb-16 policy-content">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-[#32CD32]" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Política de Privacidad</h1>
          </div>
          <p className="text-cream/50 font-mono text-sm uppercase tracking-widest">Última actualización: Abril 2026</p>
        </header>

        <div className="space-y-12 text-cream/80 leading-relaxed">
          
          <section className="policy-content">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5 text-clay" />
              <h2 className="text-xl font-bold text-cream">Propósito de la Plataforma</h2>
            </div>
            <p>
              PortalGuanaco opera como una red colaborativa diseñada para el intercambio de información entre comerciantes y profesionales en El Salvador. Nuestro objetivo es mitigar riesgos comerciales mediante la identificación de historiales de comportamiento reportados por la comunidad.
            </p>
          </section>

          <section className="policy-content">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-clay" />
              <h2 className="text-xl font-bold text-cream">Tratamiento de Datos</h2>
            </div>
            <p>
              Los datos procesados consisten principalmente en números telefónicos y etiquetas de categorización de riesgo (telemetría). PortalGuanaco no asocia estos números con identidades personales completas de forma pública, limitándose a la validación de historiales de reportes.
            </p>
          </section>

          <section className="policy-content bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-clay" />
              <h2 className="text-2xl font-bold text-cream underline decoration-clay underline-offset-8">Descargo de Responsabilidad (Disclaimer)</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base italic">
              <p>
                <strong>Naturaleza Colaborativa:</strong> PortalGuanaco es una herramienta de consulta basada exclusivamente en reportes suministrados por usuarios terceros. No ejercemos una verificación de campo exhaustiva sobre cada denuncia individual.
              </p>
              <p>
                <strong>Uso de la Información:</strong> Los resultados obtenidos son de carácter informativo y referencial. PortalGuanaco no se hace responsable por decisiones comerciales, financieras o legales tomadas por los usuarios basándose en los datos presentados en este portal.
              </p>
              <p>
                <strong>Exactitud:</strong> La exactitud de los reportes depende de la veracidad de la comunidad. Invitamos a los usuarios a contrastar la información con otros medios de validación antes de proceder con transacciones críticas.
              </p>
            </div>
          </section>

          <section className="policy-content">
            <h2 className="text-xl font-bold text-cream mb-4">Seguridad y Cookies</h2>
            <p>
              Implementamos Google reCAPTCHA v2 para proteger nuestra infraestructura contra ataques automatizados. Utilizamos cookies técnicas esenciales para mantener la sesión del usuario y garantizar una experiencia de navegación fluida y segura.
            </p>
          </section>

          <footer className="pt-12 border-t border-white/5 policy-content">
            <p className="text-xs text-cream/30 font-mono uppercase tracking-[0.2em] text-center">
              PortalGuanaco — Transparencia Colaborativa para El Salvador.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};
