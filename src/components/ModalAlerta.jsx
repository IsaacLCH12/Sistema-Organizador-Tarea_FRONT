import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ModalAlerta({ mensaje, onClose }) {
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
        <button onClick={onClose} style={{ 
          position: 'absolute', top: '10px', right: '10px', 
          background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' 
        }}>
          <X size={20} />
        </button>
        
        <AlertCircle size={48} color="var(--color-danger)" style={{ marginBottom: '15px' }} />
        <h3 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>Aviso</h3>
        <div style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.95rem' }}>
          {typeof mensaje === 'string' ? (
            <p>{mensaje}</p>
          ) : Array.isArray(mensaje) ? (
            mensaje.map((err, idx) => (
              <p key={idx} style={{ marginBottom: '5px' }}>• {err.msg || JSON.stringify(err)}</p>
            ))
          ) : (
            <p>{JSON.stringify(mensaje)}</p>
          )}
        </div>
        
        <button className="btn-primary" onClick={onClose} style={{ width: '100%' }}>
          Entendido
        </button>
      </div>
    </div>
  );
}
