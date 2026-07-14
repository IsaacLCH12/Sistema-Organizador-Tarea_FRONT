

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ModalConfirmacion from './ModalConfirmacion';

export default function Navbar() {
  const { usuarioActual, logout } = useAuth();
  const navigate = useNavigate();
  const [mostrarModalLogout, setMostrarModalLogout] = useState(false);

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
    </>
  );
}