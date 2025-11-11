import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

// Definición de Tipos para la tabla 'positions'
export type Cargo = Database['public']['Tables']['positions']['Row'];
export type NuevoCargo = Database['public']['Tables']['positions']['Insert'];

// El hook acepta el ID de la elección actual como parámetro
export function useCargos(electionId: string | null) {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- 1. FUNCIÓN PARA LEER (READ) ---
  const fetchCargos = useCallback(async () => {
    if (!electionId) {
      setCargos([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('election_id', electionId) // FILTRADO CLAVE
        .order('title', { ascending: true });

      if (error) throw error;
      setCargos(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar cargos.');
    } finally {
      setLoading(false);
    }
  }, [electionId]); // Se ejecuta cada vez que cambia la elección

  useEffect(() => {
    fetchCargos();
  }, [fetchCargos]);

  // --- 2. FUNCIÓN PARA CREAR (CREATE) ---
  const addCargo = async (cargo: Omit<NuevoCargo, 'election_id'>) => {
    if (!electionId) throw new Error("No hay una elección seleccionada.");
    setLoading(true);
    try {
      // Insertamos el cargo, añadiendo el ID de la elección actual
      const cargoWithId = { ...cargo, election_id: electionId };
      const { error } = await supabase.from('positions').insert(cargoWithId as NuevoCargo);
      if (error) throw error;
      await fetchCargos(); 
    } catch (err: any) {
      setError(err.message || 'Error al crear el cargo.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- 3. FUNCIÓN PARA ACTUALIZAR (UPDATE) ---
  const updateCargo = async (id: string, cargo: Partial<NuevoCargo>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('positions')
        .update(cargo)
        .eq('id', id);
      if (error) throw error;
      await fetchCargos();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el cargo.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- 4. FUNCIÓN PARA BORRAR (DELETE) ---
  const deleteCargo = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('positions').delete().eq('id', id);
      if (error) throw error;
      await fetchCargos();
    } catch (err: any) {
      setError(err.message || 'Error al borrar el cargo.');
    } finally {
      setLoading(false);
    }
  };

  return {
    cargos,
    loading,
    error,
    addCargo,
    updateCargo,
    deleteCargo,
    fetchCargos, // Lo devolvemos por si necesitamos refrescar manualmente
  };
}