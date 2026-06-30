import { createContext, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const userGuardado = localStorage.getItem('usuario');
    return userGuardado ? JSON.parse(userGuardado) : null;
  });

  const [idUsuario, setIdUsuario] = useState(() => {
    return localStorage.getItem('idUsuario') || null;
  });

  const [cargando] = useState(false);

  const login = (datosDelBackend) => {
    setUsuario(datosDelBackend.usuario);
    setIdUsuario(datosDelBackend.idUsuario);

    localStorage.setItem('token', datosDelBackend.token);
    localStorage.setItem('usuario', JSON.stringify(datosDelBackend.usuario));
    localStorage.setItem('idUsuario', datosDelBackend.idUsuario);
  };

  const logout = () => {
    setUsuario(null);
    setIdUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('idUsuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, idUsuario, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};