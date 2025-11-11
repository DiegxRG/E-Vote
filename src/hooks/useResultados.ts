// hooks/useResultados.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
// Reutilizamos tipos de useVoto (asegúrate de que la ruta sea correcta)
import type { Election, Position, Candidate } from './useVoto'; 

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
}

export function useResultados() {
  const [processedResults, setProcessedResults] = useState<ResultadoEleccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. FUNCIÓN DE CARGA DE DATOS (CORREGIDA)
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log('--- DEBUG RESULTADOS: Iniciando fetchAllData ---');
    try {
      const [electionsRes, candidatesRes, votesRes] = await Promise.all([
        
        // a. Traer elecciones cerradas
        supabase
          .from('elections')
          .select('*')
          // 🚨 CORRECCIÓN CLAVE: Usamos 'closed' (minúsculas)
          .eq('status', 'closed'), 
        
        // b. Traer todos los candidatos con sus cargos (positions)
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
      
      const closedElections = (electionsRes.data || []) as Election[];
      const allCandidates = (candidatesRes.data || []) as any[]; 
      const allVotes = (votesRes.data || []) as Voto[]; 

      // DEBUG:
      console.log(`DEBUG: Elecciones cerradas encontradas: ${closedElections.length}`, closedElections.map(e => e.title));
      console.log(`DEBUG: Candidatos totales encontrados: ${allCandidates.length}`);
      console.log(`DEBUG: Votos totales encontrados: ${allVotes.length}`);

      // 2. PROCESAMIENTO DE DATOS (El Conteo)
      const results = processVoteData(closedElections, allCandidates, allVotes);
      
      console.log('DEBUG: Resultados procesados:', results);
      
      setProcessedResults(results);

    } catch (err: any) {
      setError(err.message || 'Error al procesar los resultados.');
      console.error("Error en fetchAllData:", err);
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
    
    console.log('--- DEBUG RESULTADOS: Iniciando processVoteData ---');
    
    return elections.map(election => {
      console.log(`Procesando elección: ${election.title}`);
      
      const positionMap = new Map<string, any>();
      candidates.forEach(c => {
        if (c.positions?.election_id === election.id) {
          positionMap.set(c.positions.id, c.positions);
        }
      });
      const positionsInElection = Array.from(positionMap.values());
      console.log(`Cargos para esta elección: ${positionsInElection.length}`);

      const processedPositions: ResultadoCargo[] = positionsInElection.map(pos => {
        const candidatesForPosition = candidates.filter(c => c.position_id === pos.id);
        console.log(`...Cargo "${pos.title}": ${candidatesForPosition.length} candidatos`);
        
        const candidateResults: ResultadoCandidato[] = candidatesForPosition.map(cand => {
          const voteCount = votes.filter(v => v.candidate_id === cand.id).length;
          console.log(`......Candidato "${cand.full_name}": ${voteCount} votos`);
          return {
            id: cand.id,
            fullName: cand.full_name,
            voteCount: voteCount,
          };
        });
        
        const blankVotes = votes.filter(v => v.position_id === pos.id && v.candidate_id === null).length;
        console.log(`......Votos en Blanco/Nulos: ${blankVotes}`);
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
      };
    });
  };

  return { processedResults, loading, error };
}