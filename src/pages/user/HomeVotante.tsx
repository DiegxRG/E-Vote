import { useAuth } from '../../hooks/useAuth';
import DniVerification from '../../components/votante/DniVerification';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaVoteYea, FaUsers, FaChartBar, FaCheckCircle, FaClock, FaFire } from 'react-icons/fa';

const MOCK_ACTIVE_ELECTIONS = [
  {
    id: '1',
    title: 'Elecciones Presidenciales 2025',
    endDate: '2025-12-15',
    status: 'active',
    totalVoters: 24567,
    votesCount: 18234
  }
];

const MOCK_STATS = {
  upcomingElections: 2,
  closedElections: 5,
  participationRate: 74.2
};

export default function HomeVotante() {
  const { perfil, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <FaVoteYea className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600 text-2xl" />
        </div>
      </div>
    );
  }

  if (perfil && !perfil.dni) {
    return <DniVerification />;
  }

  const userFullName = perfil?.full_name || 'Votante Verificado';
  const hasActiveElections = MOCK_ACTIVE_ELECTIONS.length > 0;

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
      className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-slate-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <motion.div variants={itemVariants} className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-black text-slate-800 mb-2">
                ¡Bienvenido/a, {userFullName}! 🇵🇪
              </h1>
              <p className="text-lg text-slate-600 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Tu DNI (***{perfil?.dni?.slice(-4)}) ha sido verificado
              </p>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="hidden lg:block"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl">
                <FaVoteYea className="text-white text-4xl" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <Link
            to="/home/vote"
            className={`group relative block overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 ${
              hasActiveElections
                ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:shadow-red-500/50'
                : 'bg-gradient-to-r from-slate-400 to-slate-500'
            }`}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
            
            <div className="relative p-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {hasActiveElections ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="relative flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
                        </span>
                        <span className="text-red-100 font-bold text-sm tracking-wider uppercase">En Vivo</span>
                        <FaFire className="text-yellow-300 animate-pulse" />
                      </div>
                      <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                        ¡{MOCK_ACTIVE_ELECTIONS.length} Elección Activa!
                      </h2>
                      <p className="text-xl text-red-100 mb-6 max-w-2xl">
                        Haz clic para acceder a tu cédula de votación y ejercer tu derecho democrático.
                      </p>
                      <div className="flex gap-8 text-white">
                        <div>
                          <p className="text-3xl font-bold">{MOCK_ACTIVE_ELECTIONS[0].votesCount.toLocaleString()}</p>
                          <p className="text-red-200 text-sm">Votos emitidos</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold">{MOCK_ACTIVE_ELECTIONS[0].totalVoters.toLocaleString()}</p>
                          <p className="text-red-200 text-sm">Votantes habilitados</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <FaCheckCircle className="text-green-400" />
                        <span className="text-white/80 font-semibold">Todo en orden</span>
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-3">
                        No hay elecciones activas
                      </h2>
                      <p className="text-white/80">
                        Te notificaremos cuando haya nuevas votaciones disponibles.
                      </p>
                    </>
                  )}
                </div>
                
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="hidden lg:block"
                >
                  <FaVoteYea className="text-white/20 text-9xl" />
                </motion.div>
              </div>
            </div>
            
            {hasActiveElections && (
              <div className="bg-white/10 backdrop-blur-sm px-10 py-4 flex items-center justify-between border-t border-white/20">
                <span className="text-white font-semibold">Haz clic para votar ahora</span>
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-white text-2xl"
                >
                  →
                </motion.div>
              </div>
            )}
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/home/candidatos"
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-l-8 border-amber-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="relative p-8">
              <FaUsers className="text-5xl text-amber-500 mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Conoce a tus Candidatos</h3>
              <p className="text-slate-600 mb-4">Explora perfiles, propuestas y planes de gobierno de todos los candidatos.</p>
              <div className="flex items-center text-amber-600 font-semibold group-hover:gap-3 transition-all">
                <span>Ver candidatos</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link
            to="/home/resultados"
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-l-8 border-blue-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="relative p-8">
              <FaChartBar className="text-5xl text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Resultados Electorales</h3>
              <p className="text-slate-600 mb-4">Consulta los resultados oficiales de elecciones pasadas y en curso.</p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 transition-all">
                <span>Ver resultados</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Estadísticas del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <FaClock className="text-4xl mb-3 opacity-80" />
              <p className="text-5xl font-black mb-2">{MOCK_STATS.upcomingElections}</p>
              <p className="text-blue-100">Elecciones Próximas</p>
            </div>

            <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl shadow-lg p-6 text-white">
              <FaChartBar className="text-4xl mb-3 opacity-80" />
              <p className="text-5xl font-black mb-2">{MOCK_STATS.closedElections}</p>
              <p className="text-slate-200">Elecciones Finalizadas</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
              <FaCheckCircle className="text-4xl mb-3 opacity-80" />
              <p className="text-5xl font-black mb-2">{MOCK_STATS.participationRate}%</p>
              <p className="text-green-100">Tasa de Participación</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}