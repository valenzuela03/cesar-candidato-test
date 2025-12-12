import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MaestroDashboard from './pages/MaestroDashboard';
import MateriaDetalle from './pages/MateriaDetalle';
import CalificarAlumno from './pages/CalificarAlumno';
import AdminDashboard from './pages/AdminDashboard';
import AdminEditarCalificacion from './pages/AdminEditarCalificacion';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Placeholder para rutas protegidas */}
        <Route path="/maestro/dashboard" element={<MaestroDashboard />} />
        <Route path="/maestro/materia/:materiaId" element={<MateriaDetalle />} />
        <Route path="/maestro/calificar/:materiaId/:alumnoId" element={<CalificarAlumno />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/editar/:materiaId/:alumnoId" element={<AdminEditarCalificacion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
