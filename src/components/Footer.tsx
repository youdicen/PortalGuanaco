import React from 'react';
import { Shield, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#080a09] rounded-t-[4rem] mt-32 pt-24 pb-12 px-8 border-t border-white/5 overflow-hidden">
      
      {/* ── Background Ambient ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-moss/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 items-start relative z-10">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-cream" />
            <span className="font-sans font-bold text-2xl tracking-tighter text-cream">PortalGuanaco</span>
          </div>
          <p className="font-sans text-sm text-cream/55 max-w-sm leading-relaxed">
            La primera red colaborativa de Inteligencia de Riesgos de El Salvador.
            Protegiendo a cada emprendedor honesto — pedido por pedido.
          </p>
          
          <div className="flex items-center gap-4 mt-4">
             <div className="flex items-center gap-3 bg-carbon/50 pl-2 pr-5 py-2 rounded-full border border-white/5 transition-colors hover:border-clay/30 group">
                <div className="relative flex items-center justify-center">
                   <div className="w-2.5 h-2.5 rounded-full bg-clay animate-pulse"></div>
                   <div className="absolute w-2.5 h-2.5 rounded-full bg-clay animate-ping opacity-40"></div>
                </div>
                <div className="flex flex-col">
                   <span className="font-mono text-xs uppercase tracking-wide text-cream/50">Estado del Sistema</span>
                   <span className="font-mono text-xs uppercase tracking-wide text-cream group-hover:text-clay transition-colors">Operativo y Protegido</span>
                </div>
             </div>
          </div>
        </div>

        {/* Links / Info Columns */}
        <div className="flex flex-col gap-6">
          <h4 className="font-mono text-xs uppercase tracking-wide text-cream/50">Plataforma</h4>
          <ul className="flex flex-col gap-3">
             <li key="Protocolo">
                <Link to="/protocolo" className="font-sans text-sm text-cream/50 hover:text-clay transition-colors">
                   Protocolo
                </Link>
             </li>
             <li key="Características">
                <Link to="/caracteristicas" className="font-sans text-sm text-cream/50 hover:text-clay transition-colors">
                   Características
                </Link>
             </li>
             <li key="Filosofía">
                <Link to="/filosofia" className="font-sans text-sm text-cream/50 hover:text-clay transition-colors">
                   Filosofía
                </Link>
             </li>
             <li key="Premium">
                <Link to="/premium" className="font-sans text-sm text-cream/50 hover:text-clay transition-colors">
                   Premium
                </Link>
             </li>
             <li key="Contacto">
                <Link to="/contacto" className="font-sans text-sm text-cream/50 hover:text-clay transition-colors">
                   Contacto
                </Link>
             </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="flex flex-col gap-6">
          <h4 className="font-mono text-xs uppercase tracking-wide text-cream/50">Contacto Directo</h4>
          <div className="flex flex-col gap-4">
            <a href="mailto:soporte@portalguanaco.com" className="group flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-clay/30 transition-colors">
                <Mail className="w-3.5 h-3.5 text-cream/40 group-hover:text-clay transition-colors" />
              </div>
              <span className="font-mono text-xs text-cream/70 group-hover:text-cream transition-colors">soporte@portalguanaco.com</span>
            </a>
            <a href="tel:+50362200921" className="group flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-clay/30 transition-colors">
                <Phone className="w-3.5 h-3.5 text-cream/50 group-hover:text-clay transition-colors" />
              </div>
              <span className="font-mono text-xs text-cream/70 group-hover:text-cream transition-colors">SV: +503 6220-0921</span>
            </a>
            <a href="tel:+18174021579" className="group flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-clay/30 transition-colors">
                <Phone className="w-3.5 h-3.5 text-cream/50 group-hover:text-clay transition-colors" />
              </div>
              <span className="font-mono text-xs text-cream/70 group-hover:text-cream transition-colors">US: +1 (817) 402-1579</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="font-mono text-xs uppercase tracking-wide text-cream/50">Tecnología</h4>
          <div className="flex flex-col gap-4">
            <a 
              href="https://sidereai.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex flex-col pt-1"
            >
              <span className="font-mono text-xs uppercase tracking-wide text-cream/50 group-hover:text-clay transition-colors">Impulsado por</span>
              <span className="font-serif italic text-lg text-cream group-hover:translate-x-1 transition-transform">Sidere AI</span>
            </a>
            <div className="w-8 h-px bg-white/5"></div>
            <p className="font-mono text-xs uppercase tracking-wide text-cream/40">NODO CENTRAL: SAN SALVADOR, SV</p>
          </div>
        </div>
        
      </div>
      
      <div className="max-w-6xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-cream/50 font-mono text-xs uppercase tracking-wide">
        <div className="flex gap-8">
           <span>© {new Date().getFullYear()} PortalGuanaco · Impulsado por Sidere AI</span>
           <span className="hidden md:inline text-white/5">|</span>
           <span>Construido en El Salvador. Escalando a Latinoamérica.</span>
         </div>
         <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-cream transition-colors">Privacidad</Link>
            <Link to="/cookies" className="hover:text-cream transition-colors">Cookies</Link>
            <Link to="/protocolo" className="hover:text-cream transition-colors">Protocolos</Link>
         </div>
       </div>
     </footer>
  );
};
