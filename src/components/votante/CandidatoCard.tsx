import { motion } from 'framer-motion';
import { FaUser, FaFlag } from 'react-icons/fa';

interface CandidateProps {
  fullName: string;
  partyName: string;
  photoUrl: string;
  positionTitle: string;
  onVerPlan: () => void;
}

export default function CandidatoCard({ fullName, partyName, photoUrl, positionTitle, onVerPlan }: CandidateProps) {
  return (
    <motion.div
      className="group relative bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg hover:shadow-2xl border-2 border-slate-100 overflow-hidden transition-all duration-300"
      whileHover={{ y: -8, scale: 1.02 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-red-500 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
      
      <div className="p-6 text-center relative">
        <div className="relative inline-block mb-4">
          <motion.img
            src={photoUrl}
            alt={fullName}
            className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-white shadow-xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <div className="absolute -bottom-2 -right-2 bg-red-600 text-white rounded-full p-2 shadow-lg">
            <FaUser className="text-sm" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-red-600 transition-colors">
          {fullName}
        </h3>

        <div className="flex items-center justify-center gap-2 text-sm text-slate-600 mb-3">
          <FaFlag className="text-amber-500" />
          <span className="font-medium">{positionTitle}</span>
        </div>

        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white text-sm font-semibold px-4 py-2 rounded-full mb-4 shadow-md">
          {partyName}
        </div>

        <motion.button
          onClick={onVerPlan}
          className="w-full py-3 text-sm bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Ver Perfil Completo
        </motion.button>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>
    </motion.div>
  );
}