import React, { useState } from 'react';
import { Search, Star, AlertCircle, EyeOff, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const SearchProtocol: React.FC = () => {
  const [countryCode, setCountryCode] = useState('+503');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null); // "null", "not_found", or object
  const [hasSearched, setHasSearched] = useState(false);

  // Demo Premium Status (Manejado luego por Auth / Supabase)
  const isPremium = false; 

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    setIsSearching(true);
    setHasSearched(false);
    
    try {
      const cleanCountryCode = countryCode.replace('+', '');
      
      const { data, error } = await supabase
        .from('phone_records')
        .select(`
          country_code,
          phone_number,
          reputation_stars,
          created_at,
          tags:phone_tags(tag_name)
        `)
        .eq('country_code', cleanCountryCode)
        .eq('phone_number', phoneNumber)
        .neq('is_hidden', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Agrupar datos si hay múltiples reportes activos del mismo número
        const totalStars = data.reduce((acc, curr) => acc + curr.reputation_stars, 0);
        const avgStars = Math.round(totalStars / data.length);
        
        const allTags = data.flatMap(r => r.tags?.map((t: any) => t.tag_name) || []);
        const uniqueTags = [...new Set(allTags)];

        setSearchResult({
          country_code: '+' + data[0].country_code,
          phone_number: data[0].phone_number,
          reputation_stars: avgStars,
          tags: uniqueTags,
          created_at: data[0].created_at // Como lo ordenamos por ascending, el [0] es el más antiguo
        });
      } else {
        setSearchResult("not_found");
      }
    } catch (err) {
      console.error('Error al realizar la consulta:', err);
      setSearchResult("not_found");
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  return (
    <section id="protocol" className="py-24 px-6 w-full max-w-4xl mx-auto relative z-10 flex flex-col items-center">
      
      <div className="text-center mb-16">
        <h2 className="font-sans font-bold text-3xl md:text-5xl text-cream tracking-tight">
          Protocolo de Consulta
        </h2>
        <p className="mt-4 font-mono text-xs md:text-sm text-cream/50 uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
          Ingresa un número exacto para obtener el análisis de riesgo.
        </p>
      </div>

      <div className="w-full bg-[#111111] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <form onSubmit={handleSearch} className="relative z-10 flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex bg-carbon border border-white/10 rounded-2xl overflow-hidden focus-within:border-clay/50 transition-colors w-full md:w-3/4">
            <select 
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="bg-transparent text-cream px-4 py-4 font-mono text-sm border-r border-white/5 outline-none appearance-none cursor-pointer"
            >
              <option value="+503" className="bg-carbon">+503 (SV)</option>
              <option value="+502" className="bg-carbon">+502 (GT)</option>
              <option value="+504" className="bg-carbon">+504 (HN)</option>
            </select>
            <input 
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 15))}
              placeholder="Ej. 78918905"
              className="bg-transparent text-cream px-6 py-4 font-mono text-lg w-full outline-none placeholder:text-cream/20"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isSearching || !phoneNumber}
            className="magnetic-button bg-cream text-carbon px-8 py-4 font-sans font-bold text-sm md:w-1/4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cream/90 transition-colors"
          >
            {isSearching ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-carbon border-t-transparent animate-spin"></div>
                BUSCANDO
              </span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                VERIFICAR
              </>
            )}
          </button>
        </form>

        {/* Results Area */}
        <div className="relative z-10 min-h-[300px] flex flex-col items-center justify-center border-t border-white/5 pt-12">
          
          {!hasSearched && !isSearching && (
             <div className="flex flex-col items-center gap-4 opacity-30">
               <ShieldAlert className="w-12 h-12 text-cream" />
               <p className="font-mono text-xs uppercase tracking-widest text-center">Protocolo en espera de parámetros de búsqueda.</p>
             </div>
          )}

          {isSearching && (
             <div className="flex flex-col items-center gap-4">
               <p className="font-mono text-xs uppercase tracking-[0.3em] text-clay animate-pulse">ANALIZANDO RED...</p>
             </div>
          )}

          {hasSearched && searchResult === "not_found" && (
            <div className="flex flex-col items-center gap-4 bg-carbon/50 p-8 rounded-3xl border border-white/5 w-full">
               <AlertCircle className="w-10 h-10 text-cream/50" />
               <p className="font-sans text-lg text-cream">No se encontró información negativa.</p>
               <p className="font-mono text-xs text-cream/40 uppercase tracking-widest text-center">Este número no cuenta con reportes cruzados en nuestra base de datos actual.</p>
            </div>
          )}

          {hasSearched && searchResult !== "not_found" && searchResult !== null && (
            <div className="w-full flex gap-6 flex-col lg:flex-row">
               
               {/* Left: Public Data (Stars & Partial Phone) */}
               <div className="bg-[#1A1A1A] border border-red-500/20 rounded-3xl p-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
                  
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-cream/50 mb-6">Vector de Reputación</h4>
                  
                  <div className="font-mono text-3xl md:text-5xl text-cream mb-8">
                     {searchResult.country_code} <span className="opacity-40">{searchResult.phone_number.slice(0, 4)}</span>****
                  </div>

                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-8 h-8 ${star <= searchResult.reputation_stars ? 'text-clay fill-clay' : 'text-white/10'}`} 
                      />
                    ))}
                  </div>
                  <span className="font-sans font-bold text-sm text-clay mt-4">{searchResult.reputation_stars} de 5 Estrellas</span>
               </div>

               {/* Right: Freemium / Protected Data */}
               <div className="bg-[#151515] border border-white/5 rounded-3xl p-8 flex-1 relative flex flex-col justify-center overflow-hidden group">
                  
                  {/* The actual confidential info that gets blurred if not premium */}
                  <div className={`${!isPremium ? 'premium-blur select-none' : ''} flex flex-col gap-6`}>
                     <div>
                        <h5 className="font-mono text-xs text-cream/40 mb-2">ETIQUETAS IDENTIFICADAS</h5>
                        <div className="flex flex-wrap gap-2">
                          {searchResult.tags.map((tag: string, i: number) => (
                             <span key={i} className="bg-red-500/10 text-red-400 border border-red-500/20 font-mono text-xs px-3 py-1 rounded-full uppercase">
                                {tag}
                             </span>
                          ))}
                        </div>
                     </div>
                     
                     <div className="border-t border-white/5 pt-4">
                        <h5 className="font-mono text-xs text-cream/40 mb-1">FECHA PRIMER REPORTE</h5>
                        <span className="font-sans text-cream/80">{new Date(searchResult.created_at).toLocaleDateString()}</span>
                     </div>
                  </div>

                  {!isPremium && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-carbon/40 backdrop-blur-[2px] p-6 text-center">
                       <EyeOff className="w-8 h-8 text-cream/50 mb-4" />
                       <h4 className="font-sans font-bold text-lg text-cream mb-2">Datos Censurados</h4>
                       <p className="font-mono text-[10px] text-cream/60 uppercase tracking-widest mb-6 max-w-xs leading-relaxed">
                         El detalle de etiquetas y perfil completo requiere autorización biométrica o acceso premium certificado.
                       </p>
                       <a href="https://wa.me/50378918905?text=Deseo%20solicitar%20Acceso%20Premium%20para%20PortalGuanaco" target="_blank" rel="noopener noreferrer" className="magnetic-button bg-clay text-cream px-6 py-3 font-sans font-bold text-xs uppercase tracking-wider hover:bg-clay/80">
                         Solicitar Llave Premium
                       </a>
                    </div>
                  )}

               </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
};
