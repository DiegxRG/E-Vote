// components/votante/ActionCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronRight } from 'react-icons/fa';

interface ActionCardProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  borderColorClass: string; // Ej: 'border-amber-500'
}

// Variantes de animación para Framer Motion
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ActionCard({ to, icon, title, description, borderColorClass }: ActionCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className={`bg-white rounded-xl shadow-lg border-l-8 ${borderColorClass} p-6 flex flex-col justify-between`}
    >
      <div>
        <div className={`text-4xl ${borderColorClass.replace('border-', 'text-')}`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mt-4">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
      <Link 
        to={to} 
        className="mt-6 flex items-center space-x-2 font-semibold text-slate-800 hover:text-red-600 transition"
      >
        <span>Ir ahora</span>
        <FaChevronRight />
      </Link>
    </motion.div>
  );
}