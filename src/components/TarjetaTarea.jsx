import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { asignarTarea } from '../services/tareaService';
import { Bug, CheckSquare, Bookmark, Calendar, AlertCircle } from 'lucide-react';

export default function TarjetaTarea({ tarea, recargarTareas, miembrosProyecto, esLider, onClick }) {
  const { rolActual, usuarioActual } = useAuth();
  const [errorCarga, setErrorCarga] = useState('');

  const manejarAsignacion = async (e) => {
    e.stopPropagation(); // Evitar abrir modal
    setErrorCarga('');
    const miMiembroInfo = miembrosProyecto.find(m => m.idUsuario === usuarioActual.idUsuario);
    
    if (!miMiembroInfo) {
      setErrorCarga('No eres miembro válido del proyecto.');
      return;
    }

    try {
      await asignarTarea(tarea.idTarea, miMiembroInfo.idMiembroEquipo);
      recargarTareas();
    } catch (error) {
      setErrorCarga(error.response?.data?.detail || 'Error al asignar tarea');
    }
  };

  const getEtiquetaColor = (etiqueta) => {
    const colores = {
      'Frontend': '#3b82f6',
      'Backend': '#10b981',
      'Arquitectura': '#8b5cf6',
      'Diseño': '#ec4899',
      'QA': '#f59e0b'
    };
    return colores[etiqueta] || '#64748b';
  };

  const renderIconoTipo = (tipo) => {
    switch(tipo) {
      case 'Bug': return <Bug size={14} color="#ef4444" title="Error (Bug)" />;
      case 'Story': return <Bookmark size={14} color="#3b82f6" title="Historia de Usuario" />;
      default: return <CheckSquare size={14} color="#10b981" title="Tarea General" />;
    }
  };

  const traducirTipo = (t) => {
    const dict = { 'Task': 'Tarea', 'Bug': 'Error', 'Story': 'Historia' };
    return dict[t] || t;
  };

  const traducirPrioridad = (p) => {
    const dict = { 'Critical': 'Crítica', 'High': 'Alta', 'Medium': 'Media', 'Low': 'Baja' };
    return dict[p] || p;
  };

  const esVencida = tarea.fechaLimite && new Date(tarea.fechaLimite) < new Date(new Date().setHours(0,0,0,0)) && tarea.estado !== 'Done';
  const esTerminada = tarea.estado === 'Done';

  return (
    <>
      <div className="glass-panel" 
           onClick={onClick}
           style={{ 
        padding: '15px', 
        marginBottom: '15px',
        cursor: 'pointer',
        position: 'relative',
        backgroundColor: 'var(--bg-card)',
        borderLeft: `4px solid ${getEtiquetaColor(tarea.etiquetaRecomendada)}`,
        opacity: esTerminada ? 0.6 : 1,
        transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.2s'
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--glass-shadow)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {errorCarga && (
          <div style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginBottom: '8px', border: '1px solid var(--color-danger)', padding: '4px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
            {errorCarga}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {renderIconoTipo(tarea.tipoIssue)}
            <span style={{ 
              fontSize: '0.7rem', 
              padding: '2px 6px', 
              backgroundColor: `${getEtiquetaColor(tarea.etiquetaRecomendada)}22`, 
              color: getEtiquetaColor(tarea.etiquetaRecomendada),
              borderRadius: '4px',
              fontWeight: '600'
            }}>
              {tarea.etiquetaRecomendada}
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '4px' }}>
            <span className={`badge priority-${tarea.prioridad}`}>
              {tarea.prioridad === 'Critical' && <AlertCircle size={10} />}
              {traducirPrioridad(tarea.prioridad)}
            </span>
            {tarea.puntosHistoria && (
              <span className="badge" style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }} title="Puntos de Historia">
                {tarea.puntosHistoria}
              </span>
            )}
          </div>
        </div>

        <h4 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '0.95rem', 
          color: esTerminada ? 'var(--text-secondary)' : 'var(--text-primary)', 
          textDecoration: esTerminada ? 'line-through' : 'none',
          lineHeight: '1.4' 
        }}>
          {tarea.titulo}
        </h4>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: esVencida ? 'var(--color-danger)' : 'var(--text-secondary)' }}>
            {tarea.fechaLimite ? (
              <>
                <Calendar size={12} />
                <span style={{ fontWeight: esVencida ? 'bold' : 'normal' }}>
                  {new Date(tarea.fechaLimite).toLocaleDateString()} {esVencida && '(Vencida)'}
                </span>
              </>
            ) : <span />}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {tarea.idMiembroEquipo ? (
              <div title="Asignado" style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--bg-dark)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.7rem', border: '1px solid var(--accent-primary)', color: 'white' }}>
                👤
              </div>
            ) : (
              tarea.estado === 'To Do' && rolActual !== 'Líder / Creador' && (
                <button 
                  onClick={manejarAsignacion}
                  style={{ 
                    padding: '4px 8px', fontSize: '0.75rem', 
                    backgroundColor: 'transparent', border: '1px solid var(--accent-primary)', 
                    color: 'var(--accent-primary)', borderRadius: '4px', cursor: 'pointer'
                  }}
                >
                  Tomar
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}