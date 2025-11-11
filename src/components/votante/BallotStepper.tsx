// components/votante/BallotStepper.tsx
import type { Position, VotoSeleccionado } from '../../hooks/useVoto'; 

interface BallotStepperProps {
    positions: Position[];
    votoChoices: VotoSeleccionado;
    onSelect: (positionId: string, candidateId: string | null) => void;
}

export default function BallotStepper({ positions, votoChoices, onSelect }: BallotStepperProps) {
    return (
        <div className="space-y-8 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">Cédula de Votación</h2>
            
            {positions.map((pos) => {
                const selectedCandidate = votoChoices[pos.id]; // Buscamos el ID seleccionado en el mapa
                
                return (
                    <div key={pos.id} className="border p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-red-600">{pos.title}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                            {pos.candidates.map((cand) => (
                                <button
                                    key={cand.id}
                                    onClick={() => onSelect(pos.id, cand.id)}
                                    className={`p-3 border rounded-lg text-left transition ${
                                        selectedCandidate === cand.id 
                                            ? 'bg-red-100 border-red-600 ring-2 ring-red-600' 
                                            : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                >
                                    <img 
                                        src={cand.photo_url || 'https://dummyimage.com/150x150/000/fff'} 
                                        alt={cand.full_name} 
                                        className="h-12 w-12 rounded-full object-cover mb-2"
                                    />
                                    <span className="font-medium block">{cand.full_name}</span> 
                                    <span className="text-xs text-gray-500">({cand.party_name || 'Lista'})</span>
                                </button>
                            ))}
                            
                            {/* Voto en Blanco */}
                            <button
                                onClick={() => onSelect(pos.id, null)}
                                className={`p-3 border rounded-lg text-left transition ${
                                    selectedCandidate === null 
                                        ? 'bg-red-100 border-red-600 ring-2 ring-red-600' 
                                        : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                            >
                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                                    <span className="text-gray-500 text-xl">?</span>
                                </div>
                                <span className="font-medium block">Voto en Blanco</span> 
                                <span className="text-xs text-gray-500">(Nulo/Omitido)</span>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}