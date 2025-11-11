// pages/admin/GestionPerfiles.tsx
import { useState } from 'react';
import { usePerfiles } from '../../hooks/usePerfiles';
import type { CandidatoConPerfil } from '../../hooks/usePerfiles';
import ListaPerfilesTable from '../../components/admin/perfiles/ListaPerfilesTable';
import PerfilModal from '../../components/admin/perfiles/PerfilModal';
import { FaAddressCard } from 'react-icons/fa';

export default function GestionPerfiles() {
  // El hook se llama UNA SOLA VEZ aquí
  const { 
    listaCandidatos, 
    loading, 
    error, 
    savePerfil, 
    fetchPerfilDetallado
  } = usePerfiles();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidatoConPerfil | null>(null);

  const handleOpenEdit = (candidato: CandidatoConPerfil) => {
    setSelectedCandidate(candidato);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  return (
    <div>
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">
          Constructor de Perfiles de Candidato
        </h1>
        <div className="flex items-center space-x-2 text-gray-500">
          <FaAddressCard />
          <span>Editando Afiches de Candidatos</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <p className="mb-4 text-gray-600">
        Esta sección te permite editar el "afiche" público de cada candidato. Haz clic en "Crear/Editar Perfil" para añadir el plan de gobierno y las fotos que verá el votante.
      </p>

      {/* Tabla de Perfiles */}
      <ListaPerfilesTable
        candidatos={listaCandidatos}
        onEditClick={handleOpenEdit}
        isLoading={loading}
      />

      {/* Modal actualizado para recibir las funciones como props */}
      <PerfilModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        candidate={selectedCandidate}
        onSave={savePerfil} // Pasamos la función de guardar
        onFetchDetallado={fetchPerfilDetallado} // Pasamos la función de cargar
      />
    </div>
  );
}