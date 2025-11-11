import { useState } from 'react';
import { usePartidos } from '../../hooks/usePartidos';
import type { Partido, NuevoPartido } from '../../hooks/usePartidos';
import PartidosTable from '../../components/admin/partidos/PartidosTable';
import PartidoModal from '../../components/admin/partidos/PartidoModal';
import { FaFlag } from 'react-icons/fa'; // Icono para partidos

export default function GestionPartidos() {
  const { 
    partidos, 
    loading, 
    error, 
    addPartido, 
    updatePartido, 
    deletePartido 
  } = usePartidos();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partidoToEdit, setPartidoToEdit] = useState<Partido | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setPartidoToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (partido: Partido) => {
    setPartidoToEdit(partido);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPartidoToEdit(null);
  };

  const handleSubmit = async (partidoData: NuevoPartido | Partial<Partido>) => {
    setIsSubmitting(true);
    try {
      if ((partidoData as Partido).id) {
        // Actualizar
        await updatePartido((partidoData as Partido).id, partidoData);
      } else {
        // Crear
        await addPartido(partidoData as NuevoPartido);
      }
      handleCloseModal(); // Cierra solo si tiene éxito
    } catch (error) {
      console.error("Error al procesar partido:", error);
      // Mantenemos el modal abierto si hay error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Cabecera de la página */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">
          Gestión de Partidos Políticos
        </h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 font-medium transition"
        >
          <FaFlag />
          <span>Nuevo Partido</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading && partidos.length === 0 ? (
        <div className="text-center text-gray-500 py-16">Cargando partidos...</div>
      ) : (
        <PartidosTable
          partidos={partidos}
          onEdit={handleOpenEdit}
          onDelete={deletePartido}
          isActionLoading={loading} // El loading general del hook
        />
      )}

      <PartidoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        partidoToEdit={partidoToEdit}
        isSubmitting={isSubmitting} // Pasamos el estado de submitting
      />
    </div>
  );
}