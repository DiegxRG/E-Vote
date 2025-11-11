// components/VotanteLayout.tsx
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

export default function VotanteLayout() {
  return (
    // Estructura principal que asegura que el Footer esté siempre abajo
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar /> 
      
      {/* El main content y el Outlet se expanden para ocupar el espacio disponible */}
      <main className="flex-grow container mx-auto p-6 md:p-10">
        <Outlet /> 
      </main>
      
      <Footer /> 
    </div>
  );
}