import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // ✅ NUEVO

// --- VISTAS PÚBLICAS Y VOTANTE ---
import Login from './pages/auth/Login'; 
import HomeVotante from './pages/user/HomeVotante';
import VotacionPage from './pages/user/VotacionPage';

// --- LAYOUTS Y PROTECCIÓN ---
import { ProtectedRoute } from './components/ProtectedRoute'; 
import AdminLayout from './components/AdminLayout';
import VotanteLayout from './components/VotanteLayout';

// --- PÁGINAS DEL ADMIN ---
import DashboardAdmin from './pages/admin/DashboardAdmin';
import GestionElecciones from './pages/admin/GestionElecciones';
import GestionVotantes from './pages/admin/GestionVotantes';
import GestionML from './pages/admin/GestionML';
import GestionPartidos from './pages/admin/GestionPartidos';
import GestionPerfiles from './pages/admin/GestionPerfiles';
import GestionCandidatos from './pages/admin/GestionCanditos'; 
import ResultadosPage from './pages/user/ResultadoPage';
import GestionResultados from './pages/admin/GestionResultados';

// --- PÁGINAS DE VOTANTE ---
import CandidatosLandingPage from './pages/user/CandidatosLandingPage'; 

export default function App() {
  return (
    <Router>
      {/* ✅ TOASTER GLOBAL */}
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1e293b', color: '#fff' },
        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
      }} />

      <Routes>
        {/* RUTA PÚBLICA */}
        <Route path="/login" element={<Login />} />
        
        {/* VOTANTE */}
        <Route element={<ProtectedRoute requiredRole="votante" />}>
          <Route element={<VotanteLayout />}>
            <Route path="/" element={<Navigate to="/home" replace />} /> 
            <Route path="/home" element={<HomeVotante />} />
            <Route path="/home/vote" element={<VotacionPage />} />
            <Route path="/home/candidatos" element={<CandidatosLandingPage />} /> 
            <Route path="/home/resultados" element={<ResultadosPage />} />
          </Route>
        </Route>

        {/* ADMIN */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardAdmin />} />
            <Route path="/admin/elecciones" element={<GestionElecciones />} />
            <Route path="/admin/candidatos" element={<GestionCandidatos />} />
            <Route path="/admin/votantes" element={<GestionVotantes />} />
            <Route path="/admin/partidos" element={<GestionPartidos />} />
            <Route path="/admin/perfiles" element={<GestionPerfiles />} />
            <Route path="/admin/resultados" element={<GestionResultados />} />
            <Route path="/admin/ml" element={<GestionML />} />
          </Route>
        </Route>

        {/* RUTA CATCH-ALL */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}
