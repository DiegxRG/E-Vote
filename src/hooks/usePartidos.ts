import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

// Definimos los tipos basados en la tabla 'parties'
// 🚨 CORRECCIÓN: Usamos Pick para seleccionar solo los tipos que pedimos en el 'select'
export type Partido = Pick<Database['public']['Tables']['parties']['Row'], 'id' | 'name' | 'logo_url' | 'description'>;
export type NuevoPartido = Database['public']['Tables']['parties']['Insert'];

export function usePartidos() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- 1. LEER (READ) ---
  const fetchPartidos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('parties')
        // Este select ahora coincide con el tipo 'Partido'
        .select('id, name, logo_url, description')
        .order('name', { ascending: true });

      if (error) throw error;
      setPartidos(data || []); // Esta línea ya no dará error
    } catch (err: any) {
      setError(err.message || 'Error al cargar partidos.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al inicio
  useEffect(() => {
    fetchPartidos();
  }, [fetchPartidos]);

  // --- 2. CREAR (CREATE) ---
  const addPartido = async (partido: NuevoPartido) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('parties').insert(partido);
      if (error) throw error;
      await fetchPartidos(); // Refrescar la lista
    } catch (err: any) {
      setError(err.message || 'Error al crear el partido.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- 3. ACTUALIZAR (UPDATE) ---
  const updatePartido = async (id: string, updates: Partial<NuevoPartido>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('parties')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      await fetchPartidos(); // Refrescar
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el partido.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- 4. BORRAR (DELETE) ---
  const deletePartido = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('parties').delete().eq('id', id);
      if (error) throw error;
      await fetchPartidos(); // Refrescar
    } catch (err: any) {
      setError(err.message || 'Error al borrar el partido.');
    } finally {
      setLoading(false);
    }
  };

  return {
    partidos,
    loading,
    error,
    addPartido,
    updatePartido,
    deletePartido,
  };
}