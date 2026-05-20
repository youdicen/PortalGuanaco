import React, { useState } from 'react';
import { Search, Star, AlertCircle, PlusCircle, MessageCircle, ShieldAlert } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { getTagBadgeClass } from '../lib/tags';
import { useNavigate } from 'react-router-dom';
import { hasReachedLimit, incrementQueryCount, getRemainingQueries, MAX_DAILY } from '../lib/queryLimit';

const WA_LINK = 'https://wa.me/50362200921?text=Hola%2C%20me%20interesan%20los%20planes%20de%20PortalGuanaco.';

// ── Daily Limit Modal ─────────────────────────────────────────────────────────
const LimitModal: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    <div className="bg-[#111111] border border-clay/30 rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl shadow-black/60 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 rounded-full bg-clay/10 border border-clay/20 flex items-center justify-center mx-auto mb-6">
        <ShieldAlert className="w-8 h-8 text-clay" />
      </div>
      <h2 className="font-sans font-bold text-2xl text-cream mb-3">Límite Gratuito Diario Alcanzado</h2>
      <p className="font-sans text-sm text-cream/60 leading-relaxed mb-2">
        Has alcanzado el máximo de {MAX_DAILY} consultas gratuitas del día.
      </p>
      <p className="font-sans text-sm text-cream/60 leading-relaxed mb-8">
        Tu límite se restablece automáticamente mañana a las 00:00. Para consultas ilimitadas, contacta a nuestro equipo comercial.
      </p>
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-3 w-full bg-[#25D366] text-white px-6 py-4 rounded-2xl font-sans font-bold text-sm hover:bg-[#20b858] transition-all shadow-lg shadow-[#25D366]/20"
      >
        <MessageCircle className="w-5 h-5" />
        Contactar Equipo Comercial por WhatsApp
      </a>
      <p className="font-mono text-xs text-cream/40 uppercase tracking-wide mt-6">
        planes premium disponibles — sin contrato
      </p>
    </div>
  </div>
);

// ── sendQueryLog ──────────────────────────────────────────────────────────────
async function sendQueryLog(countryCode: string) {
  try {
    const token = localStorage.getItem('token');
    let userId: string | null = null;
    if (token) {
      try {
        const { user } = await apiFetch('/auth.php?action=me');
        userId = user?.id || null;
      } catch { /* ignore */ }
    }
    await fetch('/backend/query_log.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country_code: countryCode, user_id: userId }),
    });
  } catch { /* non-blocking */ }
}

