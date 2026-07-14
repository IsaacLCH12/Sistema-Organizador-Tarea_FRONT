import api from './api';

export const listarComentarios = async (idTarea) => {
    const response = await api.get(`/comentarios/${idTarea}`);
    return response.data;
};

export const crearComentario = async (idTarea, contenido) => {
    const response = await api.post(`/comentarios/${idTarea}`, { contenido });
    return response.data;
};

export const eliminarComentario = async (idComentario) => {
    const response = await api.delete(`/comentarios/${idComentario}`);
    return response.data;
};
