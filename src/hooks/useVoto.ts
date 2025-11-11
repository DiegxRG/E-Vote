// hooks/useVoto.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase'; 

// --- Tipos ---
export interface Candidate {
  id: string;
  full_name: string;
  party_name: string | null;
  photo_url: string | null;
  position_id: string;
}
export interface Position {
  id: string;
  title: string;
  election_id: string;
  candidates: Candidate[];
}
export interface Election {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'closed'; 
}
interface CategorizedElections {
  active: Election[];
  upcoming: Election[];
  closed: Election[];
}
export type VotoSeleccionado = Record<string, string | null>; 

interface VotoHook {
  allCategorizedElections: CategorizedElections; 
  selectedElection: Election | null;
  positions: Position[] | null;
  cargando: boolean;
  error: string | null;
  votoSeleccionado: VotoSeleccionado;
  updateSelection: (positionId: string, candidateId: string | null) => void;
  submitVote: () => Promise<void>;
  isSubmitting: boolean;
  votoError: string | null;
  selectElection: (electionId: string) => void;
  resetVoto: () => void; 
}

// --- Hook Principal ---
export function useVoto(): VotoHook {
  const [allElections, setAllElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [positions, setPositions] = useState<Position[] | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votoSeleccionado, setVotoSeleccionado] = useState<VotoSeleccionado>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votoError, setVotoError] = useState<string | null>(null);

  // --- Cargar elecciones ---
  const fetchAllRelevantElections = useCallback(async () => {
    setError(null);
    setCargando(true);
    
    const { data, error } = await supabase
      .from('elections')
      .select('id, title, start_date, end_date, status')
      .neq('status', 'draft') 
      .order('start_date', { ascending: true });

    if (error) {
      setError('Error al cargar elecciones: ' + error.message);
      setAllElections([]);
    } else {
      setAllElections(data as Election[]);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    fetchAllRelevantElections();
  }, [fetchAllRelevantElections]);
  
  // --- Clasificar elecciones ---
  const allCategorizedElections = useMemo(() => {
    const now = new Date().getTime();
    const categorized: CategorizedElections = { active: [], upcoming: [], closed: [] };

    for (const election of allElections) {
      const start = new Date(election.start_date).getTime();
      const end = new Date(election.end_date).getTime();

      if (election.status === 'active' && start <= now && end >= now) categorized.active.push(election);
      else if (election.status === 'active' && start > now) categorized.upcoming.push(election);
      else if (election.status === 'closed' || end < now) categorized.closed.push(election);
    }
    return categorized;
  }, [allElections]);

  // --- Selección y reseteo ---
  const resetVoto = useCallback(() => {
    setVotoSeleccionado({});
    setVotoError(null);
  }, []);

  const selectElection = (electionId: string) => {
    const election = allElections.find(e => e.id === electionId);
    setSelectedElection(election || null);
    setPositions(null);
    setError(null);
    resetVoto();
  };
  
  // --- Cargar cargos y candidatos ---
  useEffect(() => {
    if (!selectedElection) {
      setPositions(null);
      return;
    }

    const fetchPositionsAndCandidates = async () => {
      setCargando(true);
      setError(null);

      const { data: positionsData, error: posError } = await supabase
        .from('positions')
        .select(`
          id,
          title,
          election_id,
          candidates (
            id,
            full_name,
            photo_url,
            position_id,
            party_name:parties ( name )
          )
        `)
        .eq('election_id', selectedElection.id)
        .order('title', { ascending: true });

      if (posError) {
        setError('Error al cargar cargos: ' + posError.message);
        setCargando(false);
        return;
      }

      const finalPositions = (positionsData ?? []).map((pos: any) => ({
        id: pos.id,
        title: pos.title,
        election_id: pos.election_id,
        candidates: (pos.candidates ?? []).map((c: any) => ({
          id: c.id,
          full_name: c.full_name,
          party_name: typeof c.party_name === 'object' ? c.party_name?.name ?? null : c.party_name,
          photo_url: c.photo_url ?? null,
          position_id: c.position_id,
        })),
      }));

      if (finalPositions.length > 0 && finalPositions.every(p => p.candidates.length === 0)) {
        setError("Error de datos: Los candidatos no están asignados correctamente a los cargos.");
      }

      setPositions(finalPositions);
      setCargando(false);
    };

    fetchPositionsAndCandidates();
  }, [selectedElection, resetVoto]);

  // --- Actualizar selección ---
  const updateSelection = useCallback((positionId: string, candidateId: string | null) => {
    setVotoSeleccionado(prev => ({
      ...prev,
      [positionId]: candidateId,
    }));
  }, []);

  // --- Enviar voto ---
  const submitVote = useCallback(async () => {
    if (!selectedElection || !positions) {
      setVotoError('No hay una elección seleccionada.');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setVotoError('Usuario no autenticado.');
      return;
    }

    setIsSubmitting(true);
    setVotoError(null);

    const votesToInsert = Object.entries(votoSeleccionado).map(([positionId, candidateId]) => ({
      user_id: user.id,
      election_id: selectedElection.id,
      position_id: positionId,
      candidate_id: candidateId,
    }));

    try {
      const { error: insertError } = await supabase.from('votes').insert(votesToInsert);
      if (insertError) {
        if (insertError.code === '23505') throw new Error('Ya has emitido un voto para esta elección.');
        throw insertError;
      }
      console.log("✅ Voto registrado correctamente.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido al emitir el voto.';
      setVotoError(msg);
      console.error("❌ Error al votar:", msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedElection, votoSeleccionado, positions]);

  return {
    allCategorizedElections,
    selectedElection,
    positions,
    cargando,
    error,
    votoSeleccionado, 
    updateSelection, 
    submitVote, 
    isSubmitting, 
    votoError, 
    selectElection,
    resetVoto, 
  };
}