// ── SearchModule ──────────────────────────────────────────────────────────────
export const SearchModule: React.FC = () => {
  const [countryCode, setCountryCode] = useState('+503');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const navigate = useNavigate();

  const remaining = getRemainingQueries();
  const limitReached = hasReachedLimit();

  const handleReport = () => {
    const token = localStorage.getItem('token');
    navigate(token ? '/submit' : '/quick-report');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    // ── Check limit BEFORE searching ──
    if (hasReachedLimit()) {
      setShowLimitModal(true);
      return;
    }

    setIsSearching(true);
    setHasSearched(false);

    // Increment counter & fire log (fire-and-forget)
    incrementQueryCount();
    sendQueryLog(countryCode);

    try {
      const cleanCountryCode = countryCode.replace('+', '');
      const { data } = await apiFetch(`/records.php?action=search&q=${phoneNumber}`);
      const filteredData = (data || []).filter((r: any) => r.country_code === cleanCountryCode);

      if (filteredData.length > 0) {
        const totalStars = filteredData.reduce((acc: number, curr: any) => acc + Number(curr.reputation_stars || 0), 0);
        const avgStars = Math.min(Math.round(totalStars / filteredData.length), 5);
        const allTags = filteredData.flatMap((r: any) => r.tags?.map((t: any) => t.tag_name) || []);
        const uniqueTags = [...new Set(allTags)];

        setSearchResult({
          country_code: '+' + filteredData[0].country_code,
          phone_number: filteredData[0].phone_number,
          reputation_stars: avgStars,
          tags: uniqueTags,
          created_at: filteredData[0].created_at,
        });
      } else {
        setSearchResult('not_found');
      }
    } catch (err) {
      console.error('Error al realizar la consulta:', err);
      setSearchResult('not_found');
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  return (
    <>
      {showLimitModal && <LimitModal />}

      <div className="w-full max-w-4xl mx-auto">
        <div className="w-full backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden transition-all duration-500" style={{ background: 'rgba(30,34,30,0.7)' }}>

          {/* Decorative Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

          <form onSubmit={handleSearch} className="relative z-10 flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex bg-carbon/60 border border-white/10 rounded-2xl overflow-hidden focus-within:border-clay/50 transition-colors w-full md:flex-1">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-transparent text-cream px-4 py-4 font-mono text-sm border-r border-white/5 outline-none appearance-none cursor-pointer"
              >
                <option value="+503" className="bg-carbon">+503 (SV)</option>
                <option value="+1"   className="bg-carbon">+1 (US)</option>
                <option value="+502" className="bg-carbon">+502 (GT)</option>
                <option value="+504" className="bg-carbon">+504 (HN)</option>
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 15))}
                placeholder="Ej. 75555555"
                className="bg-transparent text-cream px-6 py-4 font-mono text-lg w-full outline-none placeholder:text-cream/20"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:w-auto">
              <button
                type="submit"
                disabled={isSearching || !phoneNumber || limitReached}
                className="magnetic-button bg-[#CC5833] text-cream px-8 py-4 font-sans font-bold text-sm md:w-[160px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#CC5833]/90 transition-all rounded-2xl"
                style={{ boxShadow: '0 0 20px rgba(204,88,51,0.4), 0 4px 24px rgba(0,0,0,0.4)' }}
                onClick={limitReached ? () => setShowLimitModal(true) : undefined}
              >
                {isSearching ? (
                  <span className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded-full border-2 border-cream border-t-transparent animate-spin"></div>
                    BUSCANDO
                  </span>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    VERIFICAR
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReport}
                className="magnetic-button bg-transparent border border-white/20 text-cream/70 px-8 py-4 font-sans font-bold text-sm md:w-[160px] flex items-center justify-center gap-2 hover:border-white/50 hover:text-cream transition-all rounded-2xl"
              >
                <PlusCircle className="w-4 h-4" />
                REPORTAR
              </button>
            </div>
          </form>

          {/* Daily counter badge */}
          <div className="relative z-10 flex items-center justify-end mb-2">
            <div className={`flex items-center gap-2 font-mono text-xs uppercase tracking-wide px-3 py-1 rounded-full border ${
              limitReached
                ? 'bg-clay/10 border-clay/30 text-clay'
                : remaining <= 3
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                : 'bg-white/[0.03] border-white/10 text-cream'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${limitReached ? 'bg-clay animate-pulse' : remaining <= 3 ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]'}`}></div>
              {limitReached ? 'Límite diario alcanzado' : `${remaining} / ${MAX_DAILY} consultas restantes hoy`}
            </div>
          </div>

          {/* Results Area */}
          <div className={`relative z-10 transition-all duration-300 ${hasSearched || isSearching ? 'opacity-100 mt-8' : 'opacity-0 h-0 overflow-hidden'}`}>
            <div className="border-t border-white/5 pt-12">
              {isSearching && (
                <div className="flex flex-col items-center gap-4 py-12">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-clay animate-pulse">
                    CONSULTANDO BASE DE DATOS...
                  </p>
                </div>
              )}

              {hasSearched && searchResult === 'not_found' && (
                <div className="flex flex-col items-center gap-4 p-8 rounded-3xl border w-full animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ background: 'rgba(46,64,54,0.25)', borderColor: 'rgba(80,140,100,0.35)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(80,160,100,0.2)' }}>
                    <AlertCircle className="w-6 h-6" style={{ color: '#5DC48A' }} />
                  </div>
                  <p className="font-sans text-lg text-cream font-bold">Sin Reportes Negativos ✅</p>
                  <p className="font-sans text-sm text-cream/60 text-center max-w-sm leading-relaxed">
                    Este número no tiene reportes de la comunidad hasta la fecha. No se encontraron coincidencias negativas en la red para este número.
                  </p>
                </div>
              )}

              {hasSearched && searchResult !== 'not_found' && searchResult !== null && (
                <div className="w-full flex gap-6 flex-col lg:flex-row animate-in fade-in slide-in-from-bottom-4 duration-500">

                  {/* Left: Stars & Partial Phone */}
                  <div className="bg-[#1A1A1A]/80 border border-red-500/10 rounded-3xl p-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>

                    <h4 className="font-mono text-xs uppercase tracking-wide text-cream/50 mb-6">
                      Firma Digital de Riesgo
                    </h4>

                    <div className="font-mono text-3xl md:text-5xl text-cream mb-8 tracking-tighter">
                      {searchResult.country_code}{' '}
                      {searchResult.phone_number.slice(0, -3)}
                      <span className="text-cream/30">***</span>
                    </div>

                    <div className="flex items-center gap-2 bg-carbon/50 p-4 rounded-2xl border border-white/5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 ${star <= searchResult.reputation_stars ? 'text-clay fill-clay' : 'text-white/5'}`}
                        />
                      ))}
                      <span className="font-mono text-xs text-clay font-bold ml-2 uppercase tracking-wide">
                        {searchResult.reputation_stars}/5 Estrellas
                      </span>
                    </div>
                  </div>

                  {/* Right: Tags & Date */}
                  <div className="bg-[#151515]/80 border border-white/5 rounded-3xl p-8 flex-1 relative flex flex-col justify-center overflow-hidden group backdrop-blur-sm">
                    <div className="flex flex-col gap-6">
                      <div>
                        <h5 className="font-mono text-xs text-cream/50 uppercase tracking-wide mb-3">Historial de Incidencias</h5>
                        <div className="flex flex-wrap gap-2">
                          {searchResult.tags.map((tag: string, i: number) => (
                            <span
                              key={i}
                              className={`font-mono text-[10px] px-3 py-1 rounded-full border uppercase tracking-wider ${getTagBadgeClass(tag)}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4">
                        <h5 className="font-mono text-xs text-cream/50 uppercase tracking-wide mb-2">Fecha del Protocolo</h5>
                        <span className="font-mono text-xs text-cream/70">
                          {new Date(searchResult.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export const SearchProtocol: React.FC = () => {
  return (
    <section id="protocol" className="py-24 px-6 w-full max-w-6xl mx-auto relative z-10 flex flex-col items-center">
      <div className="text-center mb-16">
        <h2 className="font-sans font-bold text-3xl md:text-5xl text-cream tracking-tight">
          Consultar un Cliente
        </h2>
        <p className="mt-4 font-sans text-sm md:text-base text-cream/60 max-w-xl mx-auto leading-relaxed">
          Ingresa el número de teléfono del cliente y revisa si tiene reportes en la red.
        </p>
      </div>

      <SearchModule />
    </section>
  );
};
