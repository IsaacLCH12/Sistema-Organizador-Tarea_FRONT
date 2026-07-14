import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, AlignLeft, MessageSquare, Activity, Trash2, Tag, AlertCircle, Edit2, Save } from 'lucide-react';
import { editarTarea, eliminarTarea, asignarTarea } from '../services/tareaService';
import { listarComentarios, crearComentario, eliminarComentario } from '../services/comentarioService';
import { listarActividades } from '../services/actividadService';

export default function DetalleTarea({ tarea, onClose, onUpdate, miembrosProyecto, esLider, usuarioActual }) {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [cargandoExtras, setCargandoExtras] = useState(true);

  // Formulario de edición
  const [titulo, setTitulo] = useState(tarea.titulo);
  const [descripcion, setDescripcion] = useState(tarea.descripcion || '');
  const [prioridad, setPrioridad] = useState(tarea.prioridad);
  const [tipoIssue, setTipoIssue] = useState(tarea.tipoIssue);
  const [fechaLimite, setFechaLimite] = useState(tarea.fechaLimite ? tarea.fechaLimite.split('T')[0] : '');
  const [puntosHistoria, setPuntosHistoria] = useState(tarea.puntosHistoria || '');
  const [asignadoId, setAsignadoId] = useState(tarea.idMiembroEquipo || 0);

  const cargarExtras = async () => {
    try {
      const [comentariosRes, actividadesRes] = await Promise.all([
        listarComentarios(tarea.idTarea),
        listarActividades(tarea.idTarea)
      ]);
      setComentarios(comentariosRes);
      setActividades(actividadesRes);
    } catch (error) {
      console.error("Error al cargar extras:", error);
    } finally {
      setCargandoExtras(false);
    }
  };

  useEffect(() => {
    cargarExtras();
  }, [tarea.idTarea]);

  const guardarCambios = async () => {
    try {
      const puntos = puntosHistoria ? parseInt(puntosHistoria) : null;
      await editarTarea(tarea.idTarea, {
        titulo,
        descripcion,
        prioridad,
        tipoIssue,
        fechaLimite: fechaLimite || null,
        puntosHistoria: puntos
      });
      
      if (Number(asignadoId) !== (tarea.idMiembroEquipo || 0)) {
        await asignarTarea(tarea.idTarea, Number(asignadoId));
      }

      setModoEdicion(false);
      onUpdate();
    } catch (error) {
      alert("Error al guardar cambios: " + (error.response?.data?.detail || error.message));
    }
  };

  const handleEliminarTarea = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.')) {
      try {
        await eliminarTarea(tarea.idTarea);
        onClose();
        onUpdate();
      } catch (error) {
        alert("Error al eliminar tarea");
      }
    }
  };

  const handleCrearComentario = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;
    try {
      await crearComentario(tarea.idTarea, nuevoComentario);
      setNuevoComentario('');
      cargarExtras(); // Recargar comentarios y actividades
    } catch (error) {
      alert("Error al crear comentario");
    }
  };

  const handleEliminarComentario = async (idComentario) => {
    if (window.confirm('¿Eliminar comentario?')) {
      try {
        await eliminarComentario(idComentario);
        cargarExtras();
      } catch (error) {
        alert("Error al eliminar comentario");
      }
    }
  };

  const asignado = tarea.idMiembroEquipo ? miembrosProyecto.find(m => m.idMiembroEquipo === tarea.idMiembroEquipo) : null;

  const traducirTipo = (t) => {
    const dict = { 'Task': 'Tarea', 'Bug': 'Error', 'Story': 'Historia' };
    return dict[t] || t;
  };

  const traducirPrioridad = (p) => {
    const dict = { 'Critical': 'Crítica', 'High': 'Alta', 'Medium': 'Media', 'Low': 'Baja' };
    return dict[p] || p;
  };

  const traducirEstado = (e) => {
    const dict = { 'To Do': 'Por Hacer', 'In Progress': 'En Progreso', 'In Review': 'En Revisión', 'Done': 'Listo' };
    return dict[e] || e;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'var(--bg-dark)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{traducirTipo(tarea.tipoIssue)}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{tarea.idTarea}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {esLider && (
              <button className="btn-danger" onClick={handleEliminarTarea} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Trash2 size={14} /> Eliminar
              </button>
            )}
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          
          {/* Main Content (Left) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* Title & Description */}
            <div>
              {modoEdicion ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input className="input-base" style={{ fontSize: '1.25rem', fontWeight: 'bold' }} value={titulo} onChange={e => setTitulo(e.target.value)} />
                  <textarea className="input-base" rows="4" value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción..." />
                </div>
              ) : (
                <>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{tarea.titulo}</h2>
                  <div>
                    <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <AlignLeft size={16} /> Descripción
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                      {tarea.descripcion || 'Sin descripción'}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Comments Section */}
            <div>
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <MessageSquare size={16} /> Comentarios
              </h3>
              
              <form onSubmit={handleCrearComentario} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input 
                  type="text" 
                  className="input-base" 
                  placeholder="Añadir un comentario..." 
                  value={nuevoComentario} 
                  onChange={e => setNuevoComentario(e.target.value)} 
                />
                <button type="submit" className="btn-primary" disabled={!nuevoComentario.trim()}>Comentar</button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {cargandoExtras ? (
                  <p style={{ color: 'var(--text-secondary)' }}>Cargando comentarios...</p>
                ) : comentarios.length > 0 ? (
                  comentarios.map(c => (
                    <div key={c.idComentario} style={{ backgroundColor: 'var(--bg-panel)', padding: '12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{c.nombreUsuario}</span>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                            {new Date(c.fechaCreacion).toLocaleString()}
                          </span>
                          {(esLider || c.idUsuario === usuarioActual.idUsuario) && (
                            <Trash2 size={12} style={{ color: 'var(--color-danger)', cursor: 'pointer' }} onClick={() => handleEliminarComentario(c.idComentario)} />
                          )}
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>{c.contenido}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No hay comentarios aún.</p>
                )}
              </div>
            </div>

            {/* Activity History */}
            <div>
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <Activity size={16} /> Historial
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                {actividades.map(a => (
                  <div key={a.idActividad} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '10px' }}>
                    <span style={{ minWidth: '120px' }}>{new Date(a.fechaCreacion).toLocaleString()}</span>
                    <span><strong>{a.nombreUsuario}</strong> {a.accion} {a.detalle}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar (Right) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
              {!modoEdicion ? (
                esLider && (
                  <button className="btn-secondary" onClick={() => setModoEdicion(true)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', fontSize: '0.85rem' }}>
                    <Edit2 size={14} /> Editar Detalles
                  </button>
                )
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-secondary" onClick={() => setModoEdicion(false)} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Cancelar</button>
                  <button className="btn-primary" onClick={guardarCambios} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', fontSize: '0.85rem' }}>
                    <Save size={14} /> Guardar
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: 'var(--bg-panel)', padding: '20px', borderRadius: '12px' }}>
              
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>ESTADO</label>
                <span className="badge" style={{ backgroundColor: 'var(--bg-primary)' }}>{traducirEstado(tarea.estado)}</span>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>ASIGNADO A</label>
                {modoEdicion ? (
                  <select className="input-base" value={asignadoId} onChange={e => setAsignadoId(e.target.value)}>
                    <option value="0">Sin asignar</option>
                    {miembrosProyecto.map(m => (
                      <option key={m.idMiembroEquipo} value={m.idMiembroEquipo}>{m.nombreUsuario}</option>
                    ))}
                  </select>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} />
                    <span style={{ fontSize: '0.9rem' }}>{asignado ? asignado.nombreUsuario : 'Sin asignar'}</span>
                  </div>
                )}
              </div>

              {modoEdicion ? (
                <>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>TIPO</label>
                    <select className="input-base" value={tipoIssue} onChange={e => setTipoIssue(e.target.value)}>
                      <option value="Task">Tarea</option>
                      <option value="Bug">Error</option>
                      <option value="Story">Historia</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>PRIORIDAD</label>
                    <select className="input-base" value={prioridad} onChange={e => setPrioridad(e.target.value)}>
                      <option value="Critical">Crítica</option>
                      <option value="High">Alta</option>
                      <option value="Medium">Media</option>
                      <option value="Low">Baja</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>FECHA LÍMITE</label>
                    <input type="date" className="input-base" value={fechaLimite} onChange={e => setFechaLimite(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>PUNTOS DE HISTORIA</label>
                    <input type="number" className="input-base" value={puntosHistoria} onChange={e => setPuntosHistoria(e.target.value)} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>PRIORIDAD</label>
                    <span className={`badge priority-${tarea.prioridad}`}>
                      {tarea.prioridad === 'Critical' && <AlertCircle size={10} />} {traducirPrioridad(tarea.prioridad)}
                    </span>
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>ETIQUETA</label>
                    <span style={{ fontSize: '0.85rem' }}>{tarea.etiquetaRecomendada}</span>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>FECHA LÍMITE</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={14} />
                      <span style={{ fontSize: '0.85rem' }}>
                        {tarea.fechaLimite ? new Date(tarea.fechaLimite).toLocaleDateString() : 'Ninguna'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>PUNTOS DE HISTORIA</label>
                    <span style={{ fontSize: '0.85rem' }}>{tarea.puntosHistoria || 'Sin estimar'}</span>
                  </div>
                </>
              )}

              <div style={{ marginTop: '10px', paddingTop: '15px', borderTop: '1px solid var(--border-light)' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>REPORTERO</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <User size={14} />
                  <span style={{ fontSize: '0.85rem' }}>
                    {tarea.idReportero 
                      ? (miembrosProyecto.find(m => m.idUsuario === tarea.idReportero)?.nombreUsuario || `Usuario #${tarea.idReportero}`) 
                      : 'Sistema'}
                  </span>
                </div>

                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>CREADO EL</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} />
                  <span style={{ fontSize: '0.85rem' }}>
                    {tarea.fechaCreacion ? new Date(tarea.fechaCreacion).toLocaleString() : ''}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
