// pages/admin/GestionElecciones.tsx
import { useState } from 'react';
// Añadimos FaCog para el botón de "Gestionar" de la Imagen 1
import { FaPlusCircle, FaEdit, FaTrash, FaCog } from 'react-icons/fa'; 
import { useElecciones } from '../../hooks/useElecciones';
import type { Eleccion, NuevaEleccion } from '../../hooks/useElecciones';
import EleccionModal from '../../components/admin/elecciones/EleccionModal';
import CargosModule from '../../components/admin/elecciones/CargosModule';

// --- Helper Component para el Badge de Estado (como en Imagen 1) ---
// Puedes mover esto a un archivo separado si lo prefieres
const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-600';
  let dotColor = 'bg-gray-400';

  if (s === 'active' || s === 'en curso') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-700';
    dotColor = 'bg-green-500';
  } else if (s === 'draft' || s === 'borrador') {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-700';
    dotColor = 'bg-yellow-500';
  } else if (s === 'closed' || s === 'cerrada') {
    bgColor = 'bg-gray-200';
    textColor = 'text-gray-700';
    dotColor = 'bg-gray-500';
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
      {s === 'active' || s === 'en curso' ? (
        <span className={`h-2 w-2 rounded-full mr-1.5 ${dotColor}`}></span>
      ) : null}
      {status.toUpperCase()}
    </span>
  );
};


export default function GestionElecciones() {
  const { 
    elecciones, 
    loading, 
    error, 
    addEleccion, 
    updateEleccion, 
    deleteEleccion 
  } = useElecciones();

  // --- ESTADO LOCAL (Sin cambios) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eleccionToEdit, setEleccionToEdit] = useState<Eleccion | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedElection, setSelectedElection] = useState<Eleccion | null>(null); 

  // --- MANEJADORES (Sin cambios) ---
  const handleOpenCreate = () => {
    setEleccionToEdit(null); 
    setIsModalOpen(true);
  };
  const handleOpenEdit = (eleccion: Eleccion) => {
    setEleccionToEdit(eleccion);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEleccionToEdit(null);
  };

  const handleSubmit = async (eleccionData: NuevaEleccion | Partial<NuevaEleccion>) => {
    setIsSubmitting(true);
    try {
      if (eleccionToEdit) {
        await updateEleccion(eleccionToEdit.id, eleccionData);
      } else {
        await addEleccion(eleccionData as NuevaEleccion);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error al procesar la elección:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER (Re-diseñado para coincidir con Imagen 1) ---
  return (
    <div className="p-6 md:p-8 bg-slate-100 min-h-full">
      
      {/* 1. ENCABEZADO (Estilo Imagen 1) */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Elecciones
          </h1>
          <p className="mt-1 text-gray-500">
            Administra todas las elecciones del sistema
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 font-medium transition mt-4 md:mt-0"
          disabled={loading}
        >
          <FaPlusCircle />
          <span>Nueva Elección</span>
        </button>
      </div>

      {/* 2. CONTENIDO GRID (Tu lógica de layout original) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* 3. COLUMNA PRINCIPAL (Tu lógica de col-span original) */}
        <div className={selectedElection ? "xl:col-span-2" : "xl:col-span-3"}>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6" role="alert">
              <strong>Error de conexión:</strong> {error}
            </div>
          )}

          {loading && elecciones.length === 0 ? (
            <div className="text-center text-gray-500 py-16 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-blue-600 mb-4"></div>
              <p className="text-lg font-medium text-gray-600">Cargando datos electorales...</p>
            </div>
          ) : (
            // Contenedor de las tarjetas
            <div className="space-y-6">
              {elecciones.map(eleccion => (
                
                // TARJETA DE ELECCIÓN (Estilo Imagen 1)
                <div 
                  key={eleccion.id} 
                  className={`bg-white rounded-lg shadow-md border transition-all ${selectedElection?.id === eleccion.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                >
                  {/* Sección Superior: Título, Badge, Acciones */}
                  <div className="p-5 md:p-6 flex justify-between items-start">
                    {/* Título y Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-2">
                      <h2 className="text-xl font-bold text-gray-800">
                        {eleccion.title}
                      </h2>
                      <StatusBadge status={eleccion.status} />
                    </div>
                    
                    {/* Botones de Acción (Iconos como en Imagen 1) */}
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                      <button 
                        onClick={() => setSelectedElection(eleccion)} 
                        className="p-2 rounded-lg text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
                        aria-label="Gestionar cargos"
                      >
                        <FaCog /> {/* Botón "Gestionar" de Imagen 1 */}
                      </button>
                      <button 
                        onClick={() => handleOpenEdit(eleccion)} 
                        className="p-2 rounded-lg text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
                        aria-label="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => deleteEleccion(eleccion.id)} 
                        className="p-2 rounded-lg text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
                        aria-label="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  {/* Sección Inferior: Fechas (Estilo Imagen 1) */}
                  <div className="px-5 md:px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Fecha de Inicio</p>
                      <p className="text-sm font-medium text-gray-800">
                        {new Date(eleccion.start_date).toLocaleString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Fecha de Fin</p>
                      <p className="text-sm font-medium text-gray-800">
                        {/* Asumo que tienes 'end_date' en tu tipo Eleccion, basado en la Imagen 1 */}
                        {/* Si no lo tienes, cámbialo o pon un placeholder */}
                        {eleccion.end_date 
                          ? new Date(eleccion.end_date).toLocaleString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : 'No definida'}
                      </p>
                    </div>
                  </div>
                </div>
                // FIN TARJETA DE ELECCIÓN
                
              ))}
            </div>
          )}
        </div>

        {/* 4. COLUMNA DERECHA (Tu lógica original) */}
        {selectedElection && (
          <div className="xl:col-span-1">
            {/* Añadí un contenedor blanco para que el módulo de cargos se vea como un panel */}
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <CargosModule 
                election={selectedElection}
                onClose={() => setSelectedElection(null)} 
              />
            </div>
          </div>
        )}

        {/* Modal (Sin cambios) */}
        <EleccionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          eleccionToEdit={eleccionToEdit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}