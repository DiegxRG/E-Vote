// components/admin/elecciones/EleccionesTable.tsx

import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Eleccion } from '../../../hooks/useElecciones';

interface EleccionesTableProps {
  elecciones: Eleccion[];
  onEdit: (eleccion: Eleccion) => void;
  onDelete: (id: string) => void;
  // Añadimos 'loading' para manejar el estado de las acciones
  isActionLoading: boolean; 
}

export default function EleccionesTable({ elecciones, onEdit, onDelete, isActionLoading }: EleccionesTableProps) {
  
  // Función para formatear fechas al estilo local (Perú)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-PE', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Colores de estado basados en nuestra paleta (Draft: Dorado, Active: Verde, Closed: Gris)
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'closed': return 'bg-gray-300 text-gray-800';
      case 'draft': return 'bg-amber-500 text-white'; // Dorado Inca!
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
      <table className="w-full min-w-[600px] text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Título</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Estado</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Inicio</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Fin</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {elecciones.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-10 text-center text-gray-500">
                No hay elecciones creadas. Usa el botón "+ Nueva Elección" para empezar.
              </td>
            </tr>
          ) : (
            elecciones.map((eleccion) => (
              <tr key={eleccion.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{eleccion.title}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(eleccion.status)}`}>
                    {eleccion.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{formatDate(eleccion.start_date)}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{formatDate(eleccion.end_date)}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => onEdit(eleccion)} 
                      className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                      disabled={isActionLoading}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Seguro que quieres borrar "${eleccion.title}"? Esta acción es irreversible.`)) {
                          onDelete(eleccion.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={isActionLoading}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}