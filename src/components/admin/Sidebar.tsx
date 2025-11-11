import React from 'react';
import { NavLink } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx'; // Icono de Dashboard
import { FaRegListAlt, FaUserTag, FaFlag, FaAddressCard, FaChartBar} from 'react-icons/fa'; // 🚨 AÑADIDO FaFlag
import { FiUsers, FiCpu, FiLogOut } from 'react-icons/fi'; // Iconos
import { useAuth } from '../../hooks/useAuth';

// Componente reutilizable para los enlaces
const SidebarLink = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => {
  
  // Clases para el enlace de NavLink
  const linkClasses = "flex items-center px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-white transition duration-150";
  const activeClasses = "bg-red-600 text-white"; // ¡Color primario de Perú!

  return (
    <NavLink
      to={to}
      // NavLink nos da 'isActive' para saber si la ruta está activa
      className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}
    >
      <span className="text-xl">{icon}</span>
      <span className="ml-3 font-medium">{label}</span>
    </NavLink>
  );
};


export default function Sidebar() {
  const { cerrarSesion } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-800 text-white shadow-lg">
      
      {/* 1. Logo/Título */}
      <div className="flex h-16 items-center justify-center border-b border-slate-700 px-4">
        <h1 className="text-2xl font-bold text-white">
          E-Vote <span className="text-red-500">Admin</span>
        </h1>
      </div>

      {/* 2. Menú de Navegación */}
      <nav className="flex-1 space-y-2 py-4">
        <SidebarLink to="/admin" icon={<RxDashboard />} label="Dashboard" />
        <SidebarLink to="/admin/elecciones" icon={<FaRegListAlt />} label="Elecciones" />
        <SidebarLink to="/admin/candidatos" icon={<FaUserTag />} label="Candidatos" />
        
        {/* 🚨 ENLACE AÑADIDO */}
        <SidebarLink to="/admin/partidos" icon={<FaFlag />} label="Partidos Políticos" />
        <SidebarLink to="/admin/perfiles" icon={<FaAddressCard />} label="Perfiles de Candidato" />
        <SidebarLink to="/admin/votantes" icon={<FiUsers />} label="Votantes" />
        <SidebarLink to="/admin/ml" icon={<FiCpu />} label="Machine Learning" />
        <SidebarLink to="/admin/resultados" icon={<FaChartBar />} label="Resultados" />
      </nav>

      {/* 3. Botón de Salir (Abajo) */}
      <div className="border-t border-slate-700 p-4">
        <button
          onClick={cerrarSesion}
          className="flex w-full items-center rounded-lg px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-white transition duration-150"
        >
          <FiLogOut className="text-xl" />
          <span className="ml-3 font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}