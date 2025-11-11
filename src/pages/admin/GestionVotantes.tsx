import  { useState } from 'react';
import { 
  FaUsers, 
  FaCheckCircle, 
  FaPercentage, 
  FaSearch, 
  FaFileCsv
} from 'react-icons/fa';

// Importamos Chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Registramos los componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// --- DATOS SIMULADOS ---

// Datos para la tabla de votantes
const mockVoters = [
  { id: 1, name: 'Ana García López', dni: '71234567', status: 'Votó' },
  { id: 2, name: 'Luis Martínez Rodríguez', dni: '72345678', status: 'Votó' },
  { id: 3, name: 'María Fernández Pérez', dni: '73456789', status: 'Pendiente' },
  { id: 4, name: 'Carlos Sánchez Gómez', dni: '74567890', status: 'Votó' },
  { id: 5, name: 'Laura Díaz Castillo', dni: '75678901', status: 'Pendiente' },
  { id: 6, name: 'Javier Torres Vargas', dni: '76789012', status: 'Pendiente' },
  { id: 7, name: 'Sofía Mendoza Ruiz', dni: '77890123', status: 'Votó' },
];

// Datos para el gráfico de dona
const totalVotos = 9812;
const totalPendientes = 15230 - totalVotos; // 5418

const chartData = {
  labels: ['Votos Emitidos', 'Pendientes'],
  datasets: [
    {
      data: [totalVotos, totalPendientes],
      backgroundColor: [
        '#22C55E', // verde-500
        '#E5E7EB', // gris-200
      ],
      borderColor: [
        '#FFFFFF',
        '#FFFFFF',
      ],
      borderWidth: 2,
    },
  ],
};

const chartOptions = {
  responsive: true,
  cutout: '70%', // Esto crea el efecto "dona"
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          return `${context.label}: ${context.raw.toLocaleString('es-PE')}`;
        },
      },
    },
  },
};

// --- COMPONENTE ---

export default function GestionVotantes() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtramos la data simulada (esto simula la lógica de búsqueda)
  const filteredVoters = mockVoters.filter(
    (voter) =>
      voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.dni.includes(searchTerm)
  );

  return (
    <div className="p-6 md:p-8 bg-slate-100 min-h-full">
      
      {/* 1. Encabezado */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Padrón de Votantes
      </h1>

      {/* 2. Tarjetas de Estadísticas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Card: Total Votantes */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <FaUsers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Votantes (Padrón)</p>
            <p className="text-3xl font-bold text-gray-900">15,230</p>
          </div>
        </div>

        {/* Card: Votos Emitidos */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <FaCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Votos Emitidos</p>
            <p className="text-3xl font-bold text-gray-900">{totalVotos.toLocaleString('es-PE')}</p>
          </div>
        </div>

        {/* Card: Participación */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <FaPercentage className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tasa de Participación</p>
            <p className="text-3xl font-bold text-gray-900">
              {((totalVotos / 15230) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* 3. Contenido Principal (Gráficos y Tabla) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Tabla de Votantes */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          {/* Encabezado de la Tabla (con Búsqueda) */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Buscar por Nombre o DNI..."
              />
            </div>
          </div>
          
          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre Completo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DNI
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVoters.map((voter) => (
                  <tr key={voter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">{voter.name}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">{voter.dni}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {voter.status === 'Votó' ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-700">
                          <FaCheckCircle className="mr-1.5 h-4 w-4" />
                          Votó
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-700">
                          Pendiente
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Columna Derecha: Gráfico y Carga */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Card: Gráfico de Participación */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Resumen de Participación
            </h2>
            <div className="max-w-xs mx-auto">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Card: Carga Masiva */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Carga Masiva (CSV)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Sube el padrón de votantes oficial en formato .csv. El archivo debe contener las columnas: "DNI" y "NombreCompleto".
            </p>
            
            {/* Zona de "Drag and Drop" */}
            <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <FaFileCsv className="w-12 h-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Arrastra y suelta tu archivo .csv aquí
              </p>
              <p className="text-xs text-gray-500 my-1">o</p>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Seleccionar Archivo
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}