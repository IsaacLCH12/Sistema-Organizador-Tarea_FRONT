import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listarProyectos, crearProyecto, unirseProyecto, listarMiembros, eliminarProyecto } from '../services/proyectoService';
import Navbar from '../components/Navbar';
import { Plus, Users, Trash2 } from 'lucide-react';

export default function DashboardProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalUnirse, setMostrarModalUnirse] = useState(false);
  const [proyectoAEliminar, setProyectoAEliminar] = useState(null);
  
  // Estados para formularios
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [descNueva, setDescNueva] = useState('');
  const [codigoInvitacion, setCodigoInvitacion] = useState('');
  const [rolFuncional, setRolFuncional] = useState('Frontend');
  const [error, setError] = useState('');


  const { usuarioActual, seleccionarProyecto } = useAuth();
  const navigate = useNavigate();

  const cargarProyectos = async () => {
    try {
      const data = await listarProyectos();
      setProyectos(data);
    } catch (err) {
      console.error("Error al cargar proyectos:", err);
    }
  };

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await listarProyectos();
        setProyectos(data);
      } catch (err) {
        console.error("Error al cargar proyectos:", err);
      }
    };
    fetchProyectos();
  }, []);

  const handleCrearProyecto = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await crearProyecto(nombreNuevo, descNueva);
      setMostrarModalCrear(false);
      setNombreNuevo('');
      setDescNueva('');
      cargarProyectos();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear proyecto');
    }
  };

  const handleUnirseProyecto = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await unirseProyecto(usuarioActual.idUsuario, codigoInvitacion, rolFuncional);
      setMostrarModalUnirse(false);
      setCodigoInvitacion('');
      cargarProyectos();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al unirse al proyecto');
    }
  };

  const handleEliminarProyecto = async () => {
    setError('');
    try {
      await eliminarProyecto(proyectoAEliminar.idProyecto);
      setProyectoAEliminar(null);
      cargarProyectos();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al eliminar el proyecto');
      alert(err.response?.data?.detail || 'No tienes permisos para eliminar este proyecto');
      setProyectoAEliminar(null);
    }
  };

  const irAlTablero = async (idProyecto) => {
    try {
      const miembros = await listarMiembros(idProyecto);

      // Encontrar el rol exacto del usuario actual
      const miMiembroInfo = miembros.find(m => m.idUsuario === usuarioActual.idUsuario);
      const miRol = miMiembroInfo ? miMiembroInfo.rolPermiso : "Miembro";

      seleccionarProyecto(idProyecto, miRol); 
      navigate(`/tablero/${idProyecto}`);
    } catch (error) {
      console.error("Error validando miembros:", error);
      alert("Hubo un error al validar el acceso al proyecto.");
    }
  };

  return (
    <div>
      <Navbar />
      <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Mis Espacios de Trabajo</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Selecciona un proyecto o crea uno nuevo para empezar.</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="btn-secondary" onClick={() => setMostrarModalUnirse(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} />
              Unirse con Código
            </button>
            <button className="btn-primary" onClick={() => setMostrarModalCrear(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} />
              Nuevo Proyecto
            </button>
          </div>
        </header>

        {/* Grilla de Proyectos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {proyectos.map(p => (
            <div key={p.idProyecto} className="glass-panel" style={{ padding: '25px', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'pointer' }}
                 onClick={() => irAlTablero(p.idProyecto)}
                 onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: 'var(--accent-primary)' }}>{p.nombre}</h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '4px 10px', 
                    backgroundColor: p.estado === 'En desarrollo' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.08)', 
                    color: p.estado === 'En desarrollo' ? '#10b981' : 'var(--text-secondary)',
                    border: p.estado === 'En desarrollo' ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--border-light)',
                    borderRadius: '20px',
                    fontWeight: '600'
                  }}>
                    {p.estado}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setProyectoAEliminar(p); }} 
                    style={{ 
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '5px 7px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.25)'; e.currentTarget.style.transform='scale(1.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.transform='scale(1)'; }}
                    title="Eliminar proyecto"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '25px', flexGrow: 1 }}>
                {p.descripcion || 'Sin descripción'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '15px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Código: <strong style={{ color: 'var(--text-primary)' }}>{p.codigoInvitacion}</strong></span>
                <span style={{ color: 'var(--accent-hover)', fontSize: '0.9rem', fontWeight: '500' }}>Ir al tablero →</span>
              </div>
            </div>
          ))}
          {proyectos.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', border: '1px dashed var(--border-light)', borderRadius: '16px', color: 'var(--text-secondary)' }}>
              No tienes proyectos aún. ¡Crea uno nuevo o únete a un equipo!
            </div>
          )}
        </div>

        {/* Modal de Confirmación para Eliminar */}
        {proyectoAEliminar && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
            <div className="glass-panel" style={{ width: '400px', padding: '30px' }}>
              <h2 style={{ marginBottom: '20px', color: 'var(--color-danger)' }}>Eliminar Proyecto</h2>
              <p style={{ marginBottom: '20px' }}>
                ¿Estás seguro de que deseas eliminar el proyecto <strong>{proyectoAEliminar.nombre}</strong>? 
                Esta acción es irreversible y eliminará todas las tareas y miembros asociados.
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setProyectoAEliminar(null)} style={{ flex: 1 }}>Cancelar</button>
                <button type="button" className="btn-primary" onClick={handleEliminarProyecto} style={{ flex: 1, backgroundColor: 'var(--color-danger)' }}>Sí, eliminar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modales Simples */}
        {mostrarModalCrear && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
            <div className="glass-panel" style={{ width: '400px', padding: '30px' }}>
              <h2 style={{ marginBottom: '20px' }}>Nuevo Proyecto</h2>
              {error && <p style={{ color: 'var(--color-danger)', marginBottom: '15px' }}>{error}</p>}
              <form onSubmit={handleCrearProyecto} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" className="input-base" placeholder="Nombre del Proyecto" value={nombreNuevo} onChange={e => setNombreNuevo(e.target.value)} required />
                <textarea className="input-base" placeholder="Descripción" value={descNueva} onChange={e => setDescNueva(e.target.value)} rows="3" />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setMostrarModalCrear(false)} style={{ flex: 1 }}>Cancelar</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Crear</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {mostrarModalUnirse && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
            <div className="glass-panel" style={{ width: '400px', padding: '30px' }}>
              <h2 style={{ marginBottom: '20px' }}>Unirse a un Proyecto</h2>
              {error && <p style={{ color: 'var(--color-danger)', marginBottom: '15px' }}>{error}</p>}
              <form onSubmit={handleUnirseProyecto} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" className="input-base" placeholder="Código de Invitación" value={codigoInvitacion} onChange={e => setCodigoInvitacion(e.target.value)} required />
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Selecciona tu rol en el equipo:
                  </label>
                  <select className="input-base" value={rolFuncional} onChange={e => setRolFuncional(e.target.value)} style={{ appearance: 'none', width: '100%' }}>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Fullstack">Fullstack</option>
                    <option value="Diseñador">Diseñador</option>
                    <option value="QA">QA</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setMostrarModalUnirse(false)} style={{ flex: 1 }}>Cancelar</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Unirse</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
