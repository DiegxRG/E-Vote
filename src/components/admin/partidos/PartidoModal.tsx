import React, { useState, useEffect } from 'react';
// El tipo 'Partido' ahora incluye 'description' gracias al hook actualizado
import type { Partido, NuevoPartido } from '../../../hooks/usePartidos';

interface PartidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (partido: NuevoPartido | Partial<Partido>) => Promise<void>;
  partidoToEdit?: Partido | null;
  isSubmitting: boolean; 
}

export default function PartidoModal({ isOpen, onClose, onSubmit, partidoToEdit, isSubmitting }: PartidoModalProps) {
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState(''); // 🚨 1. NUEVO ESTADO
  
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);

  useEffect(() => {
    if (partidoToEdit) {
      setName(partidoToEdit.name);
      setLogoUrl(partidoToEdit.logo_url || '');
      setDescription(partidoToEdit.description || ''); // 🚨 2. LEER DESCRIPCIÓN
    } else {
      setName('');
      setLogoUrl('');
      setDescription(''); // 🚨 2. RESETEAR DESCRIPCIÓN
    }
    setLocalIsSubmitting(false); 
  }, [partidoToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalIsSubmitting(true);
    
    // 🚨 3. AÑADIR DESCRIPCIÓN AL OBJETO DE DATOS
    const partidoData: Partial<Partido> & { name: string } = {
      id: partidoToEdit?.id,
      name: name.trim(),
      logo_url: logoUrl.trim() || null,
      description: description.trim() || null, // 🚨 3. AÑADIDO
    };

    try {
      await onSubmit(partidoData as any); // 'any' para simplificar el tipo parcial
      onClose(); 
    } catch (error) {
      console.error("Error al guardar partido:", error);
    } finally {
      setLocalIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {partidoToEdit ? 'Editar Partido' : 'Nuevo Partido Político'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Partido *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:border-red-600 focus:ring-red-600"
              required
            />
          </div>
          <div>
            <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700">URL del Logo (Opcional)</label>
            <input
              type="url"
              id="logo_url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:border-red-600 focus:ring-red-600"
              placeholder="https://..."
            />
          </div>
          
          {/* 🚨 4. NUEVO CAMPO DE TEXTAREA PARA LA DESCRIPCIÓN */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción (Opcional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:border-red-600 focus:ring-red-600"
              placeholder="Breve historia, ideología o detalles del partido..."
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || localIsSubmitting}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={localIsSubmitting || isSubmitting || !name.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {localIsSubmitting ? 'Guardando...' : 'Guardar Partido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}