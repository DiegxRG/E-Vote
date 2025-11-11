import React, { useState, useEffect } from 'react';
import type { Candidato, NuevoCandidato, EleccionConCargos } from '../../../hooks/useCandidatos';
import type { Partido } from '../../../hooks/usePartidos'; // 🚨 1. Importamos el tipo Partido

interface CandidatoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (candidato: NuevoCandidato | Partial<NuevoCandidato>) => Promise<void>;
  candidatoToEdit?: Candidato | null;
  eleccionesAgrupadas: EleccionConCargos[];
  partidosDisponibles: Partido[]; // 🚨 2. Recibimos la lista de partidos
  isSubmitting: boolean;
}

export default function CandidatoModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  candidatoToEdit, 
  eleccionesAgrupadas, 
  partidosDisponibles, // 🚨 2. Usamos la prop
  isSubmitting 
}: CandidatoModalProps) {
  
  // --- Estados del Formulario ---
  const [fullName, setFullName] = useState('');
  const [partyId, setPartyId] = useState<string | null>(null); // 🚨 3. CAMBIADO: de partyName a partyId
  const [photoUrl, setPhotoUrl] = useState('');
  const [positionId, setPositionId] = useState('');
  // 🚨 3. ELIMINADO: El estado 'planDetails' se va

  useEffect(() => {
    if (candidatoToEdit) {
      // Editando
      setFullName(candidatoToEdit.full_name);
      setPartyId(candidatoToEdit.party_id || null); // 🚨 3. CAMBIADO
      setPhotoUrl(candidatoToEdit.photo_url || '');
      setPositionId(candidatoToEdit.position_id);
      // 🚨 3. ELIMINADO: setPlanDetails()
    } else {
      // Creando
      setFullName('');
      setPartyId(null); // 🚨 3. CAMBIADO
      setPhotoUrl('');
      // 🚨 3. ELIMINADO: setPlanDetails()
      const firstPositionId = eleccionesAgrupadas[0]?.positions[0]?.id || '';
      setPositionId(firstPositionId);
    }
  }, [candidatoToEdit, isOpen, eleccionesAgrupadas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🚨 4. Objeto de datos actualizado (sin plan_details)
    const candidatoData = {
      id: candidatoToEdit?.id,
      full_name: fullName.trim(),
      position_id: positionId,
      party_id: partyId, // 🚨 4. CAMBIADO
      photo_url: photoUrl.trim() || null,
    };
    
    try {
      await onSubmit(candidatoData as any); 
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {candidatoToEdit ? 'Editar Candidato' : 'Registrar Candidato'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Asignar Cargo (Select Agrupado) */}
          <div>
            <label htmlFor="position_id" className="block text-sm font-medium text-gray-700">Asignar Cargo *</label>
            <select
              id="position_id"
              value={positionId}
              onChange={(e) => setPositionId(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-red-600 focus:border-red-600"
              required
              disabled={!!candidatoToEdit}
            >
              {eleccionesAgrupadas.map(eleccion => (
                <optgroup key={eleccion.id} label={eleccion.title}>
                  {eleccion.positions.length === 0 ? (
                    <option disabled>-- Sin cargos --</option>
                  ) : (
                    eleccion.positions.map(cargo => (
                      <option key={cargo.id} value={cargo.id}>
                        {cargo.title}
                      </option>
                    ))
                  )}
                </optgroup>
              ))}
            </select>
            {candidatoToEdit && <p className="text-xs text-red-600 mt-1">El cargo no se puede cambiar al editar.</p>}
          </div>
          
          {/* Nombre Completo (Input) */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Nombre Completo *</label>
            <input
              type="text"
              id="full_name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-red-600 focus:border-red-600"
              required
            />
          </div>
          
          {/* 🚨 5. REEMPLAZADO: Partido/Lista (Select) */}
          <div>
            <label htmlFor="party_id" className="block text-sm font-medium text-gray-700">Partido/Lista</label>
            <select
              id="party_id"
              value={partyId || ''} // Maneja el valor nulo
              onChange={(e) => setPartyId(e.target.value || null)} // Setea null si es "Sin Partido"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-red-600 focus:border-red-600"
            >
              <option value="">-- Sin Partido (Independiente) --</option>
              {partidosDisponibles.map(partido => (
                <option key={partido.id} value={partido.id}>
                  {partido.name}
                </option>
              ))}
            </select>
          </div>

          {/* 🚨 5. ELIMINADO: El <textarea> de "Plan de Gobierno" se quitó de aquí */}
          
          {/* URL de la Foto (Input) */}
          <div>
            <label htmlFor="photo_url" className="block text-sm font-medium text-gray-700">URL de la Foto</label>
            <input
              type="url"
              id="photo_url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-red-600 focus:border-red-600"
              placeholder="https://..."
            />
          </div>
          
          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !positionId}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Candidato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}