import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  BarChart3, 
  Search, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  Phone,
  Calendar,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Record {
  id: string;
  country_code: string;
  phone_number: string;
  reputation_stars: number;
  created_at: string;
  tags?: { tag_name: string }[];
}

export const Dashboard: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    // Perfil
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    setProfile(profileData);

    // Registros Propios
    const { data: recordsData, error } = await supabase
      .from('phone_records')
      .select(`
        *,
        tags:phone_tags(tag_name)
      `)
      .eq('created_by', user.id)
      .neq('is_hidden', true)
      .order('created_at', { ascending: false });

    if (!error) setRecords(recordsData || []);
    setIsLoading(false);
  };

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
          <div className="flex items-center gap-3 text-cream/40 font-mono text-xs uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>ID: {profile?.phone_number || 'Cargando...'}</span>
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
            <div className="text-5xl font-serif italic text-cream mb-2">{records.length}</div>
            <p className="text-cream/40 text-sm font-sans">Reportes generados en El Salvador.</p>
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
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-4 pl-2">
            <h2 className="font-sans font-bold text-cream uppercase tracking-widest text-xs">Historial de Reportes</h2>
            <div className="text-cream/30 text-[10px] uppercase font-mono">{records.length} Registros</div>
          </div>

          {records.length === 0 ? (
            <div className="bg-[#111111] border border-dashed border-white/10 rounded-3xl py-20 flex flex-col items-center justify-center text-center px-10">
              <Search className="w-12 h-12 text-white/5 mb-4" />
              <p className="text-cream/40 font-sans italic">Aún no has reportado ningún número.</p>
            </div>
          ) : (
            records.map((record) => (
              <div 
                key={record.id}
                onClick={() => navigate(`/edit/${record.id}`)}
                className="bg-[#111111] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-white/20 hover:bg-white/5 transition-all gap-6 md:gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-2xl bg-carbon border border-white/5 flex items-center justify-center text-clay shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="w-full">
                    <div className="font-mono text-cream text-base sm:text-lg mb-2 break-all group-hover:text-white transition-colors">
                      (+{record.country_code}) {record.phone_number}
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
                      <div className="flex items-center gap-1 text-cream/30 font-mono text-[9px] uppercase shrink-0">
                        <Calendar className="w-3 h-3" />
                        {new Date(record.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Etiquetas */}
                    {record.tags && record.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {record.tags.map((t: any, i: number) => (
                          <span key={`d-tag-${i}`} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono uppercase text-cream/60">
                            {t.tag_name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="hidden md:flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-sans text-xs text-cream/40 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                    Editar Reporte →
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
