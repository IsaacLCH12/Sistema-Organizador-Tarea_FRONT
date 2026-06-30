import { useState } from 'react';
import { registrarUsuario } from '../services/authService';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      await registrarUsuario({ nombre, correo: email, password });
      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
      window.location.href = '/login'; 
    } catch (error) {
      alert("Error al registrar. Revisa los datos.");
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F4F5F7' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', width: '350px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#172B4D' }}>Crear Cuenta</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} required
            style={{ padding: '10px', borderRadius: '4px', border: '2px solid #DFE1E6' }}
          />
          <input 
            type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required
            style={{ padding: '10px', borderRadius: '4px', border: '2px solid #DFE1E6' }}
          />
          <input 
            type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required
            style={{ padding: '10px', borderRadius: '4px', border: '2px solid #DFE1E6' }}
          />
          <button type="submit" disabled={cargando} style={{ padding: '12px', background: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {cargando ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>
      </div>
    </div>
  );
}