import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useState } from "react";
import { loginUsuario } from "../services/authService";


export default function Login(){
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('');
    const[cargando,setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);
    
    try {
        /*llamamos al servicio */
        const respuestaBackend = await loginUsuario({correo : email, password:password});

        /*guadamos el toke */
        login(respuestaBackend);
        
        alert("Conexion al backend exitosa");


    } catch (error) {
        console.error("Fallo al iniciar sesión:", error);
        /* por si sale error */
        setError('Credenciales incorrectas o error en el servidor');
    } finally{
        setCargando(false);
    }
    };

    return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F4F5F7' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '350px' }}>
        <h2 style={{ textAlign: 'center', color: '#172B4D', marginBottom: '20px' }}>Iniciar Sesión</h2>
        
        {error && <div style={{ color: '#white', backgroundColor: '#FF5630', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#42526E', fontWeight: 'bold' }}>Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '2px solid #DFE1E6', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#42526E', fontWeight: 'bold' }}>Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '2px solid #DFE1E6', boxSizing: 'border-box' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            style={{ 
              backgroundColor: cargando ? '#B3D4FF' : '#0052CC', 
              color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: cargando ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginTop: '10px' 
            }}
          >
            {cargando ? 'Conectando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}