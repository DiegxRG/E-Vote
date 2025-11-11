
import { Outlet } from 'react-router-dom';
import Sidebar from './admin/Sidebar';
import Header from './admin/Header';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* 1. Sidebar (Fijo) */}
      <Sidebar />
      
      {/* 2. Contenido Principal (con scroll) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* 2a. Header (Fijo) */}
        <Header />
        
        {/* 2b. Contenido de la Página (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Aquí se renderiza la página (DashboardAdmin, Elecciones, etc.) */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}