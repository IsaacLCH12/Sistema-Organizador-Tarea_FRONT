import TarjetaTarea from './TarjetaTarea';

export default function ColumnaKanban({ titulo, estadoValue, tareas, recargarTareas, miembrosProyecto, onMoverTarea, esLider, onTareaClick }) {
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = 'transparent';
    const idTareaStr = e.dataTransfer.getData('idTarea');
    if (idTareaStr && onMoverTarea) {
      onMoverTarea(parseInt(idTareaStr, 10), estadoValue || titulo);
    }
  };

  const handleDragStart = (e, idTarea) => {
    e.dataTransfer.setData('idTarea', idTarea);
  };

  return (
    <div 
      className="glass-panel" 
      style={{ 
        padding: '20px', 
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.2s'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{titulo}</h3>
        <span style={{ 
          backgroundColor: 'var(--bg-primary)', 
          color: 'var(--text-secondary)',
          padding: '2px 10px', 
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: 'bold'
        }}>
          {tareas.length}
        </span>
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {tareas.map(t => (
          <div 
            key={t.idTarea} 
            draggable 
            onDragStart={(e) => handleDragStart(e, t.idTarea)}
          >
            <TarjetaTarea 
              tarea={t} 
              recargarTareas={recargarTareas} 
              miembrosProyecto={miembrosProyecto} 
              esLider={esLider}
              onClick={() => onTareaClick(t)}
            />
          </div>
        ))}
        {tareas.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '20px' }}>
            No hay tareas
          </div>
        )}
      </div>
    </div>
  );
}