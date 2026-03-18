-- ACTUALIZACIÓN PARA BORRADO LÓGICO Y DUPLICADOS ACTIVOS
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Añadir columna is_hidden si no existe
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'phone_records' AND COLUMN_NAME = 'is_hidden') THEN
    ALTER TABLE phone_records ADD COLUMN is_hidden BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 2. Eliminar la restricción UNIQUE anterior (que bloqueaba todos los duplicados)
ALTER TABLE phone_records DROP CONSTRAINT IF EXISTS phone_records_user_phone_unique;

-- 3. Crear un ÍNDICE ÚNICO PARCIAL
-- Este índice asegura que un usuario no pueda registrar el MISMO número dos veces
-- SOLO si el registro anterior está activo (is_hidden = false o is_hidden IS NULL)
-- Si is_hidden = true, permite el duplicado.
DROP INDEX IF EXISTS phone_records_active_user_phone_idx;
CREATE UNIQUE INDEX phone_records_active_user_phone_idx 
ON phone_records (created_by, country_code, phone_number) 
WHERE (is_hidden IS NULL OR is_hidden = false);

-- 4. Notificar a PostgREST
NOTIFY pgrst, 'reload schema';
