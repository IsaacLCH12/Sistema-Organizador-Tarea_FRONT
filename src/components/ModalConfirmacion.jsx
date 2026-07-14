import React from 'react';
import { HelpCircle, X } from 'lucide-react';

export default function ModalConfirmacion({ mensaje, onConfirm, onCancel }) {
  if (!mensaje) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '25px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative'
      }}>
        <button onClick={onCancel} style={{ 
          position: 'absolute', top: '10px', right: '10px', 
          background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' 
        }}>
          <X size={20} />
        </button>
        
        <HelpCircle size={48} color="var(--accent-primary)" style={{ marginBottom: '15px' }} />
        <h3 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>Confirmación</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', fontSize: '0.95rem' }}>{mensaje}</p>
        
        <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
          <button className="btn-secondary" onClick={onCancel} style={{ flex: 1 }}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={onConfirm} style={{ flex: 1 }}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
