import { useState } from 'react';
import { FaChartBar, FaLock, FaClock, FaTrophy, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MOCK_RESULTS = [
  {
    id: 'e1',
    title: 'Elecciones Presidenciales 2025',
    status: 'active',
    positions: [
      {
        id: 'p1',
        title: 'Presidente',
        totalVotes: 18234,
        results: [
          { id: 'c1', fullName: 'María Elena Reyes', voteCount: 8234 },
          { id: 'c2', fullName: 'Carlos Mendoza', voteCount: 6450 },
          { id: 'c3', fullName: 'Ana Sofía Torres', voteCount: 3550 }
        ]
      },
      {
        id: 'p2',
        title: 'Vicepresidente',
        totalVotes: 18100,
        results: [
          { id: 'c4', fullName: 'Roberto Campos', voteCount: 9500 },
          { id: 'c5', fullName: 'Patricia Vega', voteCount: 8600 }
        ]
      }
    ]
  },
  {
    id: 'e2',
    title: 'Elecciones Municipales 2024',
    status: 'closed',
    positions: [
      {
        id: 'p3',
        title: 'Alcalde',
        totalVotes: 24500,
        results: [
          { id: 'c6', fullName: 'Jorge Ramírez', voteCount: 12200 },
          { id: 'c7', fullName: 'Lucía Fernández', voteCount: 9300 },
          { id: 'c8', fullName: 'Pedro Castro', voteCount: 3000 }
        ]
      },
      {
        id: 'p4',
        title: 'Regidor',
        totalVotes: 24000,
        results: [
          { id: 'c9', fullName: 'Carmen Rojas', voteCount: 10500 },
          { id: 'c10', fullName: 'Luis Torres', voteCount: 8200 },
          { id: 'c11', fullName: 'Sandra Vega', voteCount: 5300 }
        ]
      }
    ]
  },
  {
    id: 'e3',
    title: 'Elecciones Congresales 2024',
    status: 'closed',
    positions: [
      {
        id: 'p5',
        title: 'Congresista - Lima',
        totalVotes: 35000,
        results: [
          { id: 'c12', fullName: 'Alberto Sánchez', voteCount: 15000 },
          { id: 'c13', fullName: 'Rosa Martínez', voteCount: 12000 },
          { id: 'c14', fullName: 'Miguel Ángel Díaz', voteCount: 8000 }
        ]
      }
    ]
  }
];

export default function GestionResultados() {
  const [selectedElection, setSelectedElection] = useState<string | null>(null);

  const handleCloseElection = async (electionId: string) => {
    if (window.confirm('¿Estás seguro de cerrar esta elección? Esta acción es irreversible.')) {
      alert(`Elección ${electionId} cerrada exitosamente`);
    }
  };

  const activeElections = MOCK_RESULTS.filter(e => e.status === 'active');
  const closedElections = MOCK_RESULTS.filter(e => e.status === 'closed');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-black text-slate-800 mb-2">
          Gestión de Resultados
        </h1>
        <p className="text-lg text-slate-600">
          Monitorea y administra los resultados de todas las elecciones
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
          <FaClock className="text-4xl mb-3 opacity-80" />
          <p className="text-4xl font-black mb-1">{activeElections.length}</p>
          <p className="text-blue-100">Elecciones Activas</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
          <FaChartBar className="text-4xl mb-3 opacity-80" />
          <p className="text-4xl font-black mb-1">{closedElections.length}</p>
          <p className="text-green-100">Elecciones Cerradas</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
          <FaTrophy className="text-4xl mb-3 opacity-80" />
          <p className="text-4xl font-black mb-1">
            {MOCK_RESULTS.reduce((acc, e) => acc + e.positions.reduce((sum, p) => sum + p.totalVotes, 0), 0).toLocaleString()}
          </p>
          <p className="text-purple-100">Votos Totales</p>
        </motion.div>
      </div>

      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
          <h2 className="text-3xl font-bold text-slate-800">Elecciones Activas (Monitoreo en Vivo)</h2>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        </div>

        {activeElections.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaClock className="text-6xl text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No hay elecciones activas en este momento</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeElections.map((election) => (
              <ElectionCard
                key={election.id}
                election={election}
                onCloseElection={handleCloseElection}
                isActive={true}
              />
            ))}
          </div>
        )}
      </motion.section>

      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-10 bg-green-600 rounded-full"></div>
          <h2 className="text-3xl font-bold text-slate-800">Elecciones Cerradas (Resultados Finales)</h2>
        </div>

        {closedElections.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaChartBar className="text-6xl text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Aún no hay elecciones cerradas</p>
          </div>
        ) : (
          <div className="space-y-6">
            {closedElections.map((election) => (
              <ElectionCard
                key={election.id}
                election={election}
                onCloseElection={handleCloseElection}
                isActive={false}
              />
            ))}
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}

interface ElectionCardProps {
  election: any;
  onCloseElection: (id: string) => void;
  isActive: boolean;
}

function ElectionCard({ election, onCloseElection, isActive }: ElectionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      <div className={`p-6 ${isActive ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-green-600'} text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold">{election.title}</h3>
              {isActive && (
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  EN VIVO
                </span>
              )}
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="opacity-80">Total de Votos</p>
                <p className="text-2xl font-bold">
                  {election.positions.reduce((acc: number, p: any) => acc + p.totalVotes, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="opacity-80">Cargos en Disputa</p>
                <p className="text-2xl font-bold">{election.positions.length}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              <FaEye />
              {expanded ? 'Ocultar' : 'Ver Detalles'}
            </button>
            {isActive && (
              <button
                onClick={() => onCloseElection(election.id)}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                <FaLock />
                Cerrar Elección
              </button>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-6 space-y-8"
        >
          {election.positions.map((position: any) => {
            const maxVotes = Math.max(...position.results.map((r: any) => r.voteCount));
            
            return (
              <div key={position.id}>
                <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-200">
                  <h4 className="text-xl font-bold text-slate-800">{position.title}</h4>
                  <span className="text-slate-600 font-semibold">{position.totalVotes.toLocaleString()} votos</span>
                </div>

                <div className="space-y-3">
                  {position.results.map((result: any, index: number) => {
                    const percentage = (result.voteCount / maxVotes) * 100;
                    const isWinner = index === 0;

                    return (
                      <div
                        key={result.id}
                        className={`p-4 rounded-xl ${
                          isWinner 
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400' 
                            : 'bg-slate-50 border-2 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              isWinner ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-700'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <p className={`font-bold ${isWinner ? 'text-green-700' : 'text-slate-700'}`}>
                                {result.fullName}
                              </p>
                              {isWinner && (
                                <span className="inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  GANADOR
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-black ${isWinner ? 'text-green-600' : 'text-slate-700'}`}>
                              {result.voteCount.toLocaleString()}
                            </p>
                            <p className="text-sm text-slate-500">
                              {((result.voteCount / position.totalVotes) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>

                        <div className="relative w-full bg-white rounded-full h-3 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              isWinner 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                                : 'bg-gradient-to-r from-slate-400 to-slate-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.1 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}