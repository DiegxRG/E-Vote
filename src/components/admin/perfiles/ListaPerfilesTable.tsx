// components/admin/perfiles/ListaPerfilesTable.tsx
import type { CandidatoConPerfil } from '../../../hooks/usePerfiles';
import { FaEdit } from 'react-icons/fa';

interface ListaPerfilesTableProps {
  candidatos: CandidatoConPerfil[];
  onEditClick: (candidato: CandidatoConPerfil) => void;
  isLoading: boolean;
}

export default function ListaPerfilesTable({ candidatos, onEditClick, isLoading }: ListaPerfilesTableProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
      <table className="w-full min-w-[800px] text-left">
        {/* ... (<thead> se mantiene igual) ... */}
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Candidato</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Cargo</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Partido</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Estado del Perfil</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Acción</th>
          </tr>
        </thead>
        <tbody>
          {/* ... (Lógica de 'isLoading' y 'candidatos.length === 0' se mantiene igual) ... */}
          
          {candidatos.map((candidato) => {
            // 🚨 LÓGICA CORREGIDA:
            // (candidato as any) es para manejar el tipo anidado
            const perfilExiste = (candidato as any).candidate_profiles !== null;

            return (
              <tr key={candidato.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{candidato.full_name}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{(candidato as any).positions?.title || 'N/A'}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{(candidato as any).parties?.name || 'Independiente'}</td>
                <td className="py-3 px-4">
                  
                  {/* 🚨 LÓGICA CORREGIDA: Chequea si 'perfilExiste' es true */}
                  {perfilExiste ? (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      Perfil Creado
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                      Pendiente
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <button 
                    onClick={() => onEditClick(candidato)}
                    className={`flex items-center space-x-2 px-3 py-1 text-sm text-white rounded-lg ${
                      perfilExiste ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    <FaEdit />
                    {/* 🚨 LÓGICA CORREGIDA: */}
                    <span>{perfilExiste ? 'Editar Perfil' : 'Crear Perfil'}</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}