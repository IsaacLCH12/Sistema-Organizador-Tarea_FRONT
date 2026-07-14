import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrar } from '../services/authService';
import { Eye, EyeOff } from 'lucide-react';
import ModalAlerta from '../components/ModalAlerta';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validaciones
    if (nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.');
      return;
    }
    if (!correo.includes('@') || !correo.includes('.')) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      await registrar(nombre, correo, contrasena);
      // Redirigir al login después del registro exitoso
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al registrar usuario. Es posible que el correo ya esté en uso.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      
      <ModalAlerta mensaje={error} onClose={() => setError('')} />

      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: 'var(--accent-primary)' }}>Únete a StudyFlow</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px' }}>Crea tu cuenta gratis</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nombre Completo</label>
            <input 
              type="text" 
              className="input-base" 
              placeholder="Juan Pérez" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Correo Electrónico</label>
            <input 
              type="email" 
              className="input-base" 
              placeholder="tu@correo.com" 
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={mostrarContrasena ? "text" : "password"} 
                className="input-base" 
                placeholder="••••••••" 
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                style={{ paddingRight: '40px' }}
                required 
              />
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0'
                }}
              >
                {mostrarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            Crear Cuenta
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          ¿Ya tienes una cuenta? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '500' }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
