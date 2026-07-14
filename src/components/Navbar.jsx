

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, X, CheckSquare, Users, Shield } from 'lucide-react';
import ModalConfirmacion from './ModalConfirmacion';

export default function Navbar() {
  const { usuarioActual, logout } = useAuth();
  const navigate = useNavigate();
  const [mostrarModalLogout, setMostrarModalLogout] = useState(false);
  const [mostrarModalGuia, setMostrarModalGuia] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '15px 30px', 
        backgroundColor: 'var(--bg-secondary)', 
        borderBottom: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h2 style={{ margin: 0, color: 'var(--accent-primary)', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          StudyFlow
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {usuarioActual ? (
            <>
              <button 
                onClick={() => setMostrarModalGuia(true)}
                style={{ 
                  background: 'rgba(139, 92, 246, 0.1)', 
                  border: '1px solid rgba(139, 92, 246, 0.3)', 
                  color: 'var(--accent-primary)', 
                  padding: '6px 12px', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <BookOpen size={16} /> Guía
              </button>
              
              <div 
                onClick={() => navigate('/perfil')}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '5px 10px', borderRadius: '8px', transition: 'background-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ 
                  width: '35px', height: '35px', borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, #3b82f6 100%)', 
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  fontWeight: 'bold', color: 'white'
                }}>
                  {usuarioActual.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-primary)' }}>{usuarioActual.nombre}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ver Perfil</div>
                </div>
              </div>
              <button 
                onClick={() => setMostrarModalLogout(true)}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <span>Inicia sesión</span>
          )}
        </div>
      </nav>

      {mostrarModalLogout && (
        <ModalConfirmacion 
          mensaje="¿Estás seguro que deseas cerrar tu sesión actual?" 
          onConfirm={handleLogout} 
          onCancel={() => setMostrarModalLogout(false)} 
        />
      )}

      {mostrarModalGuia && (
        <div className="modal-overlay" onClick={() => setMostrarModalGuia(false)}>
          <div className="glass-panel modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px', backgroundColor: 'var(--bg-dark)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-primary)', margin: 0 }}>
                <BookOpen size={24} /> Guía de Usuario: StudyFlow
              </h2>
              <button onClick={() => setMostrarModalGuia(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
              <div style={{ backgroundColor: 'var(--bg-panel)', padding: '15px', borderRadius: '12px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '1.1rem' }}>
                  <CheckSquare size={18} color="#3b82f6" /> 1. Gestión de Tareas (Kanban)
                </h3>
                <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '20px' }}>
                  <li><strong>Arrastrar y Soltar:</strong> Mueve las tareas entre las columnas (To Do, In Progress, In Review, Done) arrastrándolas con el mouse.</li>
                  <li><strong>Crear Tarea:</strong> Haz clic en "Nueva Tarea" (Solo líderes). Define su prioridad, puntos de historia (esfuerzo) y etiqueta.</li>
                  <li><strong>Editar Tarea:</strong> Al hacer clic en una tarea, los líderes verán el botón "Editar Detalles" para cambiar fechas, prioridad o el responsable asignado.</li>
                </ul>
              </div>

              <div style={{ backgroundColor: 'var(--bg-panel)', padding: '15px', borderRadius: '12px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '1.1rem' }}>
                  <Users size={18} color="#10b981" /> 2. Equipos y Proyectos
                </h3>
                <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '20px' }}>
                  <li><strong>Unirse a un Proyecto:</strong> Ve al Dashboard de Proyectos y pega el Código de Invitación (ej. 8B3F2A) y elige tu Rol (Frontend, Backend, etc).</li>
                  <li><strong>Límites de Trabajo:</strong> El sistema cuida a tu equipo. Ningún miembro puede tener más de 2 tareas activas ("In Progress" o "In Review") al mismo tiempo.</li>
                </ul>
              </div>

              <div style={{ backgroundColor: 'var(--bg-panel)', padding: '15px', borderRadius: '12px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '1.1rem' }}>
                  <Shield size={18} color="#8b5cf6" /> 3. Roles y Permisos
                </h3>
                <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '20px' }}>
                  <li><strong>Líder / Creador:</strong> El creador del proyecto. Puede crear, editar, eliminar tareas y reasignarlas libremente.</li>
                  <li><strong>Colaboradores:</strong> Solo pueden unirse al proyecto, tomar tareas libres y moverlas por el tablero. Si una tarea fue asignada por error, el Líder debe liberarla.</li>
                </ul>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button className="btn-primary" onClick={() => setMostrarModalGuia(false)}>
                ¡Entendido!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}