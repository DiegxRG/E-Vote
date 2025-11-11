// components/admin/elecciones/CargosModule.tsx
import React, { useState } from 'react';
import { useCargos } from '../../../hooks/useCargos'; // Subimos 3 niveles para llegar a hooks
import type { Eleccion } from '../../../hooks/useElecciones';
import type { Cargo } from '../../../hooks/useCargos';
import CargosTable from '../cargos/CargosTable';
import CargoModal from '../cargos/CargoModal';


interface CargosModuleProps {
    election: Eleccion;
    onClose: () => void;
}

export default function CargosModule({ election, onClose }: CargosModuleProps) {
    const { cargos, loading, error, addCargo, updateCargo, deleteCargo } = useCargos(election.id);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cargoToEdit, setCargoToEdit] = useState<Cargo | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenCreate = () => {
        setCargoToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (cargo: Cargo) => {
        setCargoToEdit(cargo);
        setIsModalOpen(true);
    };

    const handleCargoSubmit = async (title: string) => {
        setIsSubmitting(true);
        try {
            if (cargoToEdit) {
                await updateCargo(cargoToEdit.id, { title });
            } else {
                await addCargo({ title });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error al guardar cargo:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="sticky top-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-red-600">
                    Cargos de: {election.title}
                </h3>
                <button onClick={onClose} className="text-gray-500 hover:text-red-600">
                    Cerrar [X]
                </button>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-3">{error}</div>}

            <button
                onClick={handleOpenCreate}
                className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg shadow-md hover:bg-slate-700 font-medium mb-4 disabled:opacity-50"
                disabled={loading}
            >
                + Nuevo Cargo
            </button>

            {loading && !cargos.length ? (
                <div className="text-center text-sm text-gray-500">Cargando cargos...</div>
            ) : (
                <CargosTable 
                    cargos={cargos}
                    onEdit={handleOpenEdit}
                    onDelete={deleteCargo}
                    isActionLoading={isSubmitting || loading}
                />
            )}

            <CargoModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCargoSubmit}
                cargoToEdit={cargoToEdit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}