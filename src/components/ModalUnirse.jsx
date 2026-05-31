import { useState } from 'react';

export default function ModalUnirse({ isOpen, onClose, onUnirse }) {
  // Estado para guardar lo que el usuario escribe
  const [codigo, setCodigo] = useState('');

  // Si isOpen es falso, no mostramos nada (el modal está oculto)
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página recargue
    onUnirse(codigo);
    setCodigo(''); // Limpiamos la cajita de texto
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', color: 'black' }}>
        <h3>Unirse a un Proyecto</h3>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Ej: AB123C" 
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <button type="submit" style={{ padding: '8px', cursor: 'pointer' }}>Unirme</button>
          <button type="button" onClick={onClose} style={{ padding: '8px', marginLeft: '5px', cursor: 'pointer' }}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}
