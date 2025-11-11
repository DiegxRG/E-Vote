import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaVoteYea } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [esRegistro, setEsRegistro] = useState(false);
  const [error, setError] = useState('');
  const { iniciarSesion, registrarse, cargando, usuario, rol } = useAuth();

  if (!cargando && usuario) {
    return <Navigate to={rol === 'admin' ? '/admin' : '/home'} replace />;
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-purple-600 to-blue-600">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <FaVoteYea className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl" />
        </div>
      </div>
    );
  }

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { error: authError } = esRegistro
      ? await registrarse(email, password)
      : await iniciarSesion(email, password);

    if (authError) {
      setError(authError.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block p-4 bg-white/20 rounded-full mb-4"
            >
              <FaVoteYea className="text-5xl text-white" />
            </motion.div>
            <h2 className="text-4xl font-black text-white mb-2">
              {esRegistro ? 'Crear Cuenta' : 'E-Vote App'}
            </h2>
            <p className="text-white/90 text-lg">
              {esRegistro ? 'Regístrate para comenzar' : 'Sistema Electoral Digital 🇵🇪'}
            </p>
          </div>

          <form onSubmit={manejarEnvio} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-white/50" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/20 text-white placeholder-white/70 py-3 rounded-xl border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none pl-12 transition-all"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-white/50" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/20 text-white placeholder-white/70 py-3 rounded-xl border border-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none pl-12 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/30 border-2 border-red-400 text-white px-4 py-3 rounded-xl text-sm font-medium backdrop-blur-sm"
              >
                ⚠️ {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-blue-600 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={cargando}
            >
              {cargando ? 'Procesando...' : (esRegistro ? 'Registrarse' : 'Iniciar Sesión')}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setEsRegistro(!esRegistro)}
              className="text-white hover:text-white/90 text-sm font-semibold transition-colors underline decoration-2 underline-offset-4"
            >
              {esRegistro
                ? '¿Ya tienes cuenta? Inicia sesión'
                : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/60 text-xs">
              Sistema Electoral Seguro y Transparente
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}