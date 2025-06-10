import axios from 'axios';
import { getCookie } from './cookies';
import axiosInstance from './axiosInstance';

const BASE_URL = 'http://127.0.0.1:5000';

export const getTotalAmountOfTracks = async () => {
    const { data } = await axios.get(`${BASE_URL}/available`);
    return data.tracksCount; 
}

export const getUserPlaylists = async () => {
    try {
        const userId = getCookie('userId');
        const response = await axiosInstance.get(`${BASE_URL}/playlists/${userId}`)
        return response.data.playlists;
    }
    catch (error) {
        console.error('Error fetching user playlists:', error);
        throw error;
    }
}

export const getAvailableSongs = async () => {
    try {
        const { data } = await axiosInstance.get(`${BASE_URL}/tracks`);
        return data;
    }
    catch (error) {
        console.error('Error fetching available songs:', error);
        throw error;
    }
}

export const getSongsByTitle = async (songTitle) => {
    try {
        const { data } = await axiosInstance.get(`${BASE_URL}/available/${songTitle}`);
        return data
    }
    catch (error) {
        console.error('Error fetching songs by title:', error);
        throw error;
    }
}