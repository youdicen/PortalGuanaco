import React, { useState, useEffect, useRef } from 'react';
import { apiFetch, ApiError } from '../lib/api';
import { getTagBadgeClass, calcAutoRating } from '../lib/tags';
import { Loader2, Star, Tag as TagIcon, Plus, EyeOff, Eye, Phone, Calendar, ArrowRight, Sparkles, UploadCloud, Paperclip, ShieldAlert } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';

type TagCategory = 'red' | 'yellow' | 'gray';

const TAGS: { label: string; category: TagCategory }[] = [
  // ── Rojo ──────────────────────────────────────────────────────────────────
  { label: 'Estafa',                    category: 'red'    },
  { label: 'Falso',                     category: 'red'    },
  { label: 'No paga',                   category: 'red'    },
  // ── Amarillo ──────────────────────────────────────────────────────────────
  { label: 'Reserva cita y no llega',   category: 'yellow' },
  { label: 'Devolución constante',      category: 'yellow' },
  { label: 'Cancelación tardía',        category: 'yellow' },
  { label: 'Dirección incorrecta',      category: 'yellow' },
  // ── Gris ──────────────────────────────────────────────────────────────────
  { label: 'No responde',               category: 'gray'   },
  { label: 'Regateo agresivo',          category: 'gray'   },
  { label: 'Mal trato',                 category: 'gray'   },
];

const TAG_STYLES: Record<TagCategory, { idle: string; active: string }> = {
  red:    { idle: 'text-red-400/70    border-red-500/20    hover:border-red-500/50',    active: 'bg-red-500    text-white border-red-500'    },
  yellow: { idle: 'text-yellow-400/70 border-yellow-500/20 hover:border-yellow-500/50', active: 'bg-yellow-500 text-carbon border-yellow-500' },
  gray:   { idle: 'text-cream/50      border-white/10      hover:border-white/30',      active: 'bg-white/10   text-cream border-white/20'   },
};

interface DuplicateInfo {
  existingId: string;
  isHidden: boolean;
}

export const RecordForm: React.FC = () => {
  const { id: editId } = useParams();
  const [countryCode, setCountryCode] = useState('503');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ratingIsManual, setRatingIsManual] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [hasExistingEvidence, setHasExistingEvidence] = useState(false);
  
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string; duplicate?: DuplicateInfo } | null>(null);
  const [user, setUser] = useState<any>(null);
  const [myRecords, setMyRecords] = useState<any[]>([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      try {
        const { user: currentUser } = await apiFetch('/auth.php?action=me');
        setUser(currentUser);

        if (editId) {
          setIsEditMode(true);
          setIsLoading(true);
          
          const { data: record } = await apiFetch(`/records.php?action=get&id=${editId}`);
          
          if (!record) {
            setMessage({ type: 'error', text: 'No se encontró el reporte para editar.' });
          } else {
            setCountryCode(record.country_code);
            setPhoneNumber(record.phone_number);
            setRating(record.reputation_stars);
            setIsHidden(record.is_hidden ?? false);
            setHasExistingEvidence(record.has_evidence == 1);
            setSelectedTags(record.tags?.map((t: any) => t.tag_name) || []);
          }
          setIsLoading(false);
        } else {
          fetchMyRecords();
        }
      } catch (err) {
        navigate('/auth');
      }
    };
    checkUserAndFetchData();
  }, [navigate, editId]);

  const fetchMyRecords = async () => {
    try {
      const { data } = await apiFetch('/records.php?action=my_records');
      if (data) {
        setMyRecords(data.slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching records:', err);
    }
  };

  const handleTagToggle = (tag: string) => {
    setIsProcessingAI(true);
    setTimeout(() => setIsProcessingAI(false), 600);

    setSelectedTags(prev => {
      const next = prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag];

      // Auto-sugerir estrellas solo si el usuario no ha elegido manualmente
      if (!ratingIsManual) {
        const suggested = calcAutoRating(next);
        if (suggested > 0) setRating(suggested);
      }

      return next;
    });
  };

  const handleManualRating = (star: number) => {
    setRating(star);
    setRatingIsManual(true);
  };

  const handleResetAutoRating = () => {
    setRatingIsManual(false);
    const suggested = calcAutoRating(selectedTags);
    if (suggested > 0) setRating(suggested);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2097152) { // 2MB
        setMessage({ type: 'error', text: 'El archivo supera el tamaño máximo de 2MB.' });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setEvidenceFile(file);
      setMessage(null);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEvidenceFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleToggleVisibility = async () => {
    if (!editId) return;
    setIsTogglingVisibility(true);
    try {
      await apiFetch('/records.php?action=toggle_visibility', {
        method: 'POST',
        body: JSON.stringify({ id: editId, hide: !isHidden })
      });
      const newHidden = !isHidden;
      setIsHidden(newHidden);
      setMessage({
        type: 'success',
        text: newHidden ? 'Registro archivado. Ya no es visible públicamente.' : 'Registro reactivado. Ahora es visible en la base de datos.'
      });
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Error al cambiar visibilidad: ' + error.message });
    } finally {
      setIsTogglingVisibility(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (rating === 0) {
      setMessage({ type: 'error', text: 'Por favor, asigna una calificación de estrellas.' });
      return;
    }

    if (phoneNumber.length < 5) {
      setMessage({ type: 'error', text: 'Número de teléfono demasiado corto.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const endpoint = '/records.php?action=save';
      
      if (evidenceFile) {
        const formData = new FormData();
        if (isEditMode && editId) formData.append('id', editId);
        formData.append('countryCode', countryCode);
        formData.append('phoneNumber', phoneNumber);
        formData.append('stars', rating.toString());
        formData.append('tags', JSON.stringify(selectedTags));
        formData.append('privacyAccepted', privacyAccepted ? 'true' : 'false');
        formData.append('evidence', evidenceFile);

        await apiFetch(endpoint, {
          method: 'POST',
          body: formData
        });
      } else {
        await apiFetch(endpoint, {
          method: 'POST',
          body: JSON.stringify({
            id: isEditMode ? editId : null,
            countryCode,
            phoneNumber,
            stars: rating,
            tags: selectedTags,
            privacyAccepted: privacyAccepted
          })
        });
      }

      if (isEditMode) {
        setMessage({ type: 'success', text: 'Reporte actualizado exitosamente en la base de datos.' });
        if (isHidden) setIsHidden(false); // save also unhides
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setMessage({ type: 'success', text: 'Registro guardado exitosamente.' });
        setPhoneNumber('');
        setRating(0);
        setSelectedTags([]);
        setEvidenceFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchMyRecords();
      }
    } catch (error: any) {
      // If ApiError with raw payload, extract duplicate info
      if (error instanceof ApiError && error.raw?.existing_id) {
        setMessage({
          type: 'error',
          text: error.raw.is_hidden
            ? 'Ya tienes este número registrado (archivado). Puedes reactivarlo desde tu panel.'
            : 'Ya has reportado este número. Puedes editarlo desde tu panel.',
          duplicate: { existingId: error.raw.existing_id, isHidden: !!error.raw.is_hidden }
        });
      } else {
        setMessage({ type: 'error', text: error.message || 'Error al procesar el registro.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div className="min-h-screen bg-carbon"></div>;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-12">
          <h1 className="font-serif italic text-4xl text-cream mb-4">
            {isEditMode ? (
              <span className="flex items-center gap-3 flex-wrap">
                Refinar Telemetría
                {isHidden && (
                  <span className="text-sm font-sans font-medium not-italic px-3 py-1 rounded-full border border-white/10 bg-white/5 text-cream/40 flex items-center gap-1">
                    <EyeOff className="w-3 h-3" />
                    Archivado
                  </span>
                )}
              </span>
            ) : 'Ingresar Telemetría'}
          </h1>
          <p className="font-sans text-cream/50 max-w-xl">
            {isEditMode 
              ? 'Actualiza los datos de este reporte. Todos los cambios quedan registrados en tu historial.' 
              : 'Añade un nuevo reporte a la base de datos de PortalGuanaco. Toda la información será procesada y vinculada criptográficamente a tu perfil.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111111] border border-white/5 rounded-3xl p-8 flex flex-col gap-8 shadow-2xl">
          
          {message && (
            <div className={`p-4 rounded-xl text-sm font-sans flex flex-col gap-2 ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
              <span>{message.text}</span>
              {message.duplicate && (
                <button
                  type="button"
                  onClick={() => navigate(message.duplicate!.isHidden ? '/dashboard' : `/edit/${message.duplicate!.existingId}`)}
                  className="self-start flex items-center gap-1 underline text-xs font-mono font-medium hover:opacity-80 transition-opacity"
                >
                  {message.duplicate.isHidden ? (
                    <>Ir al panel a reactivarlo <ArrowRight className="w-3 h-3" /></>
                  ) : (
                    <>Ir a editarlo directamente <ArrowRight className="w-3 h-3" /></>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Phone Input */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs uppercase tracking-wide text-cream/60 pl-2">Cód. País</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/50 font-mono text-sm">+</span>
                <select 
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full bg-carbon border border-white/10 rounded-2xl pl-8 pr-4 py-4 text-cream font-mono text-sm focus:outline-none focus:border-clay/50 transition-colors appearance-none cursor-pointer"
                  required
                >
                  <option value="503" className="bg-carbon">503 (SV)</option>
                  <option value="1" className="bg-carbon">1 (US)</option>
                  <option value="502" className="bg-carbon">502 (GT)</option>
                  <option value="504" className="bg-carbon">504 (HN)</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-3 flex flex-col gap-2">
              <label className="font-mono text-xs uppercase tracking-wide text-cream/60 pl-2">Número de Objetivo</label>
              <input 
                type="tel" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-carbon border border-white/10 rounded-2xl px-4 py-4 text-cream font-mono text-lg tracking-wider focus:outline-none focus:border-clay/50 transition-colors"
                placeholder="70000000"
                required
              />
            </div>
          </div>

          <div className="w-full h-px bg-white/5"></div>

          {/* Reputation Stars */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="font-mono text-xs uppercase tracking-wide text-cream/60 pl-2 flex items-center gap-2">
                Nivel de Confianza (Estrellas)
              </label>
              {/* Badge: auto-sugerido vs manual */}
              {rating > 0 && (
                <div className="flex items-center gap-2">
                  {!ratingIsManual ? (
                    <span className={`flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide px-2.5 py-1 rounded-full transition-all duration-300 border ${isProcessingAI ? 'bg-[#32CD32]/20 text-[#32CD32] border-[#32CD32]/50 shadow-[0_0_15px_rgba(50,205,50,0.4)]' : 'bg-white/5 text-cream/60 border-white/10'}`}>
                      {isProcessingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : <span className="text-[10px]">🤖</span>}
                      Clasificación por Sidere AI
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResetAutoRating}
                      className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-cream/50 border border-white/10 px-2.5 py-1 rounded-full hover:border-clay/30 hover:text-clay/60 transition-all"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      Manual · Restablecer auto
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleManualRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-2 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'fill-clay text-clay drop-shadow-[0_0_10px_rgba(204,88,51,0.5)]'
                        : 'text-white/10'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Guía rápida de puntuación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mt-2">
              {[
                { stars: '★', label: 'Estafa / No paga', color: 'text-red-400/70' },
                { stars: '★★', label: 'Riesgo alto', color: 'text-red-400/50' },
                { stars: '★★★', label: 'Advertencia', color: 'text-yellow-400/70' },
                { stars: '★★★★', label: 'Incidencia menor', color: 'text-yellow-400/50' },
                { stars: '★★★★★', label: 'Confiable', color: 'text-[#32CD32]/70' },
              ].map(g => (
                <div key={g.label} className="flex items-center gap-2">
                  <span className={`font-mono text-xs tracking-[0.2em] ${g.color}`}>{g.stars}</span>
                  <span className={`font-sans text-[10px] uppercase tracking-wider ${g.color}`}>{g.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-white/5"></div>

          {/* Tags */}
          <div className="flex flex-col gap-4">
            <label className="font-mono text-xs uppercase tracking-wide text-cream/60 pl-2 flex items-center gap-2">
              <TagIcon className="w-3 h-3" />
              Etiquetas de Comportamiento
            </label>
            <div className="flex flex-col gap-6">
              {/* Crítico */}
              <div className="flex flex-col gap-3">
                <span className="font-sans text-[10px] uppercase tracking-widest text-red-400/60 font-medium">Impacto Crítico</span>
                <div className="flex flex-wrap gap-2">
                  {TAGS.filter(t => t.category === 'red').map(({ label, category }) => {
                    const isSelected = selectedTags.includes(label);
                    const styles = TAG_STYLES[category];
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleTagToggle(label)}
                        className={`px-4 py-2 rounded-full font-mono text-xs border transition-all ${
                          isSelected ? styles.active : `bg-transparent ${styles.idle}`
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Logística */}
              <div className="flex flex-col gap-3">
                <span className="font-sans text-[10px] uppercase tracking-widest text-yellow-400/60 font-medium">Desviación Logística</span>
                <div className="flex flex-wrap gap-2">
                  {TAGS.filter(t => t.category === 'yellow').map(({ label, category }) => {
                    const isSelected = selectedTags.includes(label);
                    const styles = TAG_STYLES[category];
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleTagToggle(label)}
                        className={`px-4 py-2 rounded-full font-mono text-xs border transition-all ${
                          isSelected ? styles.active : `bg-transparent ${styles.idle}`
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comercial */}
              <div className="flex flex-col gap-3">
                <span className="font-sans text-[10px] uppercase tracking-widest text-cream/40 font-medium">Interacción Comercial</span>
                <div className="flex flex-wrap gap-2">
                  {TAGS.filter(t => t.category === 'gray').map(({ label, category }) => {
                    const isSelected = selectedTags.includes(label);
                    const styles = TAG_STYLES[category];
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleTagToggle(label)}
                        className={`px-4 py-2 rounded-full font-mono text-xs border transition-all ${
                          isSelected ? styles.active : `bg-transparent ${styles.idle}`
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-white/5"></div>

          {/* Evidence Dropzone */}
          <div className="flex flex-col gap-4">
            <label className="font-mono text-xs uppercase tracking-wide text-cream/60 pl-2 flex items-center gap-2">
              <Paperclip className="w-3 h-3" />
              Evidencia Respaldo (Opcional)
            </label>
            <div 
              className={`border-2 border-dashed ${evidenceFile ? 'border-[#32CD32]/40 bg-[#32CD32]/5' : 'border-white/10 hover:border-white/20 bg-white/2'} transition-colors rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer group`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept="image/*,application/pdf"
                capture="environment"
                hidden 
                ref={fileInputRef} 
                onChange={handleFileChange} 
              />
              {evidenceFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-[#32CD32]/10 rounded-full text-[#32CD32] mb-1">
                    <Paperclip className="w-6 h-6" />
                  </div>
                  <p className="font-mono text-sm text-cream text-center break-all max-w-[200px] sm:max-w-xs">{evidenceFile.name}</p>
                  <button 
                    type="button" 
                    onClick={handleRemoveFile} 
                    className="text-xs font-sans font-medium text-red-400 hover:text-red-300 underline mt-1 px-4 py-1"
                  >
                    Quitar archivo
                  </button>
                </div>
              ) : hasExistingEvidence ? (
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#32CD32]/10 flex items-center justify-center text-[#32CD32] group-hover:scale-110 transition-transform">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <p className="font-sans text-sm text-[#32CD32] max-w-sm leading-relaxed font-medium">
                    Evidencia existente adjunta
                  </p>
                  <p className="font-sans text-xs text-cream/50 max-w-sm mt-1">
                    Puedes adjuntar un nuevo archivo para reemplazar el existente.
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-5 h-5 text-cream/50 group-hover:text-cream/80 transition-colors" />
                  </div>
                  <p className="font-sans text-sm text-center text-cream/80 max-w-sm leading-relaxed">
                    Adjuntar captura de pantalla, foto o factura<br/>
                    <span className="text-xs text-cream/50 mt-1 block">(Ayuda a mitigar falsos positivos y acelera la validación de Sidere AI)</span>
                  </p>
                  <p className="font-mono text-xs uppercase text-cream/40 tracking-widest mt-2">.png, .jpg, .pdf (Max: 2MB)</p>
                </>
              )}
            </div>
            {/* Disclaimer de Confidencialidad */}
            <div className="mt-1 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="font-sans text-sm text-red-200/90 leading-relaxed">
                <strong className="text-red-400 font-semibold block sm:inline">Confidencialidad Estricta:</strong> Esta evidencia se procesa como respaldo técnico interno. <strong className="text-red-400 underline decoration-red-400/50 underline-offset-2">Nunca será pública</strong> ni visible para otros usuarios de la red.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-white/5"></div>

          {/* Privacy Acceptance */}
          <div className={`flex items-start gap-4 p-5 rounded-2xl transition-all border ${privacyAccepted ? 'bg-clay/5 border-clay/20' : 'bg-white/5 border-white/5'}`}>
            <div className="pt-0.5">
              <input 
                id="privacy-accepted"
                type="checkbox" 
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="w-5 h-5 rounded-md border-white/20 bg-carbon text-clay focus:ring-0 focus:ring-offset-0 cursor-pointer accent-clay"
                required
              />
            </div>
            <label htmlFor="privacy-accepted" className="text-xs sm:text-sm font-sans text-cream/60 leading-relaxed cursor-pointer select-none">
              Confirmo que he leído y acepto la <Link to="/privacy" className="text-clay hover:underline font-medium">Política de Privacidad y el Descargo de Responsabilidad</Link>. Certifico que la telemetría ingresada es verídica y entiendo que la inyección de datos falsos puede resultar en la suspensión del nodo.
            </label>
          </div>

          <div className="pt-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
            {isEditMode ? (
              /* Toggle Visibility Button */
              <button
                type="button"
                onClick={handleToggleVisibility}
                disabled={isTogglingVisibility}
                className={`w-full sm:w-auto p-4 sm:px-6 sm:py-3 rounded-2xl border transition-all font-sans font-medium text-sm flex items-center justify-center gap-2
                  ${isHidden 
                    ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500 hover:text-white' 
                    : 'bg-white/5 text-cream/50 border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                  }`}
              >
                {isTogglingVisibility ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isHidden ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Revivir Registro
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Ocultar Registro
                  </>
                )}
              </button>
            ) : (
              <div></div>
            )}
            <div className="w-full sm:w-auto flex flex-col-reverse sm:flex-row items-center gap-4">
              {isEditMode && (
                <button 
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto font-sans text-sm text-cream/40 hover:text-cream transition-colors text-center px-4 py-3"
                >
                  Cancelar
                </button>
              )}
              <button 
                type="submit" 
                disabled={isLoading || !privacyAccepted}
                className={`w-full sm:w-auto magnetic-button px-8 py-4 rounded-2xl font-sans font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 border
                  ${(isLoading || !privacyAccepted) 
                    ? 'bg-white/5 text-cream/40 border-white/10 cursor-not-allowed' 
                    : 'bg-[#32CD32] text-black border-[#32CD32] hover:bg-[#28A428] hover:shadow-[0_0_20px_rgba(50,205,50,0.4)]'
                  }`}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    {isEditMode ? 'Actualizar Reporte' : 'Inyectar Registro'}
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

        {/* Mis Reportes Recientes */}
        {!isEditMode && myRecords.length > 0 && (
          <div className="mt-16 bg-[#111111] border border-white/5 rounded-3xl p-8 shadow-2xl">
            <h2 className="font-sans font-bold text-cream uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
              <Phone className="w-4 h-4 text-clay" />
              Tus Reportes Recientes
            </h2>
            <div className="flex flex-col gap-4">
              {myRecords.map((record) => (
                <div 
                  key={record.id}
                  onClick={() => navigate(`/edit/${record.id}`)}
                  className={`border rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-white/20 hover:bg-white/5 transition-all gap-4 cursor-pointer
                    ${record.is_hidden ? 'bg-white/2 border-white/5 opacity-50 hover:opacity-80' : 'bg-carbon border-white/5'}`}
                >
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0
                      ${record.is_hidden ? 'bg-white/5 border-white/5 text-cream/30' : 'bg-[#111111] border-white/5 text-clay'}`}
                    >
                      {record.is_hidden ? <EyeOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                    </div>
                    <div className="w-full">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <div className="font-mono text-cream text-base break-all group-hover:text-white transition-colors">
                          (+{record.country_code}) {record.phone_number}
                        </div>
                        {record.is_hidden && (
                          <span className="font-mono text-xs uppercase px-2 py-0.5 rounded-full border border-white/10 text-cream/50 bg-white/5">
                            Archivado
                          </span>
                        )}
                      </div>

                      {/* Estrellas y Fecha */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <div className="flex gap-1 shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={`star-${i}`} 
                              className={`w-3 h-3 ${i < record.reputation_stars ? 'text-clay fill-clay' : 'text-white/10'}`} 
                            />
                          ))}
                        </div>
                        <span className="w-1 h-1 rounded-full bg-white/10 hidden sm:block"></span>
                        <div className="flex items-center gap-1 text-cream/50 font-mono text-xs uppercase shrink-0">
                          <Calendar className="w-3 h-3" />
                          {new Date(record.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Etiquetas */}
                      {record.tags && record.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {record.tags.map((t: any, i: number) => (
                            <span
                              key={`tag-${i}`}
                              className={`px-2 py-0.5 rounded-full border text-xs font-mono uppercase ${getTagBadgeClass(t.tag_name)}`}
                            >
                              {t.tag_name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="hidden md:flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-sans text-xs text-cream/50 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                      Editar →
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-xs font-sans text-clay hover:text-clay/80 transition-colors"
              >
                Ver todos mis reportes en el panel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
