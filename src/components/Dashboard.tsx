import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { getTagBadgeClass } from '../lib/tags';
import { 
  BarChart3, 
  Search, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  Phone,
  Calendar,
  Star,
  EyeOff,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Record {
  id: string;
  country_code: string;
  phone_number: string;
  reputation_stars: number;
  created_at: string;
  is_hidden: boolean;
  tags?: { tag_name: string }[];
}

export const Dashboard: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [showHidden, setShowHidden] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const { user: profileData } = await apiFetch('/auth.php?action=me');
      setProfile(profileData);

      // Fetch ALL records (including hidden) for the owner
      const { data: recordsData } = await apiFetch('/records.php?action=my_records');
      setRecords(recordsData || []);
    } catch (error) {
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVisibility = async (e: React.MouseEvent, record: Record) => {
    e.stopPropagation(); // Prevent card click
    try {
      await apiFetch('/records.php?action=toggle_visibility', {
        method: 'POST',
        body: JSON.stringify({ id: record.id, hide: !record.is_hidden })
      });
      // Update locally
      setRecords(prev => prev.map(r => r.id === record.id ? { ...r, is_hidden: !r.is_hidden } : r));
    } catch (err) {
      console.error('Error toggling visibility:', err);
    }
  };

  const activeRecords = records.filter(r => !r.is_hidden);
  const hiddenRecords = records.filter(r => r.is_hidden);
  const displayedRecords = showHidden ? records : activeRecords;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-clay animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="font-serif italic text-4xl text-cream mb-2">Panel de Control</h1>
          <div className="flex items-center gap-3 text-cream/60 font-mono text-xs uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>ID: {profile?.id ? profile.id.split('-')[0] : '...'}</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>{profile?.email}</span>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/submit')}
          className="magnetic-button bg-clay text-cream px-6 py-3 rounded-2xl font-sans font-medium text-sm flex items-center gap-2"
        >
          Nuevo Reporte
          <Phone className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-[#111111] border border-white/5 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-5 h-5 text-clay" />
              <h2 className="font-sans font-bold text-cream uppercase tracking-wider text-xs">Tu Actividad</h2>
            </div>
            <div className="text-5xl font-serif italic text-cream mb-1">{activeRecords.length}</div>
            <p className="text-cream/40 text-sm font-sans">Reportes activos en El Salvador.</p>
            
            {hiddenRecords.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-cream/50 font-mono text-xs">
                  <EyeOff className="w-3 h-3" />
                  <span>{hiddenRecords.length} registros ocultos</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-clay/5 border border-clay/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-clay" />
              <h2 className="font-sans font-bold text-cream uppercase tracking-wider text-xs">Protección Activa</h2>
            </div>
            <p className="text-cream/60 text-sm font-sans leading-relaxed">
              Tus reportes ayudan a miles de emprendedores a evitar fraudes en tiempo real.
            </p>
          </div>

          {/* Toggle hidden records */}
          {hiddenRecords.length > 0 && (
            <button
              onClick={() => setShowHidden(v => !v)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-mono text-xs uppercase tracking-widest transition-all border
                ${showHidden 
                  ? 'bg-white/10 border-white/20 text-cream' 
                  : 'bg-transparent border-white/5 text-cream/30 hover:border-white/20 hover:text-cream/60'
                }`}
            >
              <EyeOff className="w-3 h-3" />
              {showHidden ? 'Ocultar registros archivados' : `Mostrar ${hiddenRecords.length} archivados`}
            </button>
          )}
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-4 pl-2">
            <h2 className="font-sans font-bold text-cream uppercase tracking-widest text-xs flex items-center gap-2">
              <Activity className="w-3 h-3 text-clay" />
              Mis Registros
            </h2>
            <div className="text-cream/50 text-xs uppercase font-mono">{displayedRecords.length} Registros</div>
          </div>

          {displayedRecords.length === 0 ? (
            <div className="bg-[#111111] border border-dashed border-white/10 rounded-3xl py-20 flex flex-col items-center justify-center text-center px-10">
              <Search className="w-12 h-12 text-white/5 mb-4" />
              <p className="text-cream/40 font-sans italic">Aún no has reportado ningún número.</p>
            </div>
          ) : (
            displayedRecords.map((record) => (
              <div 
                key={record.id}
                onClick={() => navigate(`/edit/${record.id}`)}
                className={`border rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-white/20 hover:bg-white/5 transition-all gap-6 md:gap-4 cursor-pointer
                  ${record.is_hidden 
                    ? 'bg-white/2 border-white/5 opacity-50 hover:opacity-80' 
                    : 'bg-[#111111] border-white/5'
                  }`}
              >
                <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-colors
                    ${record.is_hidden ? 'bg-white/5 border-white/5 text-cream/30' : 'bg-carbon border-white/5 text-clay'}`}
                  >
                    {record.is_hidden ? <EyeOff className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                  </div>
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <div className="font-mono text-cream text-base sm:text-lg break-all group-hover:text-white transition-colors">
                        (+{record.country_code}) {record.phone_number}
                      </div>
                      {record.is_hidden && (
                        <span className="font-mono text-xs uppercase px-2 py-0.5 rounded-full border border-white/10 text-cream/50 bg-white/5 shrink-0">
                          Archivado
                        </span>
                      )}
                    </div>

                    {/* Estrellas y Fecha */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="flex gap-1 shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={`d-star-${i}`} 
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
                            key={`d-tag-${i}`}
                            className={`px-2 py-0.5 rounded-full border text-xs font-mono uppercase ${getTagBadgeClass(t.tag_name)}`}
                          >
                            {t.tag_name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                  {/* Toggle visibility button */}
                  <button
                    onClick={(e) => handleToggleVisibility(e, record)}
                    title={record.is_hidden ? 'Revivir registro' : 'Ocultar registro'}
                    className={`p-2 rounded-xl border transition-all text-xs font-mono flex items-center gap-1
                      ${record.is_hidden 
                        ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500 hover:text-white' 
                        : 'bg-white/5 border-white/10 text-cream/40 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400'
                      }`}
                  >
                    <EyeOff className="w-3 h-3" />
                    <span className="hidden sm:inline">{record.is_hidden ? 'Revivir' : 'Ocultar'}</span>
                  </button>

                  <span className="font-sans text-xs text-cream/40 px-4 py-2 bg-white/5 rounded-xl border border-white/10 hidden md:flex items-center">
                    Editar →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
