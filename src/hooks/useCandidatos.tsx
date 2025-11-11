import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import type { Cargo } from './useCargos'; 
import type { Partido } from './usePartidos';

// --- TIPOS ---
export type Candidato = Database['public']['Tables']['candidates']['Row'];
export type NuevoCandidato = Database['public']['Tables']['candidates']['Insert'];
export type PerfilCandidato = Database['public']['Tables']['candidate_profiles']['Row'];

// Tipo para el candidato completo (Esta definición es PERFECTA)
export type CandidatoCompleto = Candidato & {
  positions: { 
    title: string;
    election_id: string;
  } | null;
  parties: { 
    name: string;
    logo_url: string | null; // Asegurado como 'null'
    description: string | null; // Asegurado como 'null'
  } | null;
  candidate_profiles: PerfilCandidato | null; // Objeto único o null
};

export type EleccionConCargos = Pick<Database['public']['Tables']['elections']['Row'], 'id' | 'title'> & {
  positions: Pick<Cargo, 'id' | 'title'>[]; 
};

export function useCandidatos() {
  const [candidatos, setCandidatos] = useState<CandidatoCompleto[]>([]);
  const [eleccionesAgrupadas, setEleccionesAgrupadas] = useState<EleccionConCargos[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  // --- 1. FUNCIÓN PARA LEER CANDIDATOS (ACTUALIZADA) ---
  const fetchCandidatos = useCallback(async () => {
    setError(null);
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select(`
          *,
          positions ( title, election_id ),
          parties ( name, logo_url, description ),
          candidate_profiles ( * )
        `)
        .order('full_name', { ascending: true });

      if (error) throw error;

      // 🚨 CORRECCIÓN CLAVE: "Aplanamos" el array de perfiles
      // Supabase devuelve candidate_profiles: [ { ... } ] o []
      // Lo convertimos a: candidate_profiles: { ... } o null
      const flattenedData = data.map(c => ({
        ...c,
        candidate_profiles: Array.isArray(c.candidate_profiles) 
          ? (c.candidate_profiles[0] || null) // Toma el primer perfil o null
          : (c.candidate_profiles || null),
      }));

      setCandidatos(flattenedData as CandidatoCompleto[] || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar candidatos.');
    }
  }, []);

  // --- 2. FUNCIÓN PARA CARGAR CARGOS AGRUPADOS ---
  const fetchGroupedPositions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('elections')
        .select(`id, title, positions ( id, title )`)
        .in('status', ['active', 'draft']) 
        .order('title', { ascending: true });
      
      if (error) throw error;
      setEleccionesAgrupadas(data as EleccionConCargos[]);
    } catch (err: any) {
      setError(err.message || 'Error al cargar cargos agrupados.');
    }
  }, []);

  // --- 3. FUNCIÓN PARA CARGAR PARTIDOS DISPONIBLES (Para el Modal) ---
  const fetchPartidos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('parties')
        .select('id, name, logo_url, description')
        .order('name', { ascending: true });
      if (error) throw error;
      setPartidos((data as Partido[]) || []);
    } catch (err: any) {
      console.error("Error cargando partidos (no crítico):", err.message);
    }
  }, []);


  // Cargar todos los datos al iniciar
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    Promise.all([
      fetchCandidatos(),
      fetchGroupedPositions(),
      fetchPartidos()
    ]).finally(() => {
      setLoading(false);
    });
  }, [fetchCandidatos, fetchGroupedPositions, fetchPartidos]);

  // --- 4. FUNCIONES CREATE/UPDATE/DELETE (Se mantienen igual) ---
  const saveCandidato = async (candidato: NuevoCandidato | Partial<NuevoCandidato>) => {
    setLoading(true);
    try {
      if ((candidato as Candidato).id) {
        await supabase.from('candidates').update(candidato).eq('id', (candidato as Candidato).id);
      } else {
        await supabase.from('candidates').insert(candidato as NuevoCandidato);
      }
      await fetchCandidatos(); 
    } catch (err: any) {
      setError(err.message || 'Error al guardar el candidato.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCandidato = async (id: string) => {
    setLoading(true);
    try {
      await supabase.from('candidates').delete().eq('id', id);
      await fetchCandidatos();
    } catch (err: any) {
      setError(err.message || 'Error al borrar el candidato.');
    } finally {
      setLoading(false);
    }
  };

  return {
    candidatos,
    eleccionesAgrupadas, 
    partidos, 
    loading,
    error,
    saveCandidato,
    deleteCandidato,
  };
}