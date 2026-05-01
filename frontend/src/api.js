import axios from 'axios';

const api = axios.create({
    baseURL: 'team-task-manager-production-9f75.up.railway.app', 
});

// Automatically attach the token to all requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
