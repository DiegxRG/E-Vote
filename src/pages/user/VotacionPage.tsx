import { useState, useEffect, useMemo } from 'react';
import { useVoto } from '../../hooks/useVoto';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FaVoteYea } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

import BallotStepper from '../../components/votante/BallotStepper';
import ConfirmationSummary from '../../components/votante/ConfirmationSummary';

export default function VotacionPage() {
  const { 
    allCategorizedElections, selectedElection, positions, cargando, error, 
    selectElection, updateSelection, submitVote, votoSeleccionado, 
    isSubmitting, votoError 
  } = useVoto();

  const { perfil } = useAuth();
  const navigate = useNavigate();

  const activeElections = allCategorizedElections.active;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Selección automática si hay solo una elección activa
  useEffect(() => {
    if (!cargando && activeElections.length === 1 && !selectedElection) {
      selectElection(activeElections[0].id);
    }
  }, [cargando, activeElections, selectedElection, selectElection]);

  // Cálculo de votos pendientes
  const votosPendientes = useMemo(() => {
    if (!positions) return 0;
    return positions.length - Object.keys(votoSeleccionado).length;
  }, [votoSeleccionado, positions]);

  // Emitir voto
  const handleEmitirVoto = async () => {
    if (!perfil) return;
    if (positions) {
      positions.forEach(pos => {
        if (!votoSeleccionado.hasOwnProperty(pos.id)) {
          updateSelection(pos.id, null); // Voto en blanco
        }
      });
    }

    try {
      await submitVote();
      setShowSuccessModal(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        navigate('/home');
      }, 3500);
    } catch {
      alert(votoError || "Ocurrió un error crítico al emitir el voto.");
    }
  };

  // --- ESTADOS DE CARGA O ERROR ---
  if (cargando)
    return (
      <div className="text-center py-20 text-slate-700 animate-pulse">
        Cargando datos de votación...
      </div>
    );

  if (error || (activeElections.length === 0 && !selectedElection)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 p-8 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-2xl"
      >
        <h1 className="text-3xl font-extrabold text-slate-800 mb-4">⚠️ No hay Elecciones Activas</h1>
        <p className="text-gray-600">Por favor, regresa más tarde o contacta al administrador.</p>
      </motion.div>
    );
  }

  // --- SELECCIÓN DE ELECCIÓN ---
  if (!selectedElection && activeElections.length > 1) {
    return (
      <div className="p-8 bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">🗳️ Selecciona la Elección</h1>
        <div className="space-y-3">
          {activeElections.map(election => (
            <motion.button 
              key={election.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectElection(election.id)}
              className="w-full text-left p-4 border border-red-500 bg-white/80 backdrop-blur-sm 
                        text-red-700 font-semibold rounded-lg shadow-sm hover:shadow-md hover:bg-red-50 
                        transition-all duration-300"
            >
              {election.title}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // --- VISTA PRINCIPAL DE VOTACIÓN ---
  if (selectedElection && positions) {
    return (
      <motion.div 
        className="max-w-4xl mx-auto space-y-8 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Encabezado */}
        <motion.div 
          className="p-5 rounded-xl shadow-lg text-white bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
          <h1 className="text-3xl font-extrabold">{selectedElection.title} 🇵🇪</h1>
          <p className="text-sm mt-2">Votante: {perfil?.full_name}</p>
          <span className="text-xs opacity-80">Tu voto es anónimo y está protegido.</span>
        </motion.div>

        {/* Error */}
        {votoError && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-red-100 text-red-700 rounded-lg"
          >
            ⚠️ Error en la transacción: {votoError}
          </motion.div>
        )}

        {/* Cédula */}
        <BallotStepper 
          positions={positions}
          votoChoices={votoSeleccionado}
          onSelect={(posId, candId) => updateSelection(posId, candId)}
        />

        {/* Resumen */}
        <ConfirmationSummary 
          votoChoices={votoSeleccionado}
          positions={positions}
        />

        {/* Botón de confirmación */}
        <div className="flex justify-end items-center mt-10 pt-6 border-t border-gray-200">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleEmitirVoto}
            disabled={isSubmitting || votosPendientes > 0}
            className={`px-8 py-4 text-lg rounded-xl font-bold flex items-center space-x-3 transition-all shadow-lg 
              ${isSubmitting || votosPendientes > 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'}`}
          >
            <span>
              {isSubmitting 
                ? 'Procesando Voto...' 
                : votosPendientes > 0 
                  ? `Faltan ${votosPendientes} cargos` 
                  : 'Emitir Voto Final'}
            </span>
            <FaVoteYea className="text-2xl" />
          </motion.button>
        </div>

        {/* Modal de Éxito */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div 
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              {showConfetti && <Confetti numberOfPieces={400} gravity={0.25} />}

              <motion.div 
                className="bg-white p-10 rounded-3xl shadow-2xl text-center relative overflow-hidden max-w-md mx-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-200/20 blur-2xl"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                />
                <FaVoteYea className="text-red-600 text-6xl mx-auto mb-4 drop-shadow-lg" />
                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">¡Voto Emitido!</h2>
                <p className="text-gray-600 mb-4">Tu voto fue registrado correctamente. 🇵🇪</p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="inline-block text-red-700 font-semibold text-sm bg-red-50 px-4 py-2 rounded-full">
                    Redirigiendo al inicio...
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // --- fallback ---
  return (
    <div className="text-center py-20 p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">Cargando Cargos...</h1>
    </div>
  );
}
