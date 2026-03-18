import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a0a0a] rounded-t-[3rem] mt-24 pt-16 pb-8 px-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        <div className="flex flex-col gap-4">
          <span className="font-serif italic text-3xl text-cream">PortalGuanaco</span>
          <p className="font-mono text-xs text-cream/50 max-w-sm uppercase tracking-widest">
            Registro de reputación telefónica para proteger el comercio de El Salvador.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-carbon px-4 py-2 rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-mono text-xs text-cream tracking-widest uppercase">Sistema Operativo</span>
          </div>
          
          <a 
            href="https://sidereai.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-sans text-sm text-cream/70 hover:text-cream transition-colors underline decoration-white/20 underline-offset-4"
          >
            Powered by Sidere AI
          </a>
        </div>
        
      </div>
      
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/5 flex justify-between items-center text-cream/40 font-mono text-xs">
        <span>© {new Date().getFullYear()} PortalGuanaco.</span>
        <span>Privacidad y Protocolo de Seguridad.</span>
      </div>
    </footer>
  );
};
