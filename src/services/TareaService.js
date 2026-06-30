import api from './api';

export const obtenerTareas = async (idProyecto) => {
  try {
    const response = await api.get(`/tareas/proyecto/${idProyecto}`);
    return response.data;
  } catch (error) {
    // Este catch SÍ es útil porque manejas el error retornando []
    console.error("Error al obtener tareas:", error);
    return [];
  }
};

export const crearTarea = async (datosTarea) => {
  const response = await api.post('/tareas', datosTarea);
  return response.data;
};

export const actualizarEstado = async (idTarea, nuevoEstado) => {
  const response = await api.put(`/tareas/${idTarea}/estado`, { estado: nuevoEstado });
  return response.data;
};