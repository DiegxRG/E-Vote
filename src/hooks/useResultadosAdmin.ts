import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
// Reutilizamos tipos de useVoto (asegúrate de que la ruta sea correcta)
import type { Election, Position, Candidate } from './useVoto'; 

// 🚨 ELIMINADA la importación circular de './useResultados'

type Voto = {
  id: string;
  candidate_id: string | null;
  position_id: string | null;
  election_id: string | null;
};

// --- TIPOS DE DATOS PROCESADOS ---
export interface ResultadoCandidato {
  id: string;
  fullName: string;
  voteCount: number;
}
export interface ResultadoCargo {
  id: string;
  title: string;
  totalVotes: number;
  results: ResultadoCandidato[];
}
export interface ResultadoEleccion {
  id: string;
  title: string;
  positions: ResultadoCargo[];
  status: string; 
}

export function useResultadosAdmin() {
  const [processedResults, setProcessedResults] = useState<ResultadoEleccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. FUNCIÓN DE CARGA DE DATOS (Admin)
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [electionsRes, candidatesRes, votesRes] = await Promise.all([
        
        // a. Traer elecciones ACTIVAS y CERRADAS
        supabase
          .from('elections')
          .select('*')
          .in('status', ['active', 'closed']), 
        
        // b. Traer todos los candidatos con sus cargos
        supabase
          .from('candidates')
          .select('*, positions ( id, title, election_id )'),
          
        // c. Traer TODOS los votos
        supabase
          .from('votes')
          .select('id, candidate_id, position_id, election_id')
      ]); 

      if (electionsRes.error) throw new Error(`Error cargando elecciones: ${electionsRes.error.message}`);
      if (candidatesRes.error) throw new Error(`Error cargando candidatos: ${candidatesRes.error.message}`);
      if (votesRes.error) throw new Error(`Error cargando votos: ${votesRes.error.message}`);
      
      const elections = (electionsRes.data || []) as Election[];
      const allCandidates = (electionsRes.data || []) as any[]; 
      const allVotes = (votesRes.data || []) as Voto[]; 

      // 2. PROCESAMIENTO DE DATOS (El Conteo)
      const results = processVoteData(elections, allCandidates, allVotes);
      setProcessedResults(results);

    } catch (err: any) {
      setError(err.message || 'Error al procesar los resultados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // 3. FUNCIÓN DE CONTEO
  const processVoteData = (
    elections: Election[], 
    candidates: any[], 
    votes: Voto[]
  ): ResultadoEleccion[] => {
    
    return elections.map(election => {
      
      const positionMap = new Map<string, any>();
      candidates.forEach(c => {
        if (c.positions?.election_id === election.id) {
          positionMap.set(c.positions.id, c.positions);
        }
      });
      const positionsInElection = Array.from(positionMap.values());

      const processedPositions: ResultadoCargo[] = positionsInElection.map(pos => {
        const candidatesForPosition = candidates.filter(c => c.position_id === pos.id);
        
        const candidateResults: ResultadoCandidato[] = candidatesForPosition.map(cand => {
          const voteCount = votes.filter(v => v.candidate_id === cand.id).length;
          return {
            id: cand.id,
            fullName: cand.full_name,
            voteCount: voteCount,
          };
        });
        
        const blankVotes = votes.filter(v => v.position_id === pos.id && v.candidate_id === null).length;
        if (blankVotes > 0) {
            candidateResults.push({ id: 'blank', fullName: 'Votos en Blanco/Nulos', voteCount: blankVotes });
        }
        candidateResults.sort((a, b) => b.voteCount - a.voteCount);

        return {
          id: pos.id,
          title: pos.title,
          totalVotes: candidateResults.reduce((sum, c) => sum + c.voteCount, 0),
          results: candidateResults,
        };
      });

      return {
        id: election.id,
        title: election.title,
        positions: processedPositions,
        status: election.status,
      };
    });
  };
  
  // 4. FUNCIÓN PARA CERRAR ELECCIÓN
  const closeElection = async (electionId: string) => {
    setLoading(true);
    try {
        const { error } = await supabase
            .from('elections')
            .update({ status: 'closed' }) // Asegúrate que la BD acepte minúsculas
            .eq('id', electionId);
        if (error) throw error;
        await fetchAllData(); 
    } catch (err: any) {
        console.error("Error al cerrar la elección:", err);
        setError(err.message || 'No se pudo cerrar la elección.');
    } finally {
        setLoading(false);
    }
  };

  return { processedResults, loading, error, closeElection };
}