import React, { createContext, useContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode'; // Library for decoding JWT tokens
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
const [expiresAt, setExpiresAt] = useState(null);

useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
    const { exp } = jwtDecode(token);
    setAccessToken(token);
    setExpiresAt(exp * 1000);
    }
}, []);

const login = (token) => {
    const { exp } = jwtDecode(token);
    setAccessToken(token);
    setExpiresAt(exp * 1000);
};

const logout = async () => {
    setAccessToken(null);
    setExpiresAt(null);
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:5000/logout', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
        });
        console.log('Logout successful:', response.data);
        localStorage.removeItem('token');
        localStorage.removeItem('spotify_token');
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

const isAuthenticated = () => {
    return accessToken && new Date().getTime() < expiresAt;
};

return (
    <AuthContext.Provider value={{ accessToken, login, logout, isAuthenticated }}>
        {children}
    </AuthContext.Provider>
);
};
