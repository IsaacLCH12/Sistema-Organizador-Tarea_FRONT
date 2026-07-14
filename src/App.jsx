import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Registro from './pages/Registro';
import DashboardProyectos from './pages/DashboardProyectos';
import TableroPrincipal from './pages/TableroPrincipal';
import Perfil from './pages/Perfil';

// Componente para proteger rutas que requieren login
function RutaProtegida({ children }) {
  const { usuarioActual } = useAuth();
  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const { usuarioActual } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        usuarioActual ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/dashboard" element={
        <RutaProtegida>
          <DashboardProyectos />
        </RutaProtegida>
      } />
      <Route path="/perfil" element={
        <RutaProtegida>
          <Perfil />
        </RutaProtegida>
      } />
      <Route path="/tablero/:idProyecto" element={
        <RutaProtegida>
          <TableroPrincipal />
        </RutaProtegida>
      } />
    </Routes>
  );
}

export default App;