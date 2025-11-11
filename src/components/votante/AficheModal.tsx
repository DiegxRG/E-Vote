import DOMPurify from 'dompurify';
// 🚨 CORRECCIÓN 1: Importamos el tipo desde 'useCandidatos'
import type { CandidatoCompleto } from '../../hooks/useCandidatos'; 
import { FaTimes } from 'react-icons/fa';
// 🚨 CORRECCIÓN 2: Importamos 'Variants' de Framer Motion
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
interface AficheModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidato: CandidatoCompleto | null;
}

// Variantes de animación para el fondo (con tipo)
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Variantes de animación para el modal (con tipo)
const modalVariants: Variants = {
  hidden: { y: "50vh", opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 100, damping: 20 } 
  },
  exit: { 
    y: "50vh", 
    opacity: 0, 
    transition: { duration: 0.3 } 
  },
};

export default function AficheModal({ isOpen, onClose, candidato }: AficheModalProps) {
  
  // Función para limpiar y renderizar HTML de forma segura
 const createMarkup = (htmlContent: string | null | undefined): { __html: string } => {
  if (!htmlContent) return { __html: '<p class="text-gray-500 italic">No hay un plan de gobierno detallado.</p>' };
  const sanitizedHtml = DOMPurify.sanitize(htmlContent);
  return { __html: sanitizedHtml };
};
  
  // 🚨 CORRECCIÓN 3: Accedemos a los datos aplanados (el hook ya hizo el trabajo)
  const perfil = candidato?.candidate_profiles;
  const partido = candidato?.parties;
  const cargo = candidato?.positions;

  return (
    <AnimatePresence>
      {isOpen && candidato && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose} // Cierra al hacer clic en el fondo
        >
          <motion.div
            className="bg-white w-full max-w-4xl rounded-xl shadow-2xl max-h-[90vh] flex flex-col"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal cierre el modal
          >
            {/* Cabecera del Afiche (con la foto banner) */}
            <div 
              className="h-48 rounded-t-xl bg-gray-300 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${perfil?.photo_banner_url || 'https://dummyimage.com/800x300/ccc/fff'})` }}
            >
              <button 
                onClick={onClose} 
                className="absolute top-3 right-3 bg-black/30 text-white rounded-full p-2 hover:bg-black/60 transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Contenido Principal */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              
              {/* Info del Candidato */}
              <div className="flex items-center space-x-4">
                <img 
                  src={candidato.photo_url || 'https://dummyimage.com/150x150/000/fff'} 
                  alt={candidato.full_name} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg -mt-20" // Efecto -mt
                />
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-800">{candidato.full_name}</h2>
                  <p className="text-xl font-medium text-red-600">{cargo?.title || 'Sin Cargo'}</p>
                  <p className="text-lg text-gray-600">{partido?.name || 'Independiente'}</p>
                </div>
              </div>
              
              {/* Plan de Gobierno (Renderizado HTML) */}
              <article>
                <h3 className="text-2xl font-bold text-slate-800 mb-3 border-b-2 border-red-500 pb-2">
                  Plan de Gobierno
                </h3>
                {/* 🚨 Aquí se renderiza el contenido "Tipo Word" */}
                <div 
                  className="prose prose-lg max-w-none" // 'prose' de Tailwind formatea el HTML
                  dangerouslySetInnerHTML={createMarkup(perfil?.plan_de_gobierno)}
                />
              </article>
              
              {/* Galería de Fotos */}
              {perfil && (perfil.photo_action_1_url || perfil.photo_action_2_url) && (
                <aside>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3 border-b-2 border-red-500 pb-2">
                    Galería
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {perfil.photo_action_1_url && (
                      <img src={perfil.photo_action_1_url} alt="Acción 1" className="w-full h-48 object-cover rounded-lg shadow-md" />
                    )}
                    {perfil.photo_action_2_url && (
                      <img src={perfil.photo_action_2_url} alt="Acción 2" className="w-full h-48 object-cover rounded-lg shadow-md" />
                    )}
                  </div>
                </aside>
              )}

              {/* Info del Partido */}
              {partido?.description && (
                <aside>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3 border-b-2 border-red-500 pb-2">
                    Sobre el Partido ({partido.name})
                  </h3>
                  <p className="text-gray-700 italic prose max-w-none">{partido.description}</p>
                </aside>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}