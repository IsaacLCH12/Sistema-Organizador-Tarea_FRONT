import { useState, useEffect } from 'react';
import { User, Settings, CheckCircle, Clock, List, Save, Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import { obtenerPerfil, actualizarPerfil, obtenerMisTareas } from '../services/authService';

const Perfil = () => {
  // Estado para la información del perfil del usuario
  const [perfil, setPerfil] = useState({
    nombre: '',
    correo: '',
    tareasCompletadas: 0,
    tareasEnProgreso: 0,
    tareasPendientes: 0,
    totalProyectos: 0,
  });

  // Estado para la lista de tareas del usuario
  const [misTareas, setMisTareas] = useState([]);
  
  // Estado de carga y errores
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estados para la edición del perfil
  const [estaEditando, setEstaEditando] = useState(false);
  const [editNombre, setEditNombre] = useState('');
  const [editCorreo, setEditCorreo] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  // Efecto para cargar los datos iniciales al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        // Cargar datos del perfil
        const datosPerfil = await obtenerPerfil();
        setPerfil(datosPerfil);
        setEditNombre(datosPerfil.nombre);
        setEditCorreo(datosPerfil.correo);

        // Cargar las tareas asignadas al usuario
        const datosTareas = await obtenerMisTareas();
        setMisTareas(datosTareas);
      } catch (err) {
        setError('Ocurrió un error al cargar la información.');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // Función para guardar los cambios del perfil
  const manejarGuardarPerfil = async () => {
    try {
      setError(null);
      const datosActualizados = { nombre: editNombre, correo: editCorreo };
      // Solo enviamos la contraseña si se escribió una nueva
      if (nuevaContrasena.trim() !== '') {
        datosActualizados.contrasena = nuevaContrasena;
      }

      await actualizarPerfil(datosActualizados);
      
      // Actualizamos el estado local con el nuevo nombre y correo
      setPerfil((prev) => ({ ...prev, nombre: editNombre, correo: editCorreo }));
      setEstaEditando(false);
      setNuevaContrasena(''); // Limpiamos el campo de la contraseña por seguridad
      setMostrarContrasena(false);
    } catch (err) {
      console.error('Error al actualizar el perfil:', err);
      setError(err.response?.data?.detail || 'Error al actualizar el perfil');
    }
  };

  // Función auxiliar para obtener el color del estado de la tarea
  const obtenerColorEstado = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'done':
        return { color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' };
      case 'in progress':
      case 'in review':
        return { color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' };
      default:
        return { color: '#64748b', background: 'rgba(100, 116, 139, 0.1)', border: '1px solid rgba(100, 116, 139, 0.2)' };
    }
  };

  if (cargando) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <User color="var(--accent-primary)" size={32} />
          Mi Perfil
        </h1>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', color: '#fca5a5', padding: '15px', borderRadius: '12px', marginBottom: '25px' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
          
          {/* Columna Izquierda */}
          <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', position: 'relative' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary) 0%, #3b82f6 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)' }}>
              <User size={50} color="white" />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{perfil.nombre}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>{perfil.correo}</p>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
              {!estaEditando ? (
                <button className="btn-secondary" onClick={() => {
                  setEditNombre(perfil.nombre);
                  setEditCorreo(perfil.correo);
                  setEstaEditando(true);
                }} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <Settings size={18} />
                  Editar Perfil
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nombre</label>
                    <input type="text" className="input-base" value={editNombre} onChange={(e) => setEditNombre(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Correo Electrónico</label>
                    <input type="email" className="input-base" value={editCorreo} onChange={(e) => setEditCorreo(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nueva Contraseña</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={mostrarContrasena ? "text" : "password"} 
                        placeholder="En blanco para no cambiar" 
                        className="input-base" 
                        value={nuevaContrasena} 
                        onChange={(e) => setNuevaContrasena(e.target.value)} 
                        style={{ paddingRight: '40px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarContrasena(!mostrarContrasena)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0'
                        }}
                      >
                        {mostrarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-secondary" onClick={() => setEstaEditando(false)} style={{ flex: 1, padding: '8px' }}>Cancelar</button>
                    <button className="btn-primary" onClick={manejarGuardarPerfil} style={{ flex: 1, padding: '8px', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                      <Save size={16} /> Guardar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Columna Derecha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                <CheckCircle color="#10b981" size={28} style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{perfil.tareasCompletadas}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Completadas</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                <Clock color="#3b82f6" size={28} style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{perfil.tareasEnProgreso}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>En Progreso</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                <List color="#f59e0b" size={28} style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{perfil.tareasPendientes}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Pendientes</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', border: '1px solid rgba(99, 102, 241, 0.3)', backgroundColor: 'rgba(99, 102, 241, 0.05)' }}>
                <Settings color="var(--accent-primary)" size={28} style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{perfil.totalProyectos}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Proyectos</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <List color="#3b82f6" />
                Mis Tareas Asignadas
              </h3>
              
              {misTareas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={48} style={{ margin: '0 auto 15px', opacity: 0.2 }} />
                  <p>No tienes tareas asignadas actualmente.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '500px', overflowY: 'auto', paddingRight: '5px' }}>
                  {Object.entries(
                    misTareas.reduce((acc, tarea) => {
                      if (!acc[tarea.idProyecto]) acc[tarea.idProyecto] = [];
                      acc[tarea.idProyecto].push(tarea);
                      return acc;
                    }, {})
                  ).map(([idProj, tareasDelProyecto]) => (
                    <div key={idProj} style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                      <h4 style={{ 
                        margin: '0 0 15px 0', 
                        color: 'var(--accent-primary)', 
                        fontSize: '0.9rem', 
                        borderBottom: '1px solid var(--border-light)', 
                        paddingBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        📌 Proyecto #{idProj}
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {tareasDelProyecto.map((tarea) => (
                          <div key={tarea.idTarea} style={{ backgroundColor: 'var(--bg-panel)', padding: '12px 15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <h5 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>{tarea.titulo}</h5>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID Tarea: {tarea.idTarea}</span>
                            </div>
                            <div style={{ 
                              padding: '4px 12px', 
                              borderRadius: '20px', 
                              fontSize: '0.75rem', 
                              fontWeight: '600',
                              ...obtenerColorEstado(tarea.estado)
                            }}>
                              {tarea.estado}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Perfil;
