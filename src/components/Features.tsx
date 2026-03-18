import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Zap, Lock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Micro-UI 1: Shuffler
const PrivacyShuffler = () => {
  const [text, setText] = useState('+503 7234 5678');
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (!isHovered) {
      setText('+503 7234 5678');
      return;
    }
    
    let interval: number;
    const chars = '0123456789*#';
    let iterations = 0;
    
    interval = window.setInterval(() => {
      setText(prev => 
        prev.split('').map((char, index) => {
          if (char === ' ' || char === '+') return char;
          if (index < iterations) return prev[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      
      iterations += 1/3;
      if (iterations >= 12) {
        clearInterval(interval);
        setText('+503 **** ****');
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div 
      className="bg-carbon/50 border border-white/5 rounded-2xl p-6 h-32 flex flex-col justify-center items-center cursor-crosshair transition-colors hover:bg-carbon/80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="font-mono text-xl tracking-widest text-clay">{text}</div>
      <div className="text-[0.65rem] uppercase tracking-widest text-cream/30 mt-2 font-mono">
        {isHovered ? 'PROCESANDO ENCRIPTACIÓN' : 'HOVER PARA ENCRIPTAR'}
      </div>
    </div>
  );
};

// Micro-UI 2: Typewriter
const InstantTypewriter = () => {
  const [lines, setLines] = useState<string[]>([]);
  
  useEffect(() => {
    const protocolLogs = [
      "INICIANDO PROTOCOLO SIDERE...",
      "VERIFICANDO FIRMA DE RED...",
      "CONSULTANDO REGISTRO DE FRAUDE...",
      "RESULTADO: MATCH ENCONTRADO (99.8%)",
      "ESTADO: BLOQUEADO."
    ];
    
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < protocolLogs.length) {
        const lineToAdd = protocolLogs[currentLine];
        setLines(prev => {
          const newLines = [...prev, lineToAdd];
          if (newLines.length > 3) newLines.shift();
          return newLines;
        });
        currentLine++;
      } else {
        currentLine = 0;
        setLines([]);
      }
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-carbon/50 border border-white/5 rounded-2xl p-4 h-32 flex flex-col justify-end overflow-hidden font-mono text-xs">
      {lines.map((line, i) => (
        <div 
          key={i} 
          className={`mb-1 ${i === lines.length - 1 ? 'text-green-500' : 'text-cream/40'} ${line?.includes && line.includes('BLOQUEADO') ? 'text-red-500 font-bold' : ''}`}
        >
          &gt; {line}
        </div>
      ))}
      <div className="w-2 h-3 bg-cream animate-pulse mt-1"></div>
    </div>
  )
};

// Micro-UI 3: Scheduler
const SpeedScheduler = () => {
  return (
    <div className="bg-carbon/50 border border-white/5 rounded-2xl p-6 h-32 flex justify-between items-center relative overflow-hidden group">
      <div className="flex flex-col gap-2 relative z-10 w-full">
        <div className="flex justify-between items-center w-full">
          <span className="font-mono text-xs text-cream/40">LATENCIA DE RED</span>
          <span className="font-mono text-xs text-cream font-bold">12ms</span>
        </div>
        <div className="w-full bg-carbon rounded-full h-1 overflow-hidden relative">
           <div className="absolute top-0 left-0 h-full bg-clay w-full transform -translate-x-[90%] group-hover:translate-x-0 transition-transform duration-1000 ease-out"></div>
        </div>
        <div className="flex justify-between items-center w-full mt-2">
           <span className="font-mono text-xs text-cream/40">TIEMPO DE CONSULTA</span>
           <span className="font-mono text-xs text-cream font-bold">&lt; 0.1s</span>
        </div>
      </div>
    </div>
  )
};

export const Features: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.feature-card', 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-32 px-6 w-full max-w-6xl mx-auto relative z-10">
      
      <div className="mb-20">
        <h2 className="font-sans font-bold text-3xl md:text-5xl text-cream tracking-tight max-w-2xl">
          Ecosistema aislado para la <span className="font-serif italic font-light text-clay">seguridad comercial.</span>
        </h2>
        <p className="mt-6 font-mono text-sm text-cream/50 max-w-xl uppercase tracking-widest leading-relaxed">
          Diseñado con estándares de grado militar para proteger tus operaciones y datos de clientes ante la creciente ola de fraude digital.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="feature-card bg-[#151515] border border-white/5 rounded-[2.5rem] p-8 flex flex-col gap-8 transition-colors hover:border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-carbon rounded-full border border-white/5">
               <Lock className="w-6 h-6 text-cream" />
            </div>
            <h3 className="font-sans font-semibold text-lg text-cream">Privacidad Total</h3>
          </div>
          <p className="font-mono text-xs text-cream/60 leading-relaxed uppercase tracking-wider">
            Arquitectura Freemium de ofuscación de datos. Entidades externas no pueden extraer el comportamiento de tus clientes ni leer historiales precisos sin autorización explícita.
          </p>
          <div className="mt-auto pt-4">
            <PrivacyShuffler />
          </div>
        </div>

        {/* Card 2 */}
        <div className="feature-card bg-[#151515] border border-white/5 rounded-[2.5rem] p-8 flex flex-col gap-8 transition-colors hover:border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-carbon rounded-full border border-white/5">
               <ShieldCheck className="w-6 h-6 text-cream" />
            </div>
            <h3 className="font-sans font-semibold text-lg text-cream">Validación Instantánea</h3>
          </div>
          <p className="font-mono text-xs text-cream/60 leading-relaxed uppercase tracking-wider">
             Motor de validación cruzada. Al ingresar un número, ejecutamos comprobaciones en tiempo real para retornar el vector de reputación antes de que empaquetes tus despachos.
          </p>
          <div className="mt-auto pt-4">
            <InstantTypewriter />
          </div>
        </div>

        {/* Card 3 */}
        <div className="feature-card bg-[#151515] border border-white/5 rounded-[2.5rem] p-8 flex flex-col gap-8 transition-colors hover:border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-carbon rounded-full border border-white/5">
               <Zap className="w-6 h-6 text-cream" />
            </div>
            <h3 className="font-sans font-semibold text-lg text-cream">Rapidez de Decisión</h3>
          </div>
          <p className="font-mono text-xs text-cream/60 leading-relaxed uppercase tracking-wider">
            La inteligencia de riesgo no sirve de nada si tienes que esperar. Infraestructura optimizada en el borde (edge) para respuestas en menos de 100ms.
          </p>
          <div className="mt-auto pt-4">
            <SpeedScheduler />
          </div>
        </div>

      </div>
    </section>
  );
};
