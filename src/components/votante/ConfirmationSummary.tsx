
import type { Position, VotoSeleccionado } from '../../hooks/useVoto'; 
import { FaTimesCircle } from 'react-icons/fa';

interface ConfirmationSummaryProps {
    // 🚨 CAMBIO CLAVE: Ahora acepta el mapa de objetos { positionId: candidateId | null }
    votoChoices: VotoSeleccionado; 
    positions: Position[];
}

export default function ConfirmationSummary({ votoChoices, positions }: ConfirmationSummaryProps) {
    
    // Obtenemos un array de votos (solo los que tienen un candidato seleccionado)
    const confirmedVotes = Object.entries(votoChoices).filter(([, candidateId]) => candidateId !== null);
    
    // Obtenemos los votos en blanco o nulos
    const blankVotes = Object.entries(votoChoices).filter(([, candidateId]) => candidateId === null);
    
    // Total de cargos en la elección
    const totalPositions = positions.length;
    // Votos pendientes (cargos que no tienen registro en el mapa)
    const pendingVotes = totalPositions - (confirmedVotes.length + blankVotes.length);

    return (
        <div className="space-y-4 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Resumen Final del Voto</h2>
            
            {/* 1. SECCIÓN DE CONFIRMADOS */}
            <div className="pt-2">
                <h3 className="text-lg font-semibold text-red-600 mb-3">Candidatos Seleccionados ({confirmedVotes.length})</h3>
                
                {confirmedVotes.length === 0 ? (
                    <p className="text-gray-500">No has seleccionado ningún candidato principal.</p>
                ) : (
                    confirmedVotes.map(([positionId, candidateId]) => {
                        const position = positions.find(p => p.id === positionId);
                        const candidate = position?.candidates.find(c => c.id === candidateId);
                        
                        return (
                            <div key={positionId} className="flex justify-between py-2 border-b border-dashed last:border-b-0">
                                {/* Cargo */}
                                <span className="font-medium text-gray-600">{position?.title || 'Cargo Desconocido'}</span> 
                                {/* Candidato */}
                                <span className="font-semibold text-slate-800">{candidate?.full_name}</span> 
                            </div>
                        );
                    })
                )}
            </div>

            {/* 2. SECCIÓN DE VOTOS EN BLANCO Y PENDIENTES */}
            <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <div className="flex justify-between py-1">
                    <span className="text-gray-600">Votos en Blanco/Nulos:</span>
                    <span className="font-semibold text-blue-600">{blankVotes.length}</span>
                </div>
                <div className="flex justify-between py-1">
                    <span className="text-gray-600">Cargos sin Seleccionar:</span>
                    <span className="font-semibold text-red-600">{pendingVotes}</span>
                </div>
            </div>
            
            {/* 3. ADVERTENCIA FINAL */}
            {pendingVotes > 0 && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg flex items-center space-x-2">
                    <FaTimesCircle /> <span>Aún tienes **{pendingVotes}** cargos sin seleccionar. Se registrarán como nulos.</span>
                </div>
            )}
            
            <p className="text-sm pt-4 text-gray-700">Al presionar "Emitir Voto Final", esta acción es irreversible y se registra el voto único.</p>
        </div>
    );
}