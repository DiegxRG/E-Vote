// components/votante/ResultadoChart.tsx
import type { ResultadoCargo } from '../../hooks/useResultados';
import { motion } from 'framer-motion';

interface ResultadoChartProps {
  cargo: ResultadoCargo;
}

export default function ResultadoChart({ cargo }: ResultadoChartProps) {
  // 1. Encontrar el voto más alto (para la escala del 100%)
  // Usamos Math.max(1, ...) para evitar dividir por cero si no hay votos
  const maxVotes = Math.max(1, ...cargo.results.map(r => r.voteCount));
  const winnerId = cargo.results[0]?.id; // El primer ID (ya que el hook los ordena)

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-800">{cargo.title}</h3>
      <div className="space-y-3">
        {cargo.results.map((result, index) => {
          // Calculamos el porcentaje para el ancho de la barra
          const barWidthPercent = (result.voteCount / maxVotes) * 100;
          const isWinner = result.id === winnerId;
          
          return (
            <div key={result.id}>
              {/* Etiqueta: Nombre del Candidato y Conteo */}
              <div className="flex justify-between items-center text-sm font-medium mb-1">
                <span className={isWinner ? 'text-red-600 font-bold' : 'text-gray-700'}>
                  {result.fullName}
                </span>
                <span className={isWinner ? 'text-red-600 font-bold' : 'text-gray-500'}>
                  {result.voteCount} Votos ({barWidthPercent.toFixed(0)}%)
                </span>
              </div>
              
              {/* Barra de Progreso */}
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <motion.div 
                  // El ganador tiene la barra de color rojo
                  className={isWinner ? 'bg-red-600 h-4 rounded-full' : 'bg-slate-700 h-4 rounded-full'}
                  initial={{ width: 0 }} // Animación de Framer Motion
                  animate={{ width: `${barWidthPercent}%` }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-right text-sm font-semibold text-gray-700">
        Total de Votos (Cargo): {cargo.totalVotes}
      </p>
    </div>
  );
}