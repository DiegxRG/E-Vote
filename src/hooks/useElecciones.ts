import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase'; // (Necesitaremos crear este tipo)

// Definimos el tipo basado en tu tabla 'elections'
export type Eleccion = Database['public']['Tables']['elections']['Row'];
export type NuevaEleccion = Database['public']['Tables']['elections']['Insert'];

export function useElecciones() {
  const [elecciones, setElecciones] = useState<Eleccion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- 1. FUNCIÓN PARA LEER (READ) ---
  const fetchElecciones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('elections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setElecciones(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar elecciones.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar las elecciones al iniciar el hook
  useEffect(() => {
    fetchElecciones();
  }, [fetchElecciones]);

  // --- 2. FUNCIÓN PARA CREAR (CREATE) ---
  const addEleccion = async (eleccion: NuevaEleccion) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('elections').insert(eleccion);
      if (error) throw error;
      // Refrescar la lista después de crear
      await fetchElecciones(); 
    } catch (err: any) {
      setError(err.message || 'Error al crear la elección.');
      throw err; // Lanza el error para que el formulario sepa que falló
    } finally {
      setLoading(false);
    }
  };

  // --- 3. FUNCIÓN PARA ACTUALIZAR (UPDATE) ---
  const updateEleccion = async (id: string, eleccion: Partial<NuevaEleccion>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('elections')
        .update(eleccion)
        .eq('id', id);
      if (error) throw error;
      await fetchElecciones(); // Refrescar
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la elección.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- 4. FUNCIÓN PARA BORRAR (DELETE) ---
  const deleteEleccion = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('elections').delete().eq('id', id);
      if (error) throw error;
      await fetchElecciones(); // Refrescar
    } catch (err: any) {
      setError(err.message || 'Error al borrar la elección.');
    } finally {
      setLoading(false);
    }
  };

  return {
    elecciones,
    loading,
    error,
    addEleccion,
    updateEleccion,
    deleteEleccion,
  };
}