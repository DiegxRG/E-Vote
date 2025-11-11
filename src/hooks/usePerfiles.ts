import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

// --- TIPOS ---
export type Perfil = Database['public']['Tables']['candidate_profiles']['Row'];
export type NuevoPerfil = Database['public']['Tables']['candidate_profiles']['Insert'];

export type CandidatoConPerfil = 
  Database['public']['Tables']['candidates']['Row'] & {
    positions: { title: string } | null;
    parties: { name: string } | null;
    // 🚨 CORREGIDO: Ya no es un array '[]'.
    // Supabase devuelve un objeto (si hay 1-a-1) o null.
    candidate_profiles: { id: string } | null; 
  };

export function usePerfiles() {
  const [listaCandidatos, setListaCandidatos] = useState<CandidatoConPerfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 1. LEER (READ) ---
  const fetchListaCandidatos = useCallback(async () => {
    setLoading(true); 
    setError(null);
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select(`
          *, 
          positions ( title ),
          parties ( name ),
          candidate_profiles ( id ) 
        `) 
        .order('full_name', { ascending: true });
      if (error) throw error;
      setListaCandidatos(data as any[] || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la lista de perfiles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListaCandidatos();
  }, [fetchListaCandidatos]);

  // --- 2. GUARDAR (CREATE/UPDATE) ---
  const savePerfil = useCallback(async (perfilData: NuevoPerfil | Partial<Perfil>) => {
    try {
      const { error } = await supabase
        .from('candidate_profiles')
        .upsert(perfilData as any, { onConflict: 'candidate_id' }); 
      if (error) throw error;
      await fetchListaCandidatos(); // Refresca la lista
    } catch (err: any) {
      console.error("Error guardando el perfil:", err);
      throw err; 
    }
  }, [fetchListaCandidatos]);
  
  // --- 3. OBTENER PERFIL ÚNICO (Para el Modal) ---
  const fetchPerfilDetallado = useCallback(async (candidateId: string) => {
    try {
      const { data, error } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('candidate_id', candidateId)
        .maybeSingle();
      if (error) throw error;
      return data; 
    } catch (err: any) {
      console.error("Error obteniendo perfil detallado:", err);
      return null;
    }
  }, []); // Sin dependencias, es estable


  return {
    listaCandidatos,
    loading,
    error,
    savePerfil,
    fetchPerfilDetallado,
  };
}