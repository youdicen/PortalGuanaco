import React, { useEffect } from 'react';
import { Shield, Cookie } from 'lucide-react';
import { BackToTop } from './BackToTop';

export const PageCookies: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1A1A] pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #F2F0E9 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#CC5833]/10 flex items-center justify-center border border-[#CC5833]/20">
              <Cookie className="w-6 h-6 text-[#CC5833]" />
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#CC5833]/50 to-transparent" />
          </div>
          <h1 className="font-sans text-5xl md:text-7xl font-bold text-cream tracking-tight mb-6">
            Política de <span className="text-[#CC5833]">Cookies</span>
          </h1>
          <p className="font-mono text-sm text-cream/50 uppercase tracking-widest">
            Última actualización: Mayo 2026 | Nivel de Transparencia: Máximo
          </p>
        </header>

        <article className="prose prose-invert prose-lg max-w-none prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-p:font-sans prose-p:text-cream/70 prose-a:text-[#CC5833]">
          <p className="text-xl leading-relaxed text-cream/90 font-light mb-12">
            En Portal Guanaco creemos en la transparencia operativa. Utilizamos cookies y tecnologías similares no para rastrear su vida personal, sino para asegurar el rendimiento crítico de nuestro motor de validación y la seguridad de las sesiones.
          </p>

          <h2 className="text-3xl text-cream mt-12 mb-6">1. ¿Qué son las Cookies Operativas?</h2>
          <p>
            Las cookies son pequeños fragmentos de datos cifrados que se almacenan en su dispositivo. A diferencia de las plataformas publicitarias, nuestro sistema utiliza cookies exclusivamente como "testigos de estado". Nos permiten recordar su sesión segura y preferencias técnicas mientras interactúa con la terminal de validación.
          </p>

          <h2 className="text-3xl text-cream mt-12 mb-6">2. Clasificación de Datos Almacenados</h2>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 my-8">
            <h3 className="text-xl text-[#CC5833] mt-0 mb-4 flex items-center gap-3">
              <Shield className="w-5 h-5" />
              Cookies Estrictamente Necesarias (Obligatorias)
            </h3>
            <p className="mb-0 text-sm">
              Requeridas para la arquitectura base de la plataforma. Incluyen tokens de sesión (`PHPSESSID`), identificadores CSRF y registro de aceptación de políticas (`guanaco_cookies_accepted`). Sin estas cookies, el acceso a la base de datos B2B sería imposible por protocolos de seguridad.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 my-8">
            <h3 className="text-xl text-cream mt-0 mb-4 flex items-center gap-3">
              <Cookie className="w-5 h-5 text-cream/50" />
              Cookies de Telemetría (Opcionales pero recomendadas)
            </h3>
            <p className="mb-0 text-sm">
              Utilizamos herramientas de análisis anónimas para medir la latencia de las consultas a la API (el objetivo de &lt;0.1s) y detectar cuellos de botella en la red. No almacenamos IP completas ni datos que lo identifiquen personalmente.
            </p>
          </div>

          <h2 className="text-3xl text-cream mt-12 mb-6">3. Gestión y Control</h2>
          <p>
            Usted mantiene control total sobre su huella digital en nuestra plataforma. Puede borrar las cookies en cualquier momento desde la configuración de su navegador. Sin embargo, tenga en cuenta que al borrar las cookies de sesión, será desconectado inmediatamente del Terminal de Operador B2B.
          </p>

          <h2 className="text-3xl text-cream mt-12 mb-6">4. Actualizaciones del Protocolo</h2>
          <p>
            Esta política está sujeta a iteraciones técnicas conforme evoluciona nuestra arquitectura de Inteligencia de Riesgos Colaborativa. Cualquier cambio sustancial en la forma en que manejamos el estado del cliente será notificado activamente a través del dashboard de operadores.
          </p>

          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="font-mono text-xs text-cream/40 text-center uppercase tracking-widest">
              Fin de la Transmisión de Política.
            </p>
          </div>
        </article>
      </div>
      <BackToTop />
    </div>
  );
};
