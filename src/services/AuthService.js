import api from "./Api";

export const loginUsuario = async (credenciales) =>{

    try {
        /*apuntamos a la ruta del backend */
        const response = await api.post('/usuarios/login', credenciales); 
    
        /*devolvemos la respuesta real de tu backend */
        return response.data;
    } catch (error) {
        console.error("Error en el login: ",error.response?.data || error.message);
        throw error;
    }
};

export const registrarUsuario = async (datosUsuario) => {
  try {
    const response = await api.post('/usuarios/registro', datosUsuario);
    return response.data;
  } catch (error) {
    console.error("Error en el registro:", error);
    throw error;
  }
};