import { getCookie, deleteCookie } from './cookies';
import axios from 'axios';
import { refreshToken } from './auth';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = getCookie('accessToken');
        if(accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 

            try {
                const newAccessToken = await refreshToken();
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest); 
            } 
            catch (refreshError) {
                console.error('Failed to refresh token:', refreshError);
                deleteCookie('accessToken');
                deleteCookie('refreshToken');
                window.location.href = '/login'; 
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
)

export default axiosInstance;