import axios from 'axios';

// Configuramos Axios con la URL secreta de tu .env
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

// Función para obtener la lista de proyectos
export const obtenerProyectos = async () => {
  try {
    const response = await api.get('/proyectos');
    return response.data;
  } catch (error) {
    console.error("Error al obtener los proyectos:", error);
    return []; // Retorna un arreglo vacío si hay error para que no se caiga la página
  }
};

// Función para enviar el código y unirse
export const unirseProyecto = async (codigoInvitacion) => {
  try {
    const response = await api.post('/proyectos/unirse', { codigo: codigoInvitacion });
    return response.data;
  } catch (error) {
    console.error("Error al unirse al proyecto:", error);
    throw error; 
  }
};

export const crearProyecto = async (datosProyecto) => {
  try {
    // Mandamos el nombre y descripción. El backend se encargará de generar el código.
    const response = await api.post('/proyectos', datosProyecto);
    return response.data;
  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    throw error; 
  }
};