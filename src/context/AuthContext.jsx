/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuarioActual, setUsuarioActual] = useState(() => {
    // Intentar recuperar de localStorage
    const userGuardado = localStorage.getItem('usuarioActual');
    return userGuardado ? JSON.parse(userGuardado) : null;
  });

  const [rolActual, setRolActual] = useState(() => {
    return localStorage.getItem('rolActual') || null;
  });

  const [proyectoActual, setProyectoActual] = useState(() => {
    return localStorage.getItem('proyectoActual') || null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  // Efecto para sincronizar con LocalStorage
  useEffect(() => {
    if (usuarioActual) {
      localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
    } else {
      localStorage.removeItem('usuarioActual');
    }
  }, [usuarioActual]);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (rolActual) localStorage.setItem('rolActual', rolActual);
    else localStorage.removeItem('rolActual');
  }, [rolActual]);

  useEffect(() => {
    if (proyectoActual) localStorage.setItem('proyectoActual', proyectoActual);
    else localStorage.removeItem('proyectoActual');
  }, [proyectoActual]);

  const login = (userData, jwtToken) => {
    setUsuarioActual(userData);
    setToken(jwtToken);
  };

  const logout = () => {
    setUsuarioActual(null);
    setToken(null);
    setRolActual(null);
    setProyectoActual(null);
  };

  const seleccionarProyecto = (idProyecto, rol) => {
    setProyectoActual(idProyecto);
    setRolActual(rol);
  };

  return (
    <AuthContext.Provider value={{
      usuarioActual, 
      token,
      rolActual, 
      proyectoActual, 
      login, 
      logout,
      seleccionarProyecto
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
