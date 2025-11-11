// components/admin/cargos/CargoModal.tsx
import React, { useState, useEffect } from 'react';
import type { Cargo} from '../../../hooks/useCargos';

interface CargoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => Promise<void>;
  cargoToEdit?: Cargo | null;
  isSubmitting: boolean;
}

export default function CargoModal({ isOpen, onClose, onSubmit, cargoToEdit, isSubmitting }: CargoModalProps) {
  const [title, setTitle] = useState('');
  
  useEffect(() => {
    if (cargoToEdit) {
      setTitle(cargoToEdit.title);
    } else {
      setTitle('');
    }
  }, [cargoToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    try {
      await onSubmit(title.trim());
      onClose();
    } catch (error) {
      // El error se maneja en el hook
      console.error("Error al guardar:", error); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">
          {cargoToEdit ? 'Editar Cargo' : 'Crear Nuevo Cargo'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título del Cargo (Ej: Presidente)</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:border-red-600 focus:ring-red-600"
              required
            />
          </div>
          
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