import React, { useState, useRef, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { calcAutoRating } from '../lib/tags';
import { 
  Loader2, Star, Tag as TagIcon, Phone, 
  ArrowRight, ArrowLeft, Sparkles, UploadCloud, Paperclip, 
  ShieldAlert, Camera, Key, Mail, CheckCircle2, Shield, Eye, EyeOff
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

type TagCategory = 'red' | 'yellow' | 'gray';

const TAGS: { label: string; category: TagCategory }[] = [
  { label: 'Estafa',                    category: 'red'    },
  { label: 'Falso',                     category: 'red'    },
  { label: 'No paga',                   category: 'red'    },
  { label: 'Reserva cita y no llega',   category: 'yellow' },
  { label: 'Devolución constante',      category: 'yellow' },
  { label: 'Cancelación tardía',        category: 'yellow' },
  { label: 'Dirección incorrecta',      category: 'yellow' },
  { label: 'No responde',               category: 'gray'   },
  { label: 'Regateo agresivo',          category: 'gray'   },
  { label: 'Mal trato',                 category: 'gray'   },
];

const TAG_STYLES: Record<TagCategory, { idle: string; active: string }> = {
  red:    { idle: 'text-red-400/70    border-red-500/20    hover:border-red-500/50',    active: 'bg-red-500    text-white border-red-500'    },
  yellow: { idle: 'text-yellow-400/70 border-yellow-500/20 hover:border-yellow-500/50', active: 'bg-yellow-500 text-carbon border-yellow-500' },
  gray:   { idle: 'text-cream/50      border-white/10      hover:border-white/30',      active: 'bg-white/10   text-cream border-white/20'   },
};

type Step = 1 | 2 | 3 | 4 | 5 | 'success';

export const QuickReport: React.FC = () => {
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // ── Step 1 Data: Target Phone ──
  const [countryCode, setCountryCode] = useState('503');
  const [phoneNumber, setPhoneNumber] = useState('');

  // ── Step 2 Data: Reputation & Tags ──
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ratingIsManual, setRatingIsManual] = useState<boolean>(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  // ── Step 3 Data: Evidence ──
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // ── Step 4 Data: Register credentials ──
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registerCountryCode, setRegisterCountryCode] = useState('+503');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  // ── Step 5 Data: OTP Code ──
  const [otpCode, setOtpCode] = useState('');

  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/submit');
    }
  }, [navigate]);

  // ── Handlers ──
  const handleTagToggle = (tag: string) => {
    setIsProcessingAI(true);
    setTimeout(() => setIsProcessingAI(false), 400);

    setSelectedTags(prev => {
      const next = prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag];

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
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // ── Flow Actions ──
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 5) {
      setMessage({ type: 'error', text: 'Número de teléfono demasiado corto.' });
      return;
    }
    setMessage(null);
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (rating === 0) {
      setMessage({ type: 'error', text: 'Por favor, asigna una calificación de estrellas.' });
      return;
    }
    setMessage(null);
    setStep(3);
  };

  const handleNextStep3 = () => {
    setMessage(null);
    setStep(4);
  };

  // Step 4: Register Action
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptPrivacy) {
      setMessage({ type: 'error', text: 'Debes aceptar la política de privacidad para continuar.' });
      return;
    }
    setIsLoading(true);
    setMessage(null);

    try {
      await apiFetch('/auth.php?action=register', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          password, 
          phone: `${registerCountryCode}${phone}`,
          acceptsNotifications: false
        })
      });
      setStep(5);
      setMessage({ type: 'success', text: 'Ingresa el código enviado a tu correo para activar tu cuenta.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Ha ocurrido un error durante el registro.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 5: Verify OTP and then save report
  const handleVerifyOtpAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setMessage({ type: 'error', text: 'El código OTP debe ser de 6 dígitos.' });
      return;
    }
    setIsLoading(true);
    setMessage(null);

    try {
      // 1. Verify OTP
      const data = await apiFetch('/auth.php?action=verify', {
        method: 'POST',
        body: JSON.stringify({ email, code: otpCode })
      });
      
      // Save token to localStorage so apiFetch includes it
      localStorage.setItem('token', data.token);
      window.dispatchEvent(new CustomEvent('auth-changed'));

      // 2. Save Report
      const endpoint = '/records.php?action=save';
      if (evidenceFile) {
        const formData = new FormData();
        formData.append('countryCode', countryCode);
        formData.append('phoneNumber', phoneNumber);
        formData.append('stars', rating.toString());
        formData.append('tags', JSON.stringify(selectedTags));
        formData.append('privacyAccepted', 'true');
        formData.append('evidence', evidenceFile);

        await apiFetch(endpoint, {
          method: 'POST',
          body: formData
        });
      } else {
        await apiFetch(endpoint, {
          method: 'POST',
          body: JSON.stringify({
            countryCode,
            phoneNumber,
            stars: rating,
            tags: selectedTags,
            privacyAccepted: true
          })
        });
      }

      setStep('success');
      setMessage(null);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al completar el proceso.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getPercent = () => {
    switch (step) {
      case 1: return 20;
      case 2: return 40;
      case 3: return 60;
      case 4: return 80;
      case 5: return 95;
      case 'success': return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden flex items-center justify-center">
      {/* ── Ambient Orbs ── */}
      <div
        className="absolute z-0 rounded-full blur-[130px] opacity-20 pointer-events-none"
        style={{ width: '45vw', height: '45vw', top: '-10%', left: '-10%', background: 'radial-gradient(circle, #2E4036 0%, transparent 70%)' }}
      />
      <div
        className="absolute z-0 rounded-full blur-[150px] opacity-15 pointer-events-none"
        style={{ width: '40vw', height: '40vw', bottom: '-15%', right: '-5%', background: 'radial-gradient(circle, #CC5833 0%, transparent 70%)' }}
      />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #F2F0E9 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="relative z-10 w-full max-w-xl">
        
        {/* Step Progress Header */}
        {step !== 'success' && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="font-mono text-xs text-cream/40 uppercase tracking-widest">
                Paso {step} de 5
              </span>
              <span className="font-mono text-xs text-[#CC5833] font-bold">
                {getPercent()}% completado
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#CC5833] rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${getPercent()}%` }}
              />
            </div>
          </div>
        )}

        {/* Wizard Card */}
        <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
          
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-sans flex items-start gap-2.5 ${
              message.type === 'error' 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                : 'bg-[#32CD32]/10 text-[#32CD32] border-[#32CD32]/20'
            }`}>
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{message.text}</span>
            </div>
          )}

          {/* ── STEP 1: Phone Objective ── */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="flex flex-col gap-6">
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-[#CC5833]" />
                </div>
                <h1 className="font-serif italic text-3xl text-cream mb-2">Reportar Número</h1>
                <p className="font-sans text-sm text-cream/50">
                  Ingresa el número de teléfono fraudulento o sospechoso que deseas registrar.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50 pl-2">Cod. País</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40 font-mono text-sm">+</span>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-full bg-carbon border border-white/10 rounded-2xl pl-7 pr-3 py-4 text-cream font-mono text-sm focus:outline-none focus:border-[#CC5833]/50 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="503" className="bg-carbon">503 (SV)</option>
                      <option value="1" className="bg-carbon">1 (US)</option>
                      <option value="502" className="bg-carbon">502 (GT)</option>
                      <option value="504" className="bg-carbon">504 (HN)</option>
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-3 flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50 pl-2">Número de Teléfono</label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-carbon border border-white/10 rounded-2xl px-4 py-4 text-cream font-mono text-lg tracking-wider focus:outline-none focus:border-[#CC5833]/50 transition-colors"
                    placeholder="Ej: 70000000"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="magnetic-button w-full bg-[#CC5833] text-cream py-4 rounded-2xl font-sans font-medium text-sm flex items-center justify-center gap-2 mt-4 hover:shadow-[0_0_20px_rgba(204,88,51,0.3)] transition-all"
              >
                Siguiente Paso
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ── STEP 2: Stars and Tags ── */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-[#CC5833]" />
                </div>
                <h1 className="font-serif italic text-3xl text-cream mb-2">Comportamiento y Riesgo</h1>
                <p className="font-sans text-sm text-cream/50">
                  Evalúa el nivel de confianza del número (+{countryCode}) {phoneNumber} y selecciona sus etiquetas de comportamiento.
                </p>
              </div>

              {/* Confidence Rating */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50 pl-2">
                    Nivel de Confianza (Reputación)
                  </label>
                  {rating > 0 && (
                    <div className="flex items-center gap-2">
                      {!ratingIsManual ? (
                        <span className={`flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border bg-white/5 text-cream/60 border-white/10 ${isProcessingAI ? 'border-[#32CD32]/40 text-[#32CD32] shadow-[0_0_8px_rgba(50,205,50,0.3)]' : ''}`}>
                          {isProcessingAI ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : '🤖'}
                          AI Sugerido
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResetAutoRating}
                          className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#CC5833] hover:underline"
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          Restablecer
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-center py-2 bg-carbon/30 border border-white/5 rounded-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleManualRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-9 h-9 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'fill-[#CC5833] text-[#CC5833] drop-shadow-[0_0_8px_rgba(204,88,51,0.5)]'
                            : 'text-white/10'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Behavior Tags */}
              <div className="flex flex-col gap-4">
                <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50 pl-2 flex items-center gap-1.5">
                  <TagIcon className="w-3 h-3 text-[#CC5833]" />
                  Etiquetas de Incidencia
                </label>
                <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-1">
                  
                  {/* Red/Critical */}
                  <div className="flex flex-col gap-2">
                    <span className="font-sans text-[9px] uppercase tracking-widest text-red-400/60 font-semibold">Crítico</span>
                    <div className="flex flex-wrap gap-1.5">
                      {TAGS.filter(t => t.category === 'red').map(({ label, category }) => {
                        const isSelected = selectedTags.includes(label);
                        const styles = TAG_STYLES[category];
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => handleTagToggle(label)}
                            className={`px-3 py-1.5 rounded-full font-mono text-[10px] border transition-all ${
                              isSelected ? styles.active : `bg-transparent ${styles.idle}`
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Yellow/Logistics */}
                  <div className="flex flex-col gap-2">
                    <span className="font-sans text-[9px] uppercase tracking-widest text-yellow-400/60 font-semibold">Logístico</span>
                    <div className="flex flex-wrap gap-1.5">
                      {TAGS.filter(t => t.category === 'yellow').map(({ label, category }) => {
                        const isSelected = selectedTags.includes(label);
                        const styles = TAG_STYLES[category];
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => handleTagToggle(label)}
                            className={`px-3 py-1.5 rounded-full font-mono text-[10px] border transition-all ${
                              isSelected ? styles.active : `bg-transparent ${styles.idle}`
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Gray/Commercial */}
                  <div className="flex flex-col gap-2">
                    <span className="font-sans text-[9px] uppercase tracking-widest text-cream/40 font-semibold">Comercial</span>
                    <div className="flex flex-wrap gap-1.5">
                      {TAGS.filter(t => t.category === 'gray').map(({ label, category }) => {
                        const isSelected = selectedTags.includes(label);
                        const styles = TAG_STYLES[category];
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => handleTagToggle(label)}
                            className={`px-3 py-1.5 rounded-full font-mono text-[10px] border transition-all ${
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

              {/* Action Buttons */}
              <div className="flex justify-between items-center gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-4 border border-white/10 rounded-2xl font-sans text-sm text-cream/60 hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleNextStep2}
                  className="magnetic-button flex-1 bg-[#CC5833] text-cream py-4 rounded-2xl font-sans font-medium text-sm flex items-center justify-center gap-2"
                >
                  Siguiente Paso
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Evidence (Optional) ── */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Paperclip className="w-6 h-6 text-[#CC5833]" />
                </div>
                <h1 className="font-serif italic text-3xl text-cream mb-2">Evidencia de Respaldo</h1>
                <p className="font-sans text-sm text-cream/50">
                  Adjunta una captura de pantalla, foto o documento de respaldo. Este paso es opcional.
                </p>
              </div>

              {/* Secret inputs */}
              <input
                type="file"
                accept="image/*,application/pdf"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <input
                type="file"
                accept="image/*"
                capture="environment"
                hidden
                ref={cameraInputRef}
                onChange={handleFileChange}
              />

              {evidenceFile ? (
                <div className="border border-[#32CD32]/20 bg-[#32CD32]/5 rounded-2xl p-6 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#32CD32]/10 flex items-center justify-center text-[#32CD32]">
                    <Paperclip className="w-6 h-6" />
                  </div>
                  <p className="font-mono text-xs text-cream text-center break-all">{evidenceFile.name}</p>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-xs text-red-400 hover:text-red-300 underline font-medium"
                  >
                    Quitar evidencia
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Camera Button */}
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="border border-white/10 bg-carbon/50 hover:bg-white/5 hover:border-white/20 transition-all rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#CC5833]/15 flex items-center justify-center text-[#CC5833]">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-sans text-xs font-bold text-cream">Tomar Foto</span>
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-cream/40 mt-1">Cámara trasera</span>
                    </div>
                  </button>

                  {/* File Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-white/10 bg-carbon/50 hover:bg-white/5 hover:border-white/20 transition-all rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-cream/60">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-sans text-xs font-bold text-cream">Subir Archivo</span>
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-cream/40 mt-1">PNG, JPG, PDF (Máx 2MB)</span>
                    </div>
                  </button>
                </div>
              )}

              {/* Confidentiality disclaimer */}
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="font-sans text-[11px] text-red-200/80 leading-relaxed">
                  <strong className="text-red-400">Confidencialidad:</strong> Los archivos de respaldo se procesan únicamente como validación de seguridad interna. <strong>Nunca serán públicos</strong>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-4 border border-white/10 rounded-2xl font-sans text-sm text-cream/60 hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleNextStep3}
                  className="magnetic-button flex-1 bg-[#CC5833] text-cream py-4 rounded-2xl font-sans font-medium text-sm flex items-center justify-center gap-2"
                >
                  {evidenceFile ? 'Siguiente Paso' : 'Saltar y Continuar'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Registration ── */}
          {step === 4 && (
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
              <div className="text-center mb-2">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Key className="w-6 h-6 text-[#CC5833]" />
                </div>
                <h1 className="font-serif italic text-3xl text-cream mb-2">Tu Identidad</h1>
                <p className="font-sans text-sm text-cream/50">
                  Crea tu identidad digital para validar y firmar criptográficamente este reporte en la red.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50 pl-2">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-carbon border border-white/10 rounded-2xl px-4 py-3 text-cream font-sans text-sm focus:outline-none focus:border-[#CC5833]/50 transition-colors"
                  placeholder="ejemplo@empresa.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50 pl-2">Teléfono Personal</label>
                <div className="flex bg-carbon border border-white/10 rounded-2xl overflow-hidden focus-within:border-[#CC5833]/50 transition-colors">
                  <select
                    value={registerCountryCode}
                    onChange={(e) => setRegisterCountryCode(e.target.value)}
                    className="bg-transparent text-cream px-3 py-3 font-mono text-sm border-r border-white/5 outline-none cursor-pointer"
                  >
                    <option value="+503" className="bg-carbon">+503 (SV)</option>
                    <option value="+502" className="bg-carbon">+502 (GT)</option>
                    <option value="+504" className="bg-carbon">+504 (HN)</option>
                  </select>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))}
                    className="bg-transparent text-cream px-4 py-3 font-sans text-sm w-full outline-none"
                    placeholder="0000 0000"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50 pl-2">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-carbon border border-white/10 rounded-2xl px-4 pr-12 py-3 text-cream font-sans text-sm focus:outline-none focus:border-[#CC5833]/50 transition-colors"
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-[#CC5833] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms / Privacy checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group mt-2">
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    checked={acceptPrivacy}
                    onChange={(e) => setAcceptPrivacy(e.target.checked)}
                    required
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border border-white/10 rounded-md bg-carbon group-hover:border-[#CC5833]/50 transition-colors flex items-center justify-center peer-checked:bg-[#CC5833] peer-checked:border-[#CC5833]">
                    <ArrowRight className="w-3 h-3 text-cream rotate-[-45deg] peer-checked:rotate-0 transition-transform" />
                  </div>
                </div>
                <span className="text-xs text-cream/50 leading-relaxed font-sans select-none">
                  Acepto la <Link to="/privacy" target="_blank" className="text-[#CC5833] hover:underline font-semibold">Política de Privacidad</Link> y certifico que toda la telemetría enviada es verídica. <span className="text-[#CC5833]">*</span>
                </span>
              </label>

              {/* Action Buttons */}
              <div className="flex justify-between items-center gap-4 mt-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={isLoading}
                  className="px-5 py-4 border border-white/10 rounded-2xl font-sans text-sm text-cream/60 hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !acceptPrivacy}
                  className="magnetic-button flex-1 bg-[#CC5833] text-cream py-4 rounded-2xl font-sans font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Registrar y Reportar
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 5: OTP Code ── */}
          {step === 5 && (
            <form onSubmit={handleVerifyOtpAndSave} className="flex flex-col gap-6">
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-[#CC5833]" />
                </div>
                <h1 className="font-serif italic text-3xl text-cream mb-2">Verificación de Correo</h1>
                <p className="font-sans text-sm text-cream/50">
                  Ingresa el código de seguridad de 6 dígitos que hemos enviado a <strong className="text-cream">{email}</strong>.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50 pl-2 text-center">Código de Activación</label>
                <input
                  type="text"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="bg-carbon border border-white/10 rounded-2xl px-4 py-5 text-cream font-mono text-center text-3xl tracking-[1rem] focus:outline-none focus:border-[#CC5833] transition-colors"
                  placeholder="000000"
                />
              </div>

              <div className="flex justify-between items-center gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={isLoading}
                  className="px-5 py-4 border border-white/10 rounded-2xl font-sans text-sm text-cream/60 hover:bg-white/5 transition-all"
                >
                  Cambiar Correo
                </button>
                <button
                  type="submit"
                  disabled={isLoading || otpCode.length < 6}
                  className="magnetic-button flex-1 bg-[#32CD32] text-black py-4 rounded-2xl font-sans font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#28A428] hover:shadow-[0_0_20px_rgba(50,205,50,0.3)] transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Verificar y Publicar Reporte
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 'SUCCESS': Completed Flow ── */}
          {step === 'success' && (
            <div className="flex flex-col gap-6 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#32CD32]/10 border border-[#32CD32]/30 flex items-center justify-center mx-auto mb-2 animate-in zoom-in-90 duration-300">
                <CheckCircle2 className="w-8 h-8 text-[#32CD32] drop-shadow-[0_0_12px_rgba(50,205,50,0.4)]" />
              </div>
              
              <div>
                <h1 className="font-serif italic text-3xl text-cream mb-2">¡Reporte Inyectado!</h1>
                <p className="font-sans text-sm text-[#32CD32] font-semibold uppercase tracking-wider mb-4">
                  Acto Procesado y Firmado con Éxito
                </p>
                <p className="font-sans text-sm text-cream/60 max-w-sm mx-auto leading-relaxed mb-4">
                  Tu identidad ha sido verificada y el número de teléfono ha sido ingresado a la base de datos de telemetría de PortalGuanaco de manera segura.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#32CD32]/5 border border-[#32CD32]/10 font-sans text-xs text-cream/80 max-w-sm mx-auto text-left">
                  <Shield className="w-4 h-4 text-[#32CD32] shrink-0" />
                  <span>
                    Toda la información del reporte es <strong>completamente anónima</strong> y ninguno de tus datos personales (correo o teléfono) será mostrado jamás a terceros.
                  </span>
                </div>
              </div>

              {/* Details of the reported number */}
              <div className="bg-carbon/60 border border-white/5 rounded-2xl p-5 mt-2 flex flex-col gap-2 font-mono text-xs text-left max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-cream/40">OBJETIVO:</span>
                  <span className="text-cream font-bold">+{countryCode} {phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/40">CONFIANZA:</span>
                  <span className="text-[#CC5833] font-bold">{'★'.repeat(rating)}</span>
                </div>
                {selectedTags.length > 0 && (
                  <div className="flex justify-between items-start">
                    <span className="text-cream/40">ETIQUETAS:</span>
                    <span className="text-cream/70 text-right max-w-[200px] truncate">{selectedTags.join(', ')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-cream/40">OPERADOR:</span>
                  <span className="text-cream/80 truncate max-w-[180px] flex items-center gap-1.5">
                    {email} 
                    <span className="text-[9px] font-sans text-cream/30 shrink-0">(Privado)</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="magnetic-button w-full bg-[#CC5833] text-cream py-4 rounded-2xl font-sans font-medium text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(204,88,51,0.3)] transition-all"
                >
                  Ir al Panel de Control B2B
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    // Reset all and go to step 1
                    setStep(1);
                    setPhoneNumber('');
                    setRating(0);
                    setSelectedTags([]);
                    setEvidenceFile(null);
                    setOtpCode('');
                  }}
                  className="font-sans text-xs text-cream/40 hover:text-cream transition-colors py-2"
                >
                  Reportar otro número como {email}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer info badge */}
        {step !== 'success' && (
          <div className="mt-6 flex items-center justify-center gap-2 text-cream/30">
            <Shield className="w-3.5 h-3.5" />
            <span className="font-mono text-[9px] uppercase tracking-widest">
              Encriptación E2E y Capa de Transparencia Criptográfica
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
