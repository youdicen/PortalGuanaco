import React, { useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles } from 'lucide-react';
import gsap from 'gsap';

export const PageContact: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-hero-item', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
      );

      gsap.fromTo('.contact-card',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-carbon pt-32 pb-24 overflow-hidden relative">
      
      {/* ── Background Noise & FX ── */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full opacity-30">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-clay/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-moss/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-6xl mx-auto px-8 relative z-10">
        
        {/* ── Hero ── */}
        <div className="max-w-3xl mb-24">
          <div className="contact-hero-item inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clay/10 border border-clay/20 text-clay font-mono text-xs uppercase tracking-wide mb-6">
            <Sparkles className="w-3 h-3" />
            Canales de Enlace
          </div>
          <h1 className="contact-hero-item font-sans font-bold text-5xl md:text-7xl text-cream tracking-tight leading-[0.9] mb-8">
            Contacto <br />
            <span className="font-serif italic font-normal text-clay">Directo.</span>
          </h1>
          <p className="contact-hero-item font-sans text-sm text-cream/60 leading-relaxed max-w-sm">
            Estamos aquí para resolver dudas técnicas, reportes preventivos o consultas de integración.
          </p>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-24">
          
          {/* El Salvador */}
          <div className="contact-card group bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] hover:border-clay/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-clay/10 border border-clay/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5 text-clay" />
            </div>
            <h4 className="font-mono text-xs uppercase tracking-wide text-cream/50 mb-1">Puerto SV</h4>
            <div className="font-sans text-lg text-cream font-bold mb-4 tracking-tight">+503 6220-0921</div>
            <a href="tel:+50362200921" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-clay">Enlace <Send className="w-3 h-3" /></a>
          </div>

          {/* WhatsApp */}
          <div className="contact-card group bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:border-clay/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5 text-[#25D366]" />
            </div>
            <h4 className="font-mono text-xs uppercase tracking-wide text-cream/50 mb-1">WhatsApp Business</h4>
            <div className="font-sans text-lg text-cream font-bold mb-4 tracking-tight">Soporte Inmediato</div>
            <a href="https://wa.me/50362200921" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-[#25D366]">Chat <Send className="w-3 h-3" /></a>
          </div>

          {/* Telegram */}
          <div className="contact-card group bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:border-clay/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#0088cc]/10 border border-[#0088cc]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Send className="w-5 h-5 text-[#0088cc]" />
            </div>
            <h4 className="font-mono text-xs uppercase tracking-wide text-cream/50 mb-1">Telegram Secure</h4>
            <div className="font-sans text-lg text-cream font-bold mb-4 tracking-tight">Portal Central</div>
            <a href="https://t.me/portalguanaco" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-[#0088cc]">Canal <Send className="w-3 h-3" /></a>
          </div>

          {/* USA */}
          <div className="contact-card group bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:border-clay/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-clay/10 border border-clay/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5 text-clay" />
            </div>
            <h4 className="font-mono text-xs uppercase tracking-wide text-cream/50 mb-1">Puerto US</h4>
            <div className="font-sans text-lg text-cream font-bold mb-4 tracking-tight">+1 (817) 402-1579</div>
            <a href="tel:+18174021579" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-clay">Enlace <Send className="w-3 h-3" /></a>
          </div>

          {/* Email */}
          <div className="contact-card group bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:border-clay/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-clay/10 border border-clay/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5 text-clay" />
            </div>
            <h4 className="font-mono text-xs uppercase tracking-wide text-cream/50 mb-1">Email Central</h4>
            <div className="font-sans text-xs text-cream font-bold mb-4 tracking-tight truncate">soporte@portalguanaco.com</div>
            <a href="mailto:soporte@portalguanaco.com" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-clay">Mensaje <Send className="w-3 h-3" /></a>
          </div>

        </div>

        {/* ── Sub Hero Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center border-t border-white/5 pt-24">
          <div>
            <h2 className="font-sans font-bold text-4xl text-cream tracking-tight mb-8">
              ¿Por qué contactar con <br />
              <span className="text-clay">nuestro equipo?</span>
            </h2>
            <div className="space-y-6">
              {[
                { title: 'Soporte de Integración', desc: 'Ayuda para conectar tu sistema logístico con nuestra API de validación.' },
                { title: 'Reportes Especiales', desc: 'Si necesitas escalar un caso de fraude masivo o coordinar con autoridades.' },
                { title: 'Propuestas de Mejora', desc: 'Sugerencias para fortalecer la red y nuevas características de telemetría.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-px h-12 bg-clay/30 mt-1"></div>
                  <div>
                    <h5 className="font-mono text-xs uppercase tracking-widest text-cream mb-1">{item.title}</h5>
                    <p className="font-sans text-sm text-cream/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-clay/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <MessageSquare className="w-12 h-12 text-clay/20 mb-8" />
             <h3 className="font-sans font-bold text-2xl text-cream mb-4 tracking-tight">Consultas Rápidas</h3>
             <p className="font-sans text-sm text-cream/60 leading-relaxed mb-8">
               Generalmente respondemos en menos de 24 horas hábiles a través de nuestros canales oficiales.
             </p>
             <div className="flex flex-col gap-4">
               <div className="flex items-center gap-3 py-3 border-b border-white/5">
                 <MapPin className="w-4 h-4 text-clay" />
                 <span className="font-mono text-[10px] uppercase tracking-widest text-cream/70">San Salvador, El Salvador</span>
               </div>
               <div className="flex items-center gap-3 py-3 border-b border-white/5">
                 <Sparkles className="w-4 h-4 text-clay" />
                 <span className="font-mono text-[10px] uppercase tracking-widest text-cream/70">Powered by Sidere AI</span>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};
