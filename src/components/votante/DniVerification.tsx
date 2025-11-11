// components/votante/DniVerification.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaLock, FaCheckCircle } from 'react-icons/fa';

// ⚠️ SIMULACIÓN DE LA API DE JAVA (RENIEC)
// El backend de Java proporcionará estos datos en el futuro.
const MOCK_DNI_DATA: { [key: string]: string } = {
  "12345678": "Pedro Castillo",
  "87654321": "Keiko Fujimori",
  "11223344": "César Acuña",
};

export default function DniVerification() {
  const { usuario, updateVotante } = useAuth();
  const [dni, setDni] = useState('');
  const [nameFromDni, setNameFromDni] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Función que simula la llamada al backend para validar y obtener el nombre
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setNameFromDni(null);

    if (!usuario) {
      setError("Error de autenticación. Por favor, reinicia la sesión.");
      setLoading(false);
      return;
    }

    if (dni.length !== 8 || !/^\d+$/.test(dni)) {
      setError("El DNI debe contener exactamente 8 dígitos.");
      setLoading(false);
      return;
    }

    // SIMULACIÓN DE RED Y PROCESAMIENTO DE JAVA
    await new Promise(resolve => setTimeout(resolve, 800)); 
    const resolvedName = MOCK_DNI_DATA[dni];

    if (!resolvedName) {
        setError("DNI no encontrado en el padrón simulado. Prueba con 12345678.");
        setLoading(false);
        return;
    }
    
    // Si la simulación es exitosa, mostramos el nombre para confirmación
    setNameFromDni(resolvedName); 
    setLoading(false);
  };
  
  // Función que guarda los datos finales en Supabase
  const handleConfirmAndSave = async () => {
    if (!nameFromDni || !dni) return;
    setLoading(true);
    setError(null);
    
    try {
      // 1. Llama al hook para actualizar DNI y Nombre Completo
      const { error: updateError } = await updateVotante({ 
          dni: dni.trim(), 
          full_name: nameFromDni
      }); 
      
      if (updateError) {
        // Esto captura errores de unicidad (si el DNI ya existe en otro perfil)
        setError("El DNI ingresado ya está asociado a otra cuenta. Contacte a un administrador.");
      } 
      // Si tiene éxito, HomeVotante detectará el cambio de perfil y redirigirá/actualizará.
      
    } catch (err: any) {
      setError("Error de red o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center border-t-4 border-red-600">
        <FaLock className="mx-auto text-red-600 text-4xl mb-4" />
        <h2 className="text-3xl font-bold text-slate-800 mb-4">
          Verificación de Identidad 🇵🇪
        </h2>
        <p className="text-gray-600 mb-6">
          Ingresa tu DNI para validar tu identidad en el padrón.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="number"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-center text-xl tracking-widest focus:ring-red-600 focus:border-red-600"
            placeholder="DNI (8 dígitos)"
            maxLength={8}
            disabled={loading || !!nameFromDni}
            required
          />
          
          {error && (
            <div className="text-red-700 bg-red-100 border border-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Estado 1: Botón de Búsqueda */}
          {!nameFromDni ? (
            <button
              type="submit"
              disabled={loading || dni.length !== 8}
              className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
            >
              {loading ? 'Buscando en padrón...' : 'Buscar y Validar'}
            </button>
          ) : (
             /* Estado 2: Confirmación */
             <div className="space-y-4">
                <div className="bg-green-100 border border-green-400 text-green-800 p-3 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2">
                    <FaCheckCircle /> <span>Confirmar identidad: **{nameFromDni}**</span>
                </div>
                <button
                    type="button" 
                    onClick={handleConfirmAndSave}
                    disabled={loading}
                    className="w-full py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 disabled:opacity-50 transition"
                >
                    {loading ? 'Guardando...' : 'Confirmar Datos y Acceder'}
                </button>
             </div>
          )}
        </form>
      </div>
    </div>
  );
}