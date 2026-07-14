import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginService } from '../services/authService';
import { Eye, EyeOff } from 'lucide-react';
import ModalAlerta from '../components/ModalAlerta';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validación básica de formato
    if (!correo.includes('@') || !correo.includes('.')) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    
    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const data = await loginService(correo, contrasena);
      login(data.usuario, data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Correo o contraseña incorrectos. Intenta de nuevo.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      
      <ModalAlerta mensaje={error} onClose={() => setError('')} />

      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: 'var(--accent-primary)' }}>StudyFlow</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px' }}>Inicia sesión en tu cuenta</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            Ingresar
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          ¿No tienes una cuenta? <Link to="/registro" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '500' }}>Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
