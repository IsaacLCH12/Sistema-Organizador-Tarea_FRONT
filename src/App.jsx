import { useState, useEffect } from 'react';
import api from './services/api';

function App() {
  const [mensaje, setMensaje] = useState('Intentando conectar con el backend...');
  const [estado, setEstado] = useState('cargando');

  useEffect(() => {
    // Hacemos una petición GET a la ruta raíz ("/") de tu FastAPI
    api.get('/')
      .then((respuesta) => {
        // Si Python responde, guardamos el mensaje
        setMensaje(respuesta.data.mensaje || "¡Conexión exitosa pero sin mensaje!");
        setEstado('conectado');
      })
      .catch((error) => {
        console.error("Error de conexión:", error);
        setMensaje('Error: No se pudo conectar. ¿Está encendido el servidor FastAPI?');
        setEstado('error');
      });
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>StudyFlow</h1>
      
      <div style={{
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: estado === 'conectado' ? '#d4edda' : estado === 'error' ? '#f8d7da' : '#e2e3e5',
        color: estado === 'conectado' ? '#155724' : estado === 'error' ? '#721c24' : '#383d41',
        border: '1px solid',
        borderColor: estado === 'conectado' ? '#c3e6cb' : estado === 'error' ? '#f5c6cb' : '#d6d8db'
      }}>
        <h3 style={{ marginTop: 0 }}>Estado del Servidor:</h3>
        <p style={{ fontWeight: 'bold', margin: 0 }}>{mensaje}</p>
      </div>
    </div>
  );
}

export default App;