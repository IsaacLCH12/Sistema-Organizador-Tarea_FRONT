import api from './api';

export const listarProyectos = async () => {
    const response = await api.get('/proyectos/');
    return response.data;
};

export const crearProyecto = async (nombre, descripcion) => {
    const response = await api.post('/proyectos/', { nombre, descripcion });
    return response.data;
};

export const unirseProyecto = async (idUsuario, codigoInvitacion, rolFuncional) => {
    const response = await api.post('/proyectos/unirse', {
        idUsuario,
        codigoInvitacion,
        rolFuncional
    });
    return response.data;
};

export const listarMiembros = async (idProyecto) => {
    const response = await api.get(`/proyectos/${idProyecto}/miembros`);
    return response.data;
};

export const eliminarProyecto = async (idProyecto) => {
    const response = await api.delete(`/proyectos/${idProyecto}`);
    return response.data;
};
