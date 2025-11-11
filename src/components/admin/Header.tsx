
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { perfil } = useAuth(); // Usamos 'perfil' para obtener el full_name

  return (
    <header className="flex h-16 items-center justify-between bg-white px-6 shadow-md border-b border-gray-200">
      
      {/* Título de la sección (se puede hacer dinámico después) */}
      <h1 className="text-xl font-semibold text-slate-700">
        Panel de Administración
      </h1>
      
      {/* Perfil del Admin */}
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-600">
          Hola, {perfil?.full_name || 'Admin'}
        </span>
        <div className="ml-3 h-9 w-9 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
          {perfil?.full_name ? perfil.full_name[0].toUpperCase() : 'A'}
        </div>
      </div>
    </header>
  );
}