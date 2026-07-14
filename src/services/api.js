import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor para agregar token JWT en las peticiones
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para manejar expiración del token (Opcional pero útil)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // El token expiró o es inválido, forzamos logout limpiando localStorage
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;