-- ==============================================================================
-- 🛠️ SCRIPT DE REPARACIÓN DE POLÍTICAS RLS (Seguridad de Nivel de Fila)
-- Copia y pega este archivo completo en el SQL Editor de Supabase y ejecútalo.
-- ==============================================================================

-- 1. Deshabilitar temporalmente RLS para limpiar políticas viejas
ALTER TABLE phone_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE phone_tags DISABLE ROW LEVEL SECURITY;

-- 2. Eliminar TODAS las políticas existentes en phone_records
DROP POLICY IF EXISTS "Phone records are viewable by everyone" ON phone_records;
DROP POLICY IF EXISTS "Users can insert phone records" ON phone_records;
DROP POLICY IF EXISTS "Users can update their own phone records" ON phone_records;
DROP POLICY IF EXISTS "Users can delete their own phone records" ON phone_records;

-- 3. Eliminar TODAS las políticas existentes en phone_tags
DROP POLICY IF EXISTS "Phone tags are viewable by everyone" ON phone_tags;
DROP POLICY IF EXISTS "Users can manage tags for their own records" ON phone_tags;
DROP POLICY IF EXISTS "Users can insert tags" ON phone_tags;
DROP POLICY IF EXISTS "Users can update tags" ON phone_tags;
DROP POLICY IF EXISTS "Users can delete tags" ON phone_tags;

-- ==============================================================================
-- 4. RECREAR POLÍTICAS PARA: phone_records
-- ==============================================================================
ALTER TABLE phone_records ENABLE ROW LEVEL SECURITY;

-- SELECT: Todos pueden ver registros no ocultos, PERO el creador puede ver TODOS sus propios registros (incluso los ocultos)
CREATE POLICY "Select_phone_records" 
ON phone_records FOR SELECT 
USING (is_hidden = false OR auth.uid() = created_by);

-- INSERT: El usuario solo puede insertar a su nombre
CREATE POLICY "Insert_phone_records" 
ON phone_records FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- UPDATE: El usuario solo puede editar sus propios reportes
CREATE POLICY "Update_phone_records" 
ON phone_records FOR UPDATE 
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- DELETE: El usuario solo puede borrar sus propios reportes (por si acaso hacemos borrado físico en el futuro)
CREATE POLICY "Delete_phone_records" 
ON phone_records FOR DELETE 
USING (auth.uid() = created_by);


-- ==============================================================================
-- 5. RECREAR POLÍTICAS PARA: phone_tags
-- ==============================================================================
ALTER TABLE phone_tags ENABLE ROW LEVEL SECURITY;

-- SELECT: Todos pueden ver las etiquetas
CREATE POLICY "Select_phone_tags" 
ON phone_tags FOR SELECT 
USING (true);

-- INSERT: El usuario puede insertar etiquetas solo si él creó el reporte (record_id) asociado
CREATE POLICY "Insert_phone_tags" 
ON phone_tags FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM phone_records 
    WHERE phone_records.id = phone_tags.record_id 
    AND phone_records.created_by = auth.uid()
  )
);

-- UPDATE: El usuario puede actualizar etiquetas de sus propios reportes
CREATE POLICY "Update_phone_tags" 
ON phone_tags FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM phone_records 
    WHERE phone_records.id = phone_tags.record_id 
    AND phone_records.created_by = auth.uid()
  )
);

-- DELETE: El usuario puede borrar etiquetas de sus propios reportes
CREATE POLICY "Delete_phone_tags" 
ON phone_tags FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM phone_records 
    WHERE phone_records.id = phone_tags.record_id 
    AND phone_records.created_by = auth.uid()
  )
);

-- Notificar a la API
NOTIFY pgrst, 'reload schema';
