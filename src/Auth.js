// api/auth.js
import axios from 'axios';

export const refreshTokens = async () => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/refresh');
        const { access_token: accessToken } = response.data;
        return accessToken;
    } catch (error) {
        console.error('Error refreshing tokens:', error);
        throw error;
    }
};

const refreshSpotifyTokens = async () => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/spotify/refresh');
        const { spotify_access_token: spotify_accessToken } = response.data;
        return spotify_accessToken;
    } catch (error) {
        console.error('Error refreshing spotify tokens:', error);
        throw error;
    }
};
