import { FaGithub, FaLinkedin, FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              🗳️ E-Vote App
            </h3>
            <p className="text-slate-300 text-sm">
              Sistema Electoral Digital seguro y transparente para el Perú
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li><a href="#" className="hover:text-red-400 transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Soporte</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <FaGithub />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6 text-center">
          <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
            © {new Date().getFullYear()} E-Vote App. Desarrollado con <FaHeart className="text-red-500" /> por el equipo de desarrollo
          </p>
          <p className="text-slate-500 text-xs mt-2">
            React • TypeScript • Tailwind CSS • Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}