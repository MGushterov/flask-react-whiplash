import { getCookie, setCookie, deleteCookie } from './cookies';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000';

export const refreshToken = async () => {
    try {
        const refreshToken = getCookie('refreshToken');
        const res = await axios.post(`${BASE_URL}/refresh`, {}, {
            headers: { 'Authorization': `Bearer ${refreshToken}` }
        });

        setCookie('accessToken', res.data.accessToken, 1);
        return res.data.accessToken;
    } 
    catch (error) {
        console.error('Refresh token error:', error);
        throw new Error('Session expired, please log in again.');
    }
};

export const logout = async () => {
    try {
        const accessToken = getCookie('accessToken');
        const refreshToken = getCookie('refreshToken');

        const reqOptions_1 = {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }

        const reqOptions_2 = {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        }

        const response = await fetch(`${BASE_URL}/logout`, reqOptions_1);
        const response2 = await fetch(`${BASE_URL}/logout`, reqOptions_2);

        if(!response) {
            console.log('error with first request');
            return;
        }
        if(!response2) {
            console.log('error with second request');
            return;
        }

        console.log('Logout response:', response.data);

        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        deleteCookie('userId');

        confirm('Logged out successfully');
        window.location.reload();
    } 
    catch (error) {
        alert('Logout error:', error);
    }
};