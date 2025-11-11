import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { FaUsers, FaVoteYea, FaChartLine, FaFire, FaClock, FaCheckCircle } from 'react-icons/fa';

const MOCK_STATS = {
  totalVotantes: 24567,
  votantesNuevos: 342,
  eleccionesActivas: 1,
  eleccionesCerradas: 5,
  tasaParticipacion: 74.2,
  votosTotales: 18234,
  ultimaActividad: '2 minutos'
};

const RECENT_ACTIVITY = [
  { id: 1, action: 'Nuevo votante registrado', user: 'Juan Pérez', time: '2 min' },
  { id: 2, action: 'Voto emitido', user: 'María García', time: '5 min' },
  { id: 3, action: 'Candidato registrado', user: 'Admin', time: '15 min' },
  { id: 4, action: 'Elección activada', user: 'Admin', time: '1 hora' }
];

export default function DashboardAdmin() {
  const { perfil } = useAuth();

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
          Bienvenido, {perfil?.full_name || 'Admin'} 👋
        </h1>
        <p className="text-lg text-slate-600">
          Resumen de la actividad del sistema electoral
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <FaUsers className="text-5xl mb-4 opacity-80" />
          <p className="text-3xl font-black mb-1">{MOCK_STATS.totalVotantes.toLocaleString()}</p>
          <p className="text-blue-100">Votantes Registrados</p>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <FaFire className="text-yellow-300" />
            <span>+{MOCK_STATS.votantesNuevos} esta semana</span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <FaVoteYea className="text-5xl mb-4 opacity-80" />
          <p className="text-3xl font-black mb-1">{MOCK_STATS.eleccionesActivas}</p>
          <p className="text-green-100">Elecciones Activas</p>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <span>En curso ahora</span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <FaChartLine className="text-5xl mb-4 opacity-80" />
          <p className="text-3xl font-black mb-1">{MOCK_STATS.tasaParticipacion}%</p>
          <p className="text-purple-100">Tasa de Participación</p>
          <div className="mt-3 text-sm">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: `${MOCK_STATS.tasaParticipacion}%` }}></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <FaCheckCircle className="text-5xl mb-4 opacity-80" />
          <p className="text-3xl font-black mb-1">{MOCK_STATS.votosTotales.toLocaleString()}</p>
          <p className="text-red-100">Votos Emitidos</p>
          <div className="mt-3 text-sm text-red-100">
            Última actualización: {MOCK_STATS.ultimaActividad}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Actividad Reciente</h2>
            <FaClock className="text-slate-400 text-xl" />
          </div>

          <div className="space-y-4">
            {RECENT_ACTIVITY.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{activity.action}</p>
                  <p className="text-sm text-slate-500">{activity.user}</p>
                </div>
                <span className="text-sm text-slate-400">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-6 text-white"
        >
          <h2 className="text-2xl font-bold mb-6">Acciones Rápidas</h2>
          <div className="space-y-3">
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors text-left px-4">
              + Nueva Elección
            </button>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors text-left px-4">
              + Registrar Candidato
            </button>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors text-left px-4">
              📊 Ver Reportes
            </button>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors text-left px-4">
              ⚙️ Configuración
            </button>
          </div>

          <div className="mt-8 p-4 bg-red-500/20 rounded-xl border border-red-400">
            <p className="text-sm font-semibold mb-2">Sistema Electoral Activo</p>
            <p className="text-xs text-red-200">Monitoreo en tiempo real habilitado</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Resumen de Elecciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <p className="text-4xl font-black text-blue-600 mb-2">2</p>
            <p className="text-slate-600 font-semibold">Próximas</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <p className="text-4xl font-black text-green-600 mb-2">{MOCK_STATS.eleccionesActivas}</p>
            <p className="text-slate-600 font-semibold">En Curso</p>
          </div>
          <div className="text-center p-6 bg-slate-100 rounded-xl">
            <p className="text-4xl font-black text-slate-600 mb-2">{MOCK_STATS.eleccionesCerradas}</p>
            <p className="text-slate-600 font-semibold">Finalizadas</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}