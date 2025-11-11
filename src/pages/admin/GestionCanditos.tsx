 import { useState, useMemo } from 'react';
import { useCandidatos } from '../../hooks/useCandidatos';
import type { Candidato } from '../../hooks/useCandidatos';
import CandidatosTable from '../../components/admin/candidatos/CandidatosTable';
import type { CandidatoConCargo } from '../../components/admin/candidatos/CandidatosTable';
import CandidatoModal from '../../components/admin/candidatos/CandidatoModal';
import { FaUserPlus, FaFilter } from 'react-icons/fa'; // 🚨 NUEVO: Importamos FaFilter

export default function GestionCandidatos() {
  const { 
    candidatos, 
    eleccionesAgrupadas, 
    partidos, // 🚨 NUEVO: Obtenemos la lista de partidos
    loading, 
    error, 
    saveCandidato, 
    deleteCandidato 
  } = useCandidatos();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidatoToEdit, setCandidatoToEdit] = useState<Candidato | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 🚨 NUEVO: Estado para el filtro
  const [electionFilter, setElectionFilter] = useState<string>('all'); 

  // 🚨 NUEVO: Lógica de filtrado
  const filteredCandidatos = useMemo(() => {
    if (electionFilter === 'all') {
      return candidatos; 
    }
    return candidatos.filter(candidato => {
      // (candidato as any) es necesario por el 'select' anidado
      const pos = (candidato as any).positions;
      return pos && pos.election_id === electionFilter;
    });
  }, [candidatos, electionFilter]);


  const handleOpenCreate = () => {
    setCandidatoToEdit(null);
    setIsModalOpen(true);
  };
  const handleOpenEdit = (candidato: Candidato) => {
    setCandidatoToEdit(candidato);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCandidatoToEdit(null);
  };

  const handleSubmit = async (candidatoData: any) => {
    setIsSubmitting(true);
    try {
      await saveCandidato(candidatoData);
      handleCloseModal(); 
    } catch (error) {
      console.error("Error al procesar candidato:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">
          Gestión de Candidatos 🇵🇪
        </h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 font-medium transition"
          disabled={loading || eleccionesAgrupadas.length === 0} 
        >
          <FaUserPlus />
          <span>Nuevo Candidato</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {eleccionesAgrupadas.length === 0 && !loading && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-4">
            ⚠️ No hay cargos definidos. Crea Elecciones y Cargos primero para poder añadir candidatos.
          </div>
      )}

      {/* 🚨 NUEVO: Barra de Filtro */}
      <div className="mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-3">
        <FaFilter className="text-gray-500" />
        <label htmlFor="electionFilter" className="text-sm font-medium text-gray-700">
          Filtrar por Elección:
        </label>
        <select
          id="electionFilter"
          value={electionFilter}
          onChange={(e) => setElectionFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm"
        >
          <option value="all">-- Mostrar Todas las Elecciones --</option>
          {eleccionesAgrupadas.map(eleccion => (
            <option key={eleccion.id} value={eleccion.id}>
              {eleccion.title}
            </option>
          ))}
        </select>
      </div>

      {loading && candidatos.length === 0 ? (
        <div className="text-center text-gray-500 py-16">Cargando candidatos...</div>
      ) : (
        <CandidatosTable
          candidatos={filteredCandidatos as CandidatoConCargo[]}
          onEdit={handleOpenEdit}
          onDelete={deleteCandidato}
          isActionLoading={loading}
        />
      )}

      <CandidatoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        candidatoToEdit={candidatoToEdit}
        eleccionesAgrupadas={eleccionesAgrupadas} 
        partidosDisponibles={partidos} // 🚨 NUEVO: Pasamos la lista de partidos al modal
        isSubmitting={isSubmitting}
      />
    </div>
  );
}