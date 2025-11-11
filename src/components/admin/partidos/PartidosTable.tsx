
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Partido } from '../../../hooks/usePartidos';

interface PartidosTableProps {
  partidos: Partido[];
  onEdit: (partido: Partido) => void;
  onDelete: (id: string) => void;
  isActionLoading: boolean;
}

export default function PartidosTable({ partidos, onEdit, onDelete, isActionLoading }: PartidosTableProps) {
  
  // Función para truncar texto largo
  const truncateText = (text: string | null, length: number) => {
    if (!text) return 'N/A';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
      <table className="w-full min-w-[700px] text-left"> {/* Aumentado el min-w */}
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-[5%]">Logo</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-[25%]">Nombre del Partido</th>
            {/* 🚨 NUEVA COLUMNA */}
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-[50%]">Descripción</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-[20%]">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {partidos.length === 0 ? (
            <tr>
              {/* 🚨 colSpan actualizado a 4 */}
              <td colSpan={4} className="py-10 text-center text-gray-500">
                No hay partidos políticos registrados.
              </td>
            </tr>
          ) : (
            partidos.map((partido) => (
              <tr key={partido.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <img 
                    src={partido.logo_url || 'https://dummyimage.com/150x150/000/fff'} 
                    alt={partido.name} 
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </td>
                <td className="py-3 px-4 font-medium text-gray-900">{partido.name}</td>
                
                {/* 🚨 NUEVA CELDA (con texto truncado) */}
                <td className="py-3 px-4 text-sm text-gray-500">
                  {truncateText(partido.description, 80)}
                </td>
                
                <td className="py-3 px-4">
                  <div className="flex space-x-3">
                    <button onClick={() => onEdit(partido)} disabled={isActionLoading} className="text-blue-500 hover:text-blue-700 disabled:opacity-50">
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Seguro que quieres borrar "${partido.name}"?`)) {
                          onDelete(partido.id);
                        }
                      }}
                      disabled={isActionLoading}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
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