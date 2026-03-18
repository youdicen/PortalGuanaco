import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Philosophy: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.philosophy-text', 
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.2, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="philosophy" className="py-32 relative w-full overflow-hidden mt-12 bg-carbon">
      
      {/* Organic Texture Parallax Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed opacity-10"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1544468641-da151b75c808?q=80&w=2574&auto=format&fit=crop")',
        }}
      ></div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 items-center">
        
        {/* Left: The Vision */}
        <div className="flex flex-col gap-6">
          <h3 className="philosophy-text font-mono text-xs uppercase tracking-[0.2em] text-clay">La Filosofía Sidere</h3>
          <h2 className="philosophy-text font-serif italic text-4xl md:text-5xl lg:text-6xl text-cream leading-tight">
            No somos un directorio. <br />
            Somos un <span className="text-clay">escudo</span>.
          </h2>
          <div className="philosophy-text w-12 h-px bg-white/20 my-4"></div>
          <p className="philosophy-text font-sans text-cream/70 leading-relaxed">
            Las plataformas tradicionales exponen datos sin control, permitiendo la extracción masiva por actores maliciosos. En <span className="text-cream font-bold">PortalGuanaco</span>, transformamos la prevención de fraude en El Salvador bajo una arquitectura de confianza cero.
          </p>
          <p className="philosophy-text font-sans text-cream/70 leading-relaxed mt-2">
            Respaldados por la inteligencia algorítmica de <a href="https://sidereai.com/" target="_blank" rel="noopener noreferrer" className="text-clay underline decoration-clay/40 underline-offset-4 hover:text-white transition-colors">Sidere AI</a>, ofrecemos a los emprendedores una herramienta implacable contra los malos clientes y las estafas logísticas.
          </p>
        </div>

        {/* Right: The Contrast Data */}
        <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 flex flex-col gap-8 shadow-2xl">
          
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#E63B2E]">ENFOQUE INDUSTRIAL GENÉRICO</span>
            <p className="font-sans text-sm text-cream/50">Bases de datos públicas, scraping fácil, falta de verificación de quienes reportan, y modelos de negocio basados en vender los datos de tus clientes.</p>
          </div>

          <div className="w-full h-px bg-white/5"></div>

          <div className="flex flex-col gap-2 relative">
            <div className="absolute -left-3 top-0 bottom-0 w-[2px] bg-clay"></div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-clay ml-2">ENFOQUE PORTALGUANACO</span>
            <p className="font-sans text-sm text-cream ml-2">Inteligencia de riesgo anónima. Validación cruzada de reportes. Privacidad asimétrica: tú ves las advertencias, los atacantes no ven tu base de datos.</p>
          </div>

        </div>

      </div>
    </section>
  );
};
