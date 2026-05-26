import axios from "axios";

const api = axios.create({
    
    baseURL: import.meta.env.VITE_BACKEND_URL,

    headers: {
        'Content-Type':'application/json',
        'Accept': 'appplication/json'
    }
});

export default api;