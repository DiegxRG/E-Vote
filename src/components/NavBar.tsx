import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaVoteYea, FaHome, FaUsers, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function NavBar() {
  const { rol, cerrarSesion, perfil } = useAuth();
  const location = useLocation();
  const isVotante = rol === 'votante';

  if (rol === null && location.pathname !== '/login') return null;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 shadow-2xl sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to={isVotante ? "/home" : "/login"}
            className="flex items-center space-x-3 group"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-red-600 p-2 rounded-lg"
            >
              <FaVoteYea className="text-white text-2xl" />
            </motion.div>
            <div>
              <span className="text-white text-2xl font-black tracking-tight">E-Vote</span>
              <span className="text-red-500 text-2xl font-black"> App</span>
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            {isVotante && (
              <>
                <Link
                  to="/home"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    location.pathname === '/home'
                      ? 'bg-red-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <FaHome />
                  <span className="hidden sm:inline">Inicio</span>
                </Link>

                <Link
                  to="/home/candidatos"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    location.pathname === '/home/candidatos'
                      ? 'bg-red-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <FaUsers />
                  <span className="hidden sm:inline">Candidatos</span>
                </Link>

                <Link
                  to="/home/resultados"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    location.pathname === '/home/resultados'
                      ? 'bg-red-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <FaChartBar />
                  <span className="hidden sm:inline">Resultados</span>
                </Link>

                <Link
                  to="/home/vote"
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  <FaVoteYea />
                  <span>VOTAR</span>
                </Link>
              </>
            )}

            {rol && (
              <div className="flex items-center space-x-4">
                {perfil?.full_name && (
                  <div className="hidden md:flex items-center space-x-2 text-white">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-bold">
                      {perfil.full_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{perfil.full_name}</span>
                  </div>
                )}
                
                <motion.button
                  onClick={cerrarSesion}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all font-medium"
                >
                  <FaSignOutAlt />
                  <span className="hidden sm:inline">Salir</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}