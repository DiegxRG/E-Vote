// pages/user/CandidatosLandingPage.tsx
import React, { useState } from 'react';
import CandidatoCard from '../../components/votante/CandidatoCard';
import { useCandidatos } from '../../hooks/useCandidatos'; // 🚨 Usamos el hook
import AficheModal from '../../components/votante/AficheModal'; // 🚨 Importamos el Modal
import type { CandidatoCompleto } from '../../hooks/useCandidatos'; // 🚨 Importamos el tipo
import { motion } from 'framer-motion';

export default function CandidatosLandingPage() {
  
  // 🚨 Obtenemos los candidatos reales del hook
  const { candidatos, loading } = useCandidatos();
  
  // 🚨 Estado para manejar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidato, setSelectedCandidato] = useState<CandidatoCompleto | null>(null);

  const handleOpenAfiche = (candidato: CandidatoCompleto) => {
    setSelectedCandidato(candidato);
    setIsModalOpen(true);
  };

  const handleCloseAfiche = () => {
    setIsModalOpen(false);
    setSelectedCandidato(null);
  };

  // Agrupamos candidatos por cargo para un look "extraordinario"
  const candidatosAgrupados = React.useMemo(() => {
    const grupos: { [key: string]: CandidatoCompleto[] } = {};
    candidatos.forEach(c => {
      const cargoTitulo = (c as any).positions?.title || 'Otros';
      if (!grupos[cargoTitulo]) {
        grupos[cargoTitulo] = [];
      }
      grupos[cargoTitulo].push(c);
    });
    return grupos;
  }, [candidatos]);

  return (
    <> {/* Fragmento para que el modal flote */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold text-slate-800 border-b-4 border-red-600 pb-2 mb-10">
          Conoce a tus Candidatos 🇵🇪
        </h1>
        
        {loading ? (
          <div className="text-center py-10">Cargando candidatos...</div>
        ) : (
          <div className="space-y-12">
            {/* 🚨 Mapeamos los grupos */}
            {Object.entries(candidatosAgrupados).map(([cargo, lista]) => (
              <section key={cargo} className="mb-12">
                <h2 className="text-3xl font-bold text-red-600 mb-6">
                  Candidatos a {cargo}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {lista.map((candidato) => (
                    <CandidatoCard 
                      key={candidato.id} 
                      fullName={candidato.full_name}
                      partyName={(candidato as any).parties?.name || 'Independiente'}
                      positionTitle={(candidato as any).positions?.title || 'Sin Cargo'}
                      photoUrl={candidato.photo_url || 'https://dummyimage.com/150x150/000/fff'}
                      // 🚨 Pasamos la función para abrir el modal
                      onVerPlan={() => handleOpenAfiche(candidato)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </motion.div>

      {/* 🚨 Renderizamos el Modal */}
      <AficheModal
        isOpen={isModalOpen}
        onClose={handleCloseAfiche}
        candidato={selectedCandidato}
      />
    </>
  );
}