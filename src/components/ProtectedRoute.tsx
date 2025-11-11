import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  requiredRole: 'votante' | 'admin'; 
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  // Obtenemos el usuario, el estado de carga Y el nuevo 'rol'
  const { usuario, cargando, rol } = useAuth();

  // 1. Mostrar estado de carga
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-600">Cargando autenticación...</p>
      </div>
    ); 
  }

  // 2. Redirigir si NO hay usuario (no autenticado)
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  
  // 3. Verificar el rol para acceso
  
  // Si la ruta requiere ADMIN, pero el rol NO es ADMIN, lo mandamos a /home
  if (requiredRole === 'admin' && rol !== 'admin') {
      console.log(`Acceso denegado: Usuario ${rol} intentó acceder a ruta Admin.`);
      return <Navigate to="/home" replace />; 
  }
  
  // Si la ruta requiere VOTANTE, pero el rol NO es VOTANTE, lo mandamos a /admin (solo si es admin)
  // Esto es para que los admins no se queden en la home de votante si acceden por /
  if (requiredRole === 'votante' && rol === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // 4. Si pasa todas las validaciones (autenticado y rol correcto), permite el acceso
  return <Outlet />;
};