import api from './api';

export const login = async (correo, contrasena) => {
    const response = await api.post('/usuarios/login', { correo, contrasena });
    return response.data;
};

export const registrar = async (nombre, correo, contrasena) => {
    const response = await api.post('/usuarios/registro', { nombre, correo, contrasena });
    return response.data;
};

export const obtenerPerfil = async () => {
    const response = await api.get('/usuarios/perfil');
    return response.data;
};

export const actualizarPerfil = async (data) => {
    const response = await api.put('/usuarios/perfil', data);
    return response.data;
};

export const obtenerMisTareas = async () => {
    const response = await api.get('/usuarios/mis-tareas');
    return response.data;
};
