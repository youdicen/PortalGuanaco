import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Faltan las variables de entorno de Supabase. Por favor, crea un archivo .env y configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY con los valores de tu proyecto "PortalGuanaco".');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
