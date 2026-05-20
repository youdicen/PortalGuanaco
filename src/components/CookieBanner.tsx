import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('guanaco_cookies_accepted');
    if (!hasAccepted) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      gsap.fromTo('.cookie-banner',
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [isVisible]);

  const handleAccept = () => {
    localStorage.setItem('guanaco_cookies_accepted', 'true');
    gsap.to('.cookie-banner', {
      y: 100,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.in',
      onComplete: () => setIsVisible(false)
    });
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 p-6 bg-[#1A1A1A]/95 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-sans font-bold text-cream text-lg tracking-tight mb-2">Protocolo de Cookies</h3>
          <p className="font-sans text-xs text-cream/60 leading-relaxed">
            Utilizamos cookies operativas para mantener sesiones seguras y métricas de rendimiento anónimas. Esto asegura la máxima precisión en nuestro motor de validación.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={handleAccept}
          className="flex-1 bg-[#CC5833] text-white font-mono text-[11px] uppercase tracking-widest py-3 px-4 rounded-xl hover:scale-[1.03] active:scale-95 transition-transform"
        >
          Aceptar Todas
        </button>
        <Link
          to="/cookies"
          className="flex-1 text-center bg-white/5 text-cream font-mono text-[11px] uppercase tracking-widest py-3 px-4 rounded-xl hover:bg-white/10 transition-colors"
        >
          Leer Política
        </Link>
      </div>
    </div>
  );
};
