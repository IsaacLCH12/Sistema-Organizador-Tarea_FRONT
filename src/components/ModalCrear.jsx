import { useState } from 'react';

export default function ModalCrear({ isOpen, onClose, onCrear }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCrear({ nombre, descripcion });
    setNombre('');
    setDescripcion('');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(9, 30, 66, 0.54)', display: 'flex', 
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#172B4D' }}>Crear Nuevo Proyecto</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#5E6C84' }}>✖</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#42526E', fontWeight: '600', fontSize: '0.9rem' }}>Nombre del Proyecto *</label>
            <input 
              type="text" 
              placeholder="Ej: Sistema Kanban Grupo 1" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '2px solid #DFE1E6', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#42526E', fontWeight: '600', fontSize: '0.9rem' }}>Descripción (Opcional)</label>
            <textarea 
              placeholder="¿De qué trata este proyecto?" 
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows="3"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '2px solid #DFE1E6', outline: 'none', resize: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 15px', background: 'transparent', border: 'none', color: '#42526E', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
            <button type="submit" style={{ padding: '10px 20px', background: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Crear Proyecto</button>
          </div>
        </form>
      </div>
    </div>
  );
}