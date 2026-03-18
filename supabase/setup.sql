-- Script de inicialización corregido para PortalGuanaco
-- Permite que múltiples clientes reporten el mismo número y mejora la robustez de perfiles

-- 1. Tabla de perfiles (Informantes)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );


-- 2. Tabla de registros telefónicos (Reportes)
CREATE TABLE IF NOT EXISTS phone_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  reputation_stars INTEGER CHECK (reputation_stars >= 1 AND reputation_stars <= 5),
  is_hidden BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE, -- Cambiado a CASCADE para limpieza
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  -- RESTRICCIÓN CORREGIDA: Un usuario no puede reportar el mismo número dos veces, 
  -- pero DIFERENTES usuarios sí pueden reportar el MISMO número.
  UNIQUE(created_by, country_code, phone_number) 
);

ALTER TABLE phone_records ENABLE ROW LEVEL SECURITY;

-- Políticas para phone_records
CREATE POLICY "Phone records are viewable by everyone"
  ON phone_records FOR SELECT
  USING ( is_hidden = false );

CREATE POLICY "Users can insert phone records"
  ON phone_records FOR INSERT
  WITH CHECK ( auth.uid() = created_by );

CREATE POLICY "Users can update their own phone records"
  ON phone_records FOR UPDATE
  USING ( auth.uid() = created_by );

CREATE POLICY "Users can delete their own phone records"
  ON phone_records FOR DELETE
  USING ( auth.uid() = created_by );


-- 3. Tabla de etiquetas de reputación
CREATE TABLE IF NOT EXISTS phone_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  record_id UUID REFERENCES phone_records(id) ON DELETE CASCADE,
  tag_name TEXT NOT NULL CHECK (tag_name IN ('no responde', 'no paga', 'devolucion', 'falso', 'Pedido completado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(record_id, tag_name)
);

ALTER TABLE phone_tags ENABLE ROW LEVEL SECURITY;

-- Políticas para phone_tags
CREATE POLICY "Phone tags are viewable by everyone"
  ON phone_tags FOR SELECT
  USING ( true );

CREATE POLICY "Users can manage tags for their own records"
  ON phone_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM phone_records
      WHERE phone_records.id = phone_tags.record_id
      AND phone_records.created_by = auth.uid()
    )
  );


-- 4. Automatización de Perfiles (Trigger Robusto)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone_number)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'phone_number', 'Informante No Registrado')
  )
  ON CONFLICT (id) DO NOTHING; -- Evita errores si ya existe
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. PROCEDIMIENTO DE EMERGENCIA: Backfill de perfiles faltantes
-- Ejecuta esto si ves el error de Foreign Key.
INSERT INTO public.profiles (id, email, phone_number)
SELECT id, email, COALESCE(raw_user_meta_data->>'phone_number', 'Registro Manual')
FROM auth.users
ON CONFLICT (id) DO NOTHING;
