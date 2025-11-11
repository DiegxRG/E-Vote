// components/admin/cargos/CargosTable.tsx

import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Cargo } from '../../../hooks/useCargos';

interface CargosTableProps {
  cargos: Cargo[];
  onEdit: (cargo: Cargo) => void;
  onDelete: (id: string) => void;
  isActionLoading: boolean;
}

export default function CargosTable({ cargos, onEdit, onDelete, isActionLoading }: CargosTableProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mt-4">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Cargos Asignados a la Elección</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-3/4">Título del Cargo</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cargos.length === 0 ? (
            <tr>
              <td colSpan={2} className="py-6 text-center text-gray-500">
                No hay cargos definidos para esta elección.
              </td>
            </tr>
          ) : (
            cargos.map((cargo) => (
              <tr key={cargo.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{cargo.title}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end space-x-3">
                    <button 
                      onClick={() => onEdit(cargo)} 
                      className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                      disabled={isActionLoading}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Seguro que quieres borrar el cargo "${cargo.title}"?`)) {
                          onDelete(cargo.id);
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