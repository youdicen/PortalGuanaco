import React, { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { Loader2, Star, Tag as TagIcon, Plus, Trash2, Phone, Calendar } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const DEFAULT_TAGS = ['no responde', 'no paga', 'devolucion', 'falso', 'Pedido completado'];

export const RecordForm: React.FC = () => {
  const { id: editId } = useParams();
  const [countryCode, setCountryCode] = useState('503');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
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
            setSelectedTags(record.tags?.map((t: any) => t.tag_name) || []);
          }
          setIsLoading(false);
        } else {
          // Fetch recent active records if in create mode
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
        setMyRecords(data.slice(0, 5)); // Limit in frontend just in case
      }
    } catch (err) {
      console.error('Error fetching records:', err);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
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
      await apiFetch('/records.php?action=save', {
        method: 'POST',
        body: JSON.stringify({
          id: isEditMode ? editId : null,
          countryCode,
          phoneNumber,
          stars: rating,
          tags: selectedTags
        })
      });

      if (isEditMode) {
        setMessage({ type: 'success', text: 'Reporte actualizado exitosamente en la base de datos.' });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setMessage({ type: 'success', text: 'Registro guardado exitosamente.' });
        setPhoneNumber('');
        setRating(0);
        setSelectedTags([]);
        
        // Refresh the local list
        fetchMyRecords();
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al procesar el registro.' });
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
            {isEditMode ? 'Refinar Telemetría' : 'Ingresar Telemetría'}
          </h1>
          <p className="font-sans text-cream/50 max-w-xl">
            Añade un nuevo reporte a la base de datos de PortalGuanaco. Toda la información será procesada y vinculada criptográficamente a tu perfil.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111111] border border-white/5 rounded-3xl p-8 flex flex-col gap-8 shadow-2xl">
          
          {message && (
            <div className={`p-4 rounded-xl text-sm font-sans ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
              {message.text}
            </div>
          )}

          {/* Phone Input */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50 pl-2">Cód. País</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/50 font-mono text-sm">+</span>
                <input 
                  type="text" 
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-carbon border border-white/10 rounded-2xl pl-8 pr-4 py-4 text-cream font-mono text-sm focus:outline-none focus:border-clay/50 transition-colors"
                  placeholder="503"
                  maxLength={4}
                  required
                />
              </div>
            </div>
            <div className="md:col-span-3 flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50 pl-2">Número de Objetivo</label>
              <input 
                type="text" 
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
            <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50 pl-2 flex items-center gap-2">
              Nivel de Confianza (Estrellas)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
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
          </div>

          <div className="w-full h-px bg-white/5"></div>

          {/* Tags */}
          <div className="flex flex-col gap-4">
            <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50 pl-2 flex items-center gap-2">
              <TagIcon className="w-3 h-3" />
              Etiquetas de Comportamiento
            </label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-2 rounded-full font-mono text-xs border transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-cream text-carbon border-cream'
                      : 'bg-transparent text-cream/50 border-white/10 hover:border-white/30'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
            {isEditMode ? (
              <button
                type="button"
                onClick={async () => {
                  if (!confirm('¿Estás seguro de eliminar (ocultar) este reporte?')) return;
                  setIsLoading(true);
                  try {
                    await apiFetch('/records.php?action=delete', {
                      method: 'POST',
                      body: JSON.stringify({ id: editId })
                    });
                    navigate('/dashboard');
                  } catch (error: any) {
                    setMessage({ type: 'error', text: 'Error al intentar eliminar: ' + error.message });
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="w-full sm:w-auto p-4 sm:px-6 sm:py-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-sans font-medium text-sm flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar Registro
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
                disabled={isLoading}
                className="w-full sm:w-auto magnetic-button bg-clay text-cream px-8 py-4 rounded-2xl font-sans font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Mis Reportes Activos */}
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
                  className="bg-carbon border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-white/20 hover:bg-white/5 transition-all gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="w-10 h-10 rounded-xl bg-[#111111] border border-white/5 flex items-center justify-center text-clay shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="w-full">
                      <div className="font-mono text-cream text-base mb-2 break-all group-hover:text-white transition-colors">
                        (+{record.country_code}) {record.phone_number}
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
                        <div className="flex items-center gap-1 text-cream/30 font-mono text-[9px] uppercase shrink-0">
                          <Calendar className="w-3 h-3" />
                          {new Date(record.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Etiquetas */}
                      {record.tags && record.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {record.tags.map((t: any, i: number) => (
                            <span key={`tag-${i}`} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono uppercase text-cream/60">
                              {t.tag_name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="hidden md:flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-sans text-[10px] text-cream/40 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
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
