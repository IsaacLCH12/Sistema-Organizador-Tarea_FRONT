import api from './api';

export const listarTareas = async (idProyecto) => {
    const response = await api.get(`/tareas/proyecto/${idProyecto}`);
    return response.data;
};

export const obtenerTarea = async (idTarea) => {
    const response = await api.get(`/tareas/${idTarea}`);
    return response.data;
};

export const crearTarea = async (idProyecto, titulo, descripcion, etiquetaRecomendada, prioridad = 'Medium', tipoIssue = 'Task', fechaLimite = null, puntosHistoria = null) => {
    const body = { idProyecto, titulo, descripcion, etiquetaRecomendada, prioridad, tipoIssue };
    if (fechaLimite) body.fechaLimite = fechaLimite;
    if (puntosHistoria) body.puntosHistoria = puntosHistoria;
    const response = await api.post('/tareas/', body);
    return response.data;
};

export const editarTarea = async (idTarea, data) => {
    const response = await api.put(`/tareas/${idTarea}`, data);
    return response.data;
};

export const eliminarTarea = async (idTarea) => {
    const response = await api.delete(`/tareas/${idTarea}`);
    return response.data;
};

export const asignarTarea = async (idTarea, idMiembroEquipo) => {
    const response = await api.patch(`/tareas/${idTarea}/asignar?idMiembroEquipo=${idMiembroEquipo}`);
    return response.data;
};

export const cambiarEstadoTarea = async (idTarea, estado) => {
    const response = await api.patch(`/tareas/${idTarea}/estado`, { estado });
    return response.data;
};
