import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ColumnaKanban from '../components/ColumnaKanban';
import { useAuth } from '../context/AuthContext';
import { listarTareas, crearTarea, cambiarEstadoTarea } from '../services/tareaService';
import { listarMiembros } from '../services/proyectoService';
import { Plus, Filter, Search, Info, Users, PieChart } from 'lucide-react';
import ModalAlerta from '../components/ModalAlerta';
import DetalleTarea from '../components/DetalleTarea';

export default function TableroPrincipal() {
  const { idProyecto } = useParams();
  const navigate = useNavigate();
  const { rolActual, usuarioActual } = useAuth();
  
  const [tareas, setTareas] = useState([]);
  const [miembros, setMiembros] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Filtros
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroAsignado, setFiltroAsignado] = useState('Todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  // Estado para modales
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarEquipo, setMostrarEquipo] = useState(false);
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);
  
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [etiqueta, setEtiqueta] = useState('Backend');
  const [prioridad, setPrioridad] = useState('Medium');
  const [tipoIssue, setTipoIssue] = useState('Task');
  const [fechaLimite, setFechaLimite] = useState('');
  const [puntosHistoria, setPuntosHistoria] = useState('');
  const [errorModal, setErrorModal] = useState('');

  const miMiembroInfo = miembros.find(m => m.idUsuario === usuarioActual.idUsuario);
  const esLider = rolActual === 'Líder / Creador' || rolActual === 'Líder' || (miMiembroInfo && miMiembroInfo.rolFuncional === 'Líder / Creador');

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [dataTareas, dataMiembros] = await Promise.all([
        listarTareas(idProyecto),
        listarMiembros(idProyecto)
      ]);
      setTareas(dataTareas);
      setMiembros(dataMiembros);
    } catch (error) {
      console.error("Error cargando tablero:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (idProyecto) {
      cargarDatos();
    } else {
      navigate('/dashboard');
    }
  }, [idProyecto]);

  const handleCrearTarea = async (e) => {
    e.preventDefault();
    setErrorModal('');
    
    if (titulo.trim().length < 3) {
      setErrorModal('El título de la tarea debe tener al menos 3 caracteres.');
      return;
    }

    try {
      const puntos = puntosHistoria ? parseInt(puntosHistoria) : null;
      await crearTarea(parseInt(idProyecto), titulo, descripcion, etiqueta, prioridad, tipoIssue, fechaLimite || null, puntos);
      setMostrarModal(false);
      // Reset form
      setTitulo(''); setDescripcion(''); setEtiqueta('Backend'); setPrioridad('Medium'); setTipoIssue('Task'); setFechaLimite(''); setPuntosHistoria('');
      cargarDatos();
    } catch (err) {
      setErrorModal(err.response?.data?.detail || 'Error al crear tarea: Verifica que los datos sean correctos.');
    }
  };

  const moverTarea = async (idTarea, nuevoEstado) => {
    const tareasAnteriores = [...tareas];
    setTareas(tareas.map(t => t.idTarea === idTarea ? { ...t, estado: nuevoEstado } : t));
    
    try {
      await cambiarEstadoTarea(idTarea, nuevoEstado);
      cargarDatos();
    } catch (error) {
      setTareas(tareasAnteriores);
      setErrorModal(error.response?.data?.detail || 'Error al mover la tarea. Verifica límites.');
    }
  };

  // Lógica de filtrado
  const tareasFiltradas = tareas.filter(t => {
    const matchTexto = t.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) || 
                       (t.descripcion && t.descripcion.toLowerCase().includes(filtroTexto.toLowerCase()));
    
    let matchAsignado = true;
    if (filtroAsignado === 'Sin asignar') matchAsignado = t.idMiembroEquipo === null;
    else if (filtroAsignado !== 'Todos') matchAsignado = t.idMiembroEquipo === parseInt(filtroAsignado);

    const matchPrioridad = filtroPrioridad === 'Todos' || t.prioridad === filtroPrioridad;
    const matchTipo = filtroTipo === 'Todos' || t.tipoIssue === filtroTipo;

    return matchTexto && matchAsignado && matchPrioridad && matchTipo;
  });

  const tareasToDo = tareasFiltradas.filter(t => t.estado === 'To Do');
  const tareasInProgress = tareasFiltradas.filter(t => t.estado === 'In Progress');
  const tareasInReview = tareasFiltradas.filter(t => t.estado === 'In Review');
  const tareasDone = tareasFiltradas.filter(t => t.estado === 'Done');

  // Estadísticas
  const totalTareas = tareas.length;
  const porcCompletadas = totalTareas ? Math.round((tareasDone.length / totalTareas) * 100) : 0;
  const porcProgreso = totalTareas ? Math.round((tareasInProgress.length / totalTareas) * 100) : 0;
  const porcRevision = totalTareas ? Math.round((tareasInReview.length / totalTareas) * 100) : 0;
  const porcHacer = totalTareas ? Math.round((tareasToDo.length / totalTareas) * 100) : 0;

  return (
    <div style={{ backgroundColor: 'var(--bg-dark)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <ModalAlerta mensaje={errorModal} onClose={() => setErrorModal('')} />
      
      <main style={{ padding: '20px 40px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Tablero Kanban</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px' }}>
              Proyecto #{idProyecto} • {miembros.length} Integrantes
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={() => setMostrarEstadisticas(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChart size={16} /> Progreso
            </button>
            <button className="btn-secondary" onClick={() => setMostrarEquipo(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} /> Equipo
            </button>
            
            {esLider && (
              <button 
                className={`btn-primary ${miembros.length < 2 ? 'opacity-50' : ''}`}
                onClick={() => {
                  if (miembros.length < 2) {
                    setErrorModal("Aún no puedes crear tareas. El proyecto debe tener al menos 2 integrantes.");
                  } else {
                    setMostrarModal(true);
                  }
                }} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} />
                Nueva Tarea
              </button>
            )}
          </div>
        </header>

        {/* Barra de Filtros */}
        <div className="filtros-container" style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap', alignItems: 'center', backgroundColor: 'var(--bg-panel)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <div style={{ position: 'relative', flexGrow: 1, minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="input-base" 
              placeholder="Buscar tareas..." 
              value={filtroTexto} 
              onChange={e => setFiltroTexto(e.target.value)}
              style={{ paddingLeft: '35px' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Filter size={16} color="var(--text-secondary)" />
            
            <select className="input-base" style={{ width: 'auto', flexGrow: 1 }} value={filtroAsignado} onChange={e => setFiltroAsignado(e.target.value)}>
              <option value="Todos">Cualquier asignado</option>
              <option value="Sin asignar">Sin asignar</option>
              {miembros.map(m => (
                <option key={m.idMiembroEquipo} value={m.idMiembroEquipo}>{m.nombreUsuario}</option>
              ))}
            </select>

            <select className="input-base" style={{ width: 'auto', flexGrow: 1 }} value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)}>
              <option value="Todos">Todas las prioridades</option>
              <option value="Critical">Crítica</option>
              <option value="High">Alta</option>
              <option value="Medium">Media</option>
              <option value="Low">Baja</option>
            </select>

            <select className="input-base" style={{ width: 'auto', flexGrow: 1 }} value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
              <option value="Todos">Todos los tipos</option>
              <option value="Task">Tarea</option>
              <option value="Bug">Error</option>
              <option value="Story">Historia</option>
            </select>
          </div>
        </div>

        {cargando ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '50px' }}>Cargando tablero...</div>
        ) : (
          <div className="kanban-grid">
            <ColumnaKanban titulo="Por Hacer" estadoValue="To Do" tareas={tareasToDo} recargarTareas={cargarDatos} miembrosProyecto={miembros} onMoverTarea={moverTarea} esLider={esLider} onTareaClick={setTareaSeleccionada} />
            <ColumnaKanban titulo="En Progreso" estadoValue="In Progress" tareas={tareasInProgress} recargarTareas={cargarDatos} miembrosProyecto={miembros} onMoverTarea={moverTarea} esLider={esLider} onTareaClick={setTareaSeleccionada} />
            <ColumnaKanban titulo="En Revisión" estadoValue="In Review" tareas={tareasInReview} recargarTareas={cargarDatos} miembrosProyecto={miembros} onMoverTarea={moverTarea} esLider={esLider} onTareaClick={setTareaSeleccionada} />
            <ColumnaKanban titulo="Listo" estadoValue="Done" tareas={tareasDone} recargarTareas={cargarDatos} miembrosProyecto={miembros} onMoverTarea={moverTarea} esLider={esLider} onTareaClick={setTareaSeleccionada} />
          </div>
        )}

        {/* Modal Nueva Tarea (Estilo Jira) */}
        {mostrarModal && (
          <div className="modal-overlay">
            <div className="glass-panel modal-content modal-responsive" style={{ backgroundColor: 'var(--bg-dark)' }}>
              <h2 style={{ marginBottom: '20px' }}>Crear Nuevo Issue</h2>
              
              <form onSubmit={handleCrearTarea} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tipo de Issue</label>
                    <select className="input-base" value={tipoIssue} onChange={e => setTipoIssue(e.target.value)}>
                      <option value="Task">Tarea</option>
                      <option value="Bug">Error</option>
                      <option value="Story">Historia</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Prioridad</label>
                    <select className="input-base" value={prioridad} onChange={e => setPrioridad(e.target.value)}>
                      <option value="Critical">Crítica</option>
                      <option value="High">Alta</option>
                      <option value="Medium">Media</option>
                      <option value="Low">Baja</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Título *</label>
                  <input type="text" className="input-base" placeholder="Resumen del issue" value={titulo} onChange={e => setTitulo(e.target.value)} required />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Descripción</label>
                  <textarea className="input-base" placeholder="Describe los detalles de la tarea" value={descripcion} onChange={e => setDescripcion(e.target.value)} rows="4" />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Etiqueta</label>
                    <select className="input-base" value={etiqueta} onChange={e => setEtiqueta(e.target.value)}>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Arquitectura">Arquitectura</option>
                      <option value="Diseño">Diseño</option>
                      <option value="QA">QA</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fecha Límite</label>
                    <input type="date" className="input-base" value={fechaLimite} onChange={e => setFechaLimite(e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      Puntos
                      <div title="Los 'Puntos de Historia' (1, 2, 3, 5, 8, 13...) estiman la complejidad o esfuerzo de una tarea en la metodología Ágil." style={{ cursor: 'help', display: 'flex' }}>
                        <Info size={14} color="var(--accent-primary)" />
                      </div>
                    </label>
                    <select className="input-base" value={puntosHistoria} onChange={e => setPuntosHistoria(e.target.value)}>
                      <option value="">Sin estimar</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="5">5</option>
                      <option value="8">8</option>
                      <option value="13">13</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn-secondary" onClick={() => setMostrarModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-primary">Crear Tarea</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Estadisticas */}
        {mostrarEstadisticas && (
          <div className="modal-overlay" onClick={() => setMostrarEstadisticas(false)}>
            <div className="glass-panel modal-content modal-responsive" onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--bg-dark)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Progreso del Proyecto</h2>
                <button onClick={() => setMostrarEstadisticas(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem' }}>Terminadas ({tareasDone.length})</span>
                    <span style={{ fontWeight: 'bold', color: '#10b981' }}>{porcCompletadas}%</span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: 'var(--bg-panel)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${porcCompletadas}%`, backgroundColor: '#10b981', height: '100%', transition: 'width 0.5s' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem' }}>En Progreso / Revisión ({tareasInProgress.length + tareasInReview.length})</span>
                    <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>{porcProgreso + porcRevision}%</span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: 'var(--bg-panel)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${porcProgreso + porcRevision}%`, backgroundColor: '#3b82f6', height: '100%', transition: 'width 0.5s' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem' }}>Por Hacer ({tareasToDo.length})</span>
                    <span style={{ fontWeight: 'bold', color: '#64748b' }}>{porcHacer}%</span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: 'var(--bg-panel)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${porcHacer}%`, backgroundColor: '#64748b', height: '100%', transition: 'width 0.5s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Equipo */}
        {mostrarEquipo && (
          <div className="modal-overlay" onClick={() => setMostrarEquipo(false)}>
            <div className="glass-panel modal-content modal-responsive" onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--bg-dark)', maxWidth: '800px', width: '90%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Integrantes del Equipo</h2>
                <button onClick={() => setMostrarEquipo(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <th style={{ padding: '12px', fontWeight: '500' }}>Nombre</th>
                      <th style={{ padding: '12px', fontWeight: '500' }}>Estado</th>
                      <th style={{ padding: '12px', fontWeight: '500' }}>Permisos</th>
                      <th style={{ padding: '12px', fontWeight: '500' }}>Rol Funcional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {miembros.map(m => (
                      <tr key={m.idMiembroEquipo} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--accent-primary)', color: 'var(--text-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                              {m.nombreUsuario ? m.nombreUsuario.substring(0, 2).toUpperCase() : '?'}
                            </div>
                            <div>
                              <div style={{ fontWeight: '500', fontSize: '0.95rem' }}>{m.nombreUsuario}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {m.idUsuario}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>ACTIVO</span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                          {m.rolPermiso === 'Líder / Creador' || m.rolPermiso === 'Líder' ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }}></div>
                              Full Permission
                            </span>
                          ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#64748b' }}></div>
                              Colaborador
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{m.rolFuncional}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tareaSeleccionada && (
          <DetalleTarea 
            tarea={tareaSeleccionada} 
            onClose={() => setTareaSeleccionada(null)} 
            onUpdate={() => { setTareaSeleccionada(null); cargarDatos(); }}
            miembrosProyecto={miembros}
            esLider={esLider}
            usuarioActual={usuarioActual}
          />
        )}

      </main>
    </div>
  );
}