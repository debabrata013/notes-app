import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api', // Use proxy instead of direct URL
    withCredentials: true
});

// JWT Token Attach Automatically
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
