import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('AUTH_TOKEN')
    console.log('Token en interceptor:', token)
    if(token){
        // Aseguramos que headers exista
        config.headers = config.headers || {}
        
        // Establecemos el header con 'a' minúscula para coincidir con Express
        config.headers['authorization'] = `Bearer ${token}`
        
        console.log('Headers configurados:', config.headers)
    }
    return config
})
export  default api;