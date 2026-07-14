import api from './api';

export const listarActividades = async (idTarea) => {
    const response = await api.get(`/actividades/${idTarea}`);
    return response.data;
};
