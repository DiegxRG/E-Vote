// components/admin/elecciones/EleccionModal.tsx
import React, { useState, useEffect } from 'react';
import type { Eleccion, NuevaEleccion } from '../../../hooks/useElecciones';

interface EleccionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eleccion: NuevaEleccion | Partial<NuevaEleccion>) => Promise<void>;
  eleccionToEdit?: Eleccion | null;
  isSubmitting: boolean; // Estado para deshabilitar el botón mientras se guarda
}

export default function EleccionModal({ isOpen, onClose, onSubmit, eleccionToEdit, isSubmitting }: EleccionModalProps) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'draft' | 'active' | 'closed'>('draft');
  
  // Función auxiliar para resetear los campos
  const resetForm = () => {
    setTitle('');
    setStartDate('');
    setEndDate('');
    setStatus('draft');
  };

  // Efecto para llenar o resetear el formulario
  useEffect(() => {
    if (eleccionToEdit && isOpen) {
      setTitle(eleccionToEdit.title);
      // Formatear fechas para el input datetime-local
      setStartDate(new Date(eleccionToEdit.start_date).toISOString().slice(0, 16));
      setEndDate(new Date(eleccionToEdit.end_date).toISOString().slice(0, 16));
      setStatus(eleccionToEdit.status as 'draft' | 'active' | 'closed');
    } else {
      resetForm();
    }
  }, [eleccionToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aseguramos que las fechas se envíen como ISO string a la BD
    const eleccionData = {
      title,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      status,
    };
    
    try {
      await onSubmit(eleccionData);
      // El handleSubmit llama a la función del componente padre, que maneja el loading.
      // Si llega aquí, es exitoso, y el componente padre cerrará el modal.
    } catch (error) {
      // El error se maneja en el hook y se muestra en la página principal
      console.error("Error al guardar:", error); 
    }
  };

  if (!isOpen) return null;

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {eleccionToEdit ? 'Editar Elección' : 'Crear Nueva Elección'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:border-red-600 focus:ring-red-600"
              required
            />
          </div>
          
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
            <input
              type="datetime-local"
              id="start_date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:border-red-600 focus:ring-red-600"
              required
            />
          </div>
          
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
            <input
              type="datetime-local"
              id="end_date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:border-red-600 focus:ring-red-600"
              required
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'active' | 'closed')}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="draft">Borrador (Draft)</option>
              <option value="active">Activa (Active)</option>
              <option value="closed">Cerrada (Closed)</option>
            </select>
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
              disabled={isSubmitting}
              // ¡Color primario de Perú!
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}