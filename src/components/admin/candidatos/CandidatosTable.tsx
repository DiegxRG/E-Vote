import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Candidato } from '../../../hooks/useCandidatos';
import type { Partido } from '../../../hooks/usePartidos'; // Importamos Partido

// 🚨 CORREGIDO: Actualizamos el tipo para que refleje los JOINS
export type CandidatoConCargo = Candidato & {
  positions: { title: string, election_id: string } | null; // Join con Cargos
  parties: Pick<Partido, 'name' | 'logo_url'> | null;   // Join con Partidos
};

interface CandidatosTableProps {
  candidatos: CandidatoConCargo[];
  onEdit: (candidato: Candidato) => void;
  onDelete: (id: string) => void;
  isActionLoading: boolean;
}

export default function CandidatosTable({ candidatos, onEdit, onDelete, isActionLoading }: CandidatosTableProps) {
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
      <table className="w-full min-w-[700px] text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Nombre</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Partido</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Cargo (Elección)</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {candidatos.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-10 text-center text-gray-500">
                No hay candidatos registrados en el sistema.
              </td>
            </tr>
          ) : (
            candidatos.map((candidato) => (
              <tr key={candidato.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900 flex items-center">
                  <img 
                    // 🚨 CORREGIDO: Usamos el logo del partido (si existe) o el placeholder
                    src={candidato.photo_url || 'https://dummyimage.com/150x150/000/fff'} 
                    alt={candidato.full_name} 
                    className="h-8 w-8 rounded-full object-cover mr-3"
                  />
                  {candidato.full_name}
                </td>
                
                {/* 🚨 CORRECCIÓN LÍNEA 48: Leemos el nombre desde el objeto 'parties' */}
                <td className="py-3 px-4 text-sm text-gray-600">
                  {candidato.parties?.name || 'Independiente'}
                </td>

                <td className="py-3 px-4 text-sm text-gray-600">
                  {/* (candidato as any) es una forma de manejar el tipo complejo del JOIN */}
                  {(candidato as any).positions?.title || 'Sin Cargo'}
                  <span className="block text-xs text-gray-400">
                    (Elección ID: {(candidato as any).positions?.election_id.substring(0, 8)}...)
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => onEdit(candidato)} 
                      className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                      disabled={isActionLoading}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Seguro que quieres borrar a "${candidato.full_name}"?`)) {
                          onDelete(candidato.id);
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