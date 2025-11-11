import { motion } from 'framer-motion';
import { FaChartBar, FaTrophy, FaMedal } from 'react-icons/fa';

const MOCK_RESULTS = [
  {
    id: 'e1',
    title: 'Elecciones Generales 2024',
    positions: [
      {
        id: 'p1',
        title: 'Presidenta',
        totalVotes: 18234,
        results: [
          { id: '1', fullName: 'María Elena Reyes', voteCount: 8234 },
          { id: '2', fullName: 'Carlos Mendoza', voteCount: 6450 },
          { id: '3', fullName: 'Ana Sofía Torres', voteCount: 3550 }
        ]
      },
      {
        id: 'p2',
        title: 'Alcalde',
        totalVotes: 18100,
        results: [
          { id: '4', fullName: 'Roberto Campos', voteCount: 9500 },
          { id: '5', fullName: 'Patricia Vega', voteCount: 8600 }
        ]
      }
    ]
  },
  {
    id: 'e2',
    title: 'Elecciones Municipales 2023',
    positions: [
      {
        id: 'p3',
        title: 'Alcalde Distrital',
        totalVotes: 12500,
        results: [
          { id: '6', fullName: 'Jorge Ramírez', voteCount: 7200 },
          { id: '7', fullName: 'Lucía Fernández', voteCount: 5300 }
        ]
      }
    ]
  }
];

export default function ResultadosPage() {
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

  const getMedalIcon = (index: number) => {
    if (index === 0) return <FaTrophy className="text-yellow-500 text-2xl" />;
    if (index === 1) return <FaMedal className="text-slate-400 text-2xl" />;
    if (index === 2) return <FaMedal className="text-amber-700 text-2xl" />;
    return <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">{index + 1}</div>;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <FaChartBar className="text-5xl text-blue-600" />
          </div>
          <h1 className="text-5xl font-black text-slate-800 mb-4">
            Resultados Electorales 🇵🇪
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Consulta los resultados oficiales y certificados de todas las elecciones realizadas
          </p>
        </motion.div>

        <div className="space-y-10">
          {MOCK_RESULTS.map((election) => (
            <motion.section
              key={election.id}
              variants={itemVariants}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden border-t-8 border-blue-600"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-4xl font-black mb-2">{election.title}</h2>
                    <p className="text-blue-100">Resultados oficiales certificados</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                      <p className="text-5xl font-black">
                        {election.positions.reduce((acc, pos) => acc + pos.totalVotes, 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-blue-100 mt-1">Total de Votos</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-10">
                {election.positions.map((cargo) => {
                  const maxVotes = Math.max(...cargo.results.map(r => r.voteCount));
                  
                  return (
                    <div key={cargo.id} className="space-y-6">
                      <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
                        <h3 className="text-3xl font-bold text-slate-800">{cargo.title}</h3>
                        <span className="text-lg font-semibold text-slate-600">
                          {cargo.totalVotes.toLocaleString()} votos totales
                        </span>
                      </div>

                      <div className="space-y-4">
                        {cargo.results.map((result, index) => {
                          const percentage = (result.voteCount / maxVotes) * 100;
                          const isWinner = index === 0;

                          return (
                            <motion.div
                              key={result.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`relative rounded-2xl overflow-hidden ${
                                isWinner 
                                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400' 
                                  : 'bg-slate-50 border-2 border-slate-200'
                              }`}
                            >
                              <div className="relative z-10 p-6">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-4">
                                    {getMedalIcon(index)}
                                    <div>
                                      <p className={`text-xl font-bold ${isWinner ? 'text-green-700' : 'text-slate-700'}`}>
                                        {result.fullName}
                                      </p>
                                      {isWinner && (
                                        <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mt-1">
                                          GANADOR
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className={`text-3xl font-black ${isWinner ? 'text-green-600' : 'text-slate-700'}`}>
                                      {result.voteCount.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                      {((result.voteCount / cargo.totalVotes) * 100).toFixed(1)}%
                                    </p>
                                  </div>
                                </div>

                                <div className="relative w-full bg-white rounded-full h-4 overflow-hidden shadow-inner">
                                  <motion.div
                                    className={`h-full rounded-full ${
                                      isWinner 
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                                        : 'bg-gradient-to-r from-slate-400 to-slate-500'
                                    }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                                  />
                                </div>
                              </div>

                              {isWinner && (
                                <motion.div
                                  className="absolute top-0 right-0 text-green-200 text-9xl opacity-20"
                                  animate={{ rotate: [0, 10, 0] }}
                                  transition={{ duration: 3, repeat: Infinity }}
                                >
                                  <FaTrophy />
                                </motion.div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
                <p className="text-center text-slate-600 text-sm">
                  Resultados certificados por el Sistema Electoral Nacional
                </p>
              </div>
            </motion.section>
          ))}
        </div>

        {MOCK_RESULTS.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-20 bg-white rounded-3xl shadow-xl"
          >
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Aún no hay resultados disponibles
            </h2>
            <p className="text-slate-600">
              Los resultados se publicarán una vez finalizadas las elecciones
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}