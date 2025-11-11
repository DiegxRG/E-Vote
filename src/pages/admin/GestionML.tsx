import React, { useState, useEffect } from 'react';
import { 
  FaUpload, 
  FaBroom, 
  FaBrain, 
  FaRocket, 
  FaFileCsv, 
  FaCheckCircle,
  FaArrowRight,
  FaSpinner
} from 'react-icons/fa';

// --- (Componente 1/5) El Stepper (Pasos) ---
const Stepper = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { num: 1, title: 'Carga de Datos', icon: <FaUpload /> },
    { num: 2, title: 'Limpieza y Preparación', icon: <FaBroom /> },
    { num: 3, title: 'Entrenamiento', icon: <FaBrain /> },
    { num: 4, title: 'Resultados', icon: <FaRocket /> },
  ];

  return (
    <div className="w-full mb-12">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.num}>
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${currentStep > step.num ? 'bg-green-500 text-white' : ''}
                  ${currentStep === step.num ? 'bg-red-600 text-white' : ''}
                  ${currentStep < step.num ? 'bg-gray-200 text-gray-500' : ''}
                `}
              >
                {currentStep > step.num ? <FaCheckCircle /> : React.cloneElement(step.icon, { className: 'w-6 h-6' })}
              </div>
              <p className={`mt-2 text-xs font-semibold ${currentStep >= step.num ? 'text-gray-900' : 'text-gray-500'}`}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-4 rounded-full
                ${currentStep > step.num ? 'bg-green-500' : 'bg-gray-200'}
              `}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// --- (Componente 2/5) Contenido del Paso 1: Carga de Datos ---
const Step1_Upload = ({ onNext }: { onNext: () => void }) => (
  <div className="bg-white p-8 rounded-lg shadow-md animate-fadeIn">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">1. Carga de Datos Históricos</h2>
    <p className="text-gray-600 mb-6">Selecciona un conjunto de datos para analizar. Usaremos esto como base para entrenar el modelo de detección de anomalías.</p>
    
    {/* Datasets Simulados */}
    <div className="space-y-4">
      <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
        <div className="flex items-center gap-4">
          <FaFileCsv className="w-8 h-8 text-blue-500" />
          <div>
            <p className="font-semibold text-gray-900">votos_historicos_2022.csv</p>
            <p className="text-sm text-gray-500">150,230 registros | 12 MB</p>
          </div>
        </div>
        <FaCheckCircle className="w-6 h-6 text-green-500" />
      </div>
      <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between bg-gray-100 opacity-60">
        <div className="flex items-center gap-4">
          <FaFileCsv className="w-8 h-8 text-gray-500" />
          <div>
            <p className="font-semibold text-gray-500">padron_electoral_2025.csv</p>
            <p className="text-sm text-gray-500">25,100,000 registros | 2.1 GB (No seleccionado)</p>
          </div>
        </div>
      </div>
    </div>

    <button
      onClick={onNext}
      className="mt-8 flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 font-medium transition"
    >
      Siguiente: Limpiar Datos <FaArrowRight />
    </button>
  </div>
);

// --- (Componente 3/5) Contenido del Paso 2: Limpieza ---
const Step2_Clean = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="bg-white p-8 rounded-lg shadow-md animate-fadeIn">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">2. Limpieza y Preparación</h2>
    <p className="text-gray-600 mb-6">Analizando la calidad de los datos de `votos_historicos_2022.csv`. 98% de calidad detectada.</p>
    
    <h3 className="text-lg font-semibold mb-2">Acciones de Limpieza:</h3>
    <ul className="space-y-2 text-gray-700">
      <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> 150,230 registros encontrados.</li>
      <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> 2,104 duplicados eliminados.</li>
      <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> 0 valores nulos en "DNI".</li>
      <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> "Timestamp" estandarizado a UTC-5.</li>
    </ul>

    <h3 className="text-lg font-semibold mt-6 mb-2">Vista Previa de Datos:</h3>
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">ID_VOTO</th>
            <th className="p-3 text-left">DNI_ENCRIPTADO</th>
            <th className="p-3 text-left">TIMESTAMP</th>
            <th className="p-3 text-left">ID_CANDIDATO</th>
            <th className="p-3 text-left">IP_ORIGEN</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t"><td className="p-3">v-1...a4</td><td className="p-3">...xyz</td><td className="p-3">2022-10-02 08:01:15</td><td className="p-3">c-9...b1</td><td className="p-3">190.x.x.x</td></tr>
          <tr className="border-t"><td className="p-3">v-1...b9</td><td className="p-3">...abc</td><td className="p-3">2022-10-02 08:01:22</td><td className="p-3">c-2...e4</td><td className="p-3">181.x.x.x</td></tr>
          <tr className="border-t"><td className="p-3">v-1...c5</td><td className="p-3">...qwe</td><td className="p-3">2022-10-02 08:01:30</td><td className="p-3">c-9...b1</td><td className="p-3">200.x.x.x</td></tr>
        </tbody>
      </table>
    </div>

    <div className="flex justify-between mt-8">
      <button onClick={onBack} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Atrás</button>
      <button onClick={onNext} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 font-medium transition">
        Siguiente: Entrenar Modelo <FaArrowRight />
      </button>
    </div>
  </div>
);

// --- (Componente 4/5) Contenido del Paso 3: Entrenamiento ---
const Step3_Train = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const [isTraining, setIsTraining] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const handleTrain = () => {
    setIsTraining(true);
    setLog(["Iniciando entrenamiento del modelo de Detección de Fraude..."]);
    
    // Simulación de entrenamiento
    const intervals: number[] = [];
    const messages = [
      "Epoch 1/10 - loss: 0.1234 - accuracy: 0.9510",
      "Epoch 2/10 - loss: 0.0980 - accuracy: 0.9620",
      "Epoch 3/10 - loss: 0.0750 - accuracy: 0.9710",
      "Epoch 4/10 - loss: 0.0610 - accuracy: 0.9780",
      "Epoch 5/10 - loss: 0.0500 - accuracy: 0.9820",
      "Validando modelo...",
      "Epoch 6/10 - loss: 0.0450 - accuracy: 0.9850",
      "Epoch 7/10 - loss: 0.0410 - accuracy: 0.9870",
      "Epoch 8/10 - loss: 0.0390 - accuracy: 0.9890",
      "Epoch 9/10 - loss: 0.0370 - accuracy: 0.9910",
      "Epoch 10/10 - loss: 0.0350 - accuracy: 0.9930",
      "¡Entrenamiento completado! Precisión del modelo: 99.32%"
    ];
    
    messages.forEach((msg, index) => {
      intervals.push(window.setTimeout(() => {
        setLog(prev => [...prev, msg]);
        setProgress(((index + 1) / messages.length) * 100);
        if (index === messages.length - 1) {
          setIsTraining(false);
        }
      }, (index + 1) * 600));
    });
    
    return () => intervals.forEach(clearTimeout);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">3. Entrenamiento del Modelo</h2>
      <p className="text-gray-600 mb-4">Selecciona el tipo de modelo a entrenar basado en los datos preparados.</p>
      
      {/* Selección de Modelo (Simulado) */}
      <div className="space-y-3 mb-6">
        <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer bg-blue-50 border-blue-300">
          <input type="radio" name="model" className="form-radio text-red-600" defaultChecked />
          <div>
            <span className="font-semibold text-gray-900">Detección de Fraude (Autoencoder)</span>
            <p className="text-sm text-gray-600">Identifica patrones de voto anómalos (ej. IPs, tiempos).</p>
          </div>
        </label>
        <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
          <input type="radio" name="model" className="form-radio text-red-600" disabled />
          <div>
            <span className="font-semibold text-gray-500">Predicción de Ausentismo (Regresión Logística)</span>
            <p className="text-sm text-gray-500">Modela la probabilidad de que un votante no participe.</p>
          </div>
        </label>
      </div>

      <button
        onClick={handleTrain}
        disabled={isTraining}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 font-medium transition disabled:opacity-50"
      >
        {isTraining ? <FaSpinner className="animate-spin" /> : <FaBrain />}
        {isTraining ? 'Entrenando...' : 'Iniciar Entrenamiento'}
      </button>

      {/* Consola de Entrenamiento Simulada */}
      {log.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Progreso del Entrenamiento:</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="bg-gray-900 text-white font-mono text-xs rounded-lg p-4 h-48 overflow-y-auto">
            {log.map((line, i) => (
              <p key={i} className={line.startsWith('¡') ? 'text-green-400' : ''}>{line}</p>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition" disabled={isTraining}>Atrás</button>
        <button onClick={onNext} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 font-medium transition" disabled={isTraining || progress < 100}>
          Desplegar Modelo <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

// --- (Componente 5/5) Contenido del Paso 4: Resultados ---
const Step4_Results = ({ onBack }: { onBack: () => void }) => {
  const [liveFeed, setLiveFeed] = useState<string[]>([]);
  
  // Simulación de feed en vivo
  useEffect(() => {
    const feedItems = [
      "[20:15:30] Voto 9a...b4 - OK",
      "[20:15:31] Voto 9a...c1 - OK",
      "[20:15:33] Voto 9a...d8 - ALERTA: Múltiples votos en < 1s (IP: 190.x.x.x)",
      "[20:15:34] Voto 9a...e2 - OK",
      "[20:15:36] Voto 9a...f9 - OK",
      "[20:15:38] Voto 9b...a3 - OK",
      "[20:15:39] Voto 9b...b7 - ALERTA: Patrón de tiempo inusual (Fuera de horario)",
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < feedItems.length) {
        setLiveFeed(prev => [feedItems[index], ...prev]);
        index++;
      }
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">4. Modelo Desplegado y Resultados</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-600 mb-4">El modelo de Detección de Fraude está activo y monitoreando la votación actual.</p>
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
            <p className="font-bold">Estado del Modelo: ACTIVO</p>
            <p className="text-sm">Precisión: 99.32%</p>
          </div>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg mt-4">
            <p className="font-bold">Alertas Generadas (última hora)</p>
            <p className="text-3xl font-bold">2</p>
          </div>
        </div>

        {/* Feed en Vivo (Simulado) */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Predicciones en Vivo:</h3>
          <div className="bg-gray-900 text-white font-mono text-xs rounded-lg p-4 h-48 overflow-y-auto">
            {liveFeed.length === 0 && <p className="text-gray-400">Esperando nuevos votos...</p>}
            {liveFeed.map((line, i) => (
              <p key={i} className={line?.includes('ALERTA') ? 'text-red-400' : 'text-green-300'}>{line}</p>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <button onClick={onBack} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Atrás: Re-entrenar</button>
      </div>
    </div>
  );
};


// --- (COMPONENTE PRINCIPAL) ---
export default function GestionML() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1_Upload onNext={handleNext} />;
      case 2:
        return <Step2_Clean onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Step3_Train onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <Step4_Results onBack={handleBack} />;
      default:
        return <Step1_Upload onNext={handleNext} />;
    }
  };

  return (
    // Contenedor principal con fondo gris
    <div className="p-6 md:p-8 bg-slate-100 min-h-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Módulo de Machine Learning
      </h1>

      {/* Tarjeta contenedora principal */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
        {/* El Stepper (Pasos) */}
        <Stepper currentStep={currentStep} />
        
        {/* El contenido dinámico del paso */}
        {renderStepContent()}
      </div>
    </div>
  );
}