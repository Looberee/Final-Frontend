import React, { createContext, useContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode'; // Library for decoding JWT tokens
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast'

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
const [accessToken, setAccessToken] = useState();
const [refreshToken, setRefreshToken] = useState();
const [expiresAt, setExpiresAt] = useState(null);
const [alreadyAuth, setAlreadyAuth] = useState(false);



useEffect(() => {
    console.log("Access Token: " + accessToken);
    console.log("Refresh Token: " + refreshToken);
    console.log("Expires At: " + expiresAt);
    console.log("Date expired for token: ", new Date(expiresAt));
    console.log("Already Authenticated: " + alreadyAuth);
}, [accessToken, refreshToken, alreadyAuth]);

useEffect(() => {
    if (!accessToken || !expiresAt) {
        return;
    }

    const timerId = setTimeout(() => {
        refreshTokens();
    }, expiresAt - new Date().getTime());

    return () => clearTimeout(timerId);
}, [accessToken, expiresAt]);

useEffect(() => {
    if (!accessToken || !expiresAt) {
        return;
    }

    const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    const oneMinute = 1 * 60 * 1000; // 1 minute in milliseconds
    const timeUntilExpiration = expiresAt - new Date().getTime();

    let timerId;

    if (timeUntilExpiration > tenMinutes) {
        timerId = setTimeout(() => {
            console.log('The access token will expire in 10 minutes.');
        }, timeUntilExpiration - tenMinutes);
    } else if (timeUntilExpiration > fiveMinutes) {
        timerId = setTimeout(() => {
            console.log('The access token will expire in 5 minutes.');
        }, timeUntilExpiration - fiveMinutes);
    } else if (timeUntilExpiration > oneMinute) {
        timerId = setTimeout(() => {
            console.log('The access token will expire in 1 minute.');
        }, timeUntilExpiration - oneMinute);
    } else {
        console.log('The access token will expire in less than 1 minute. Forcing refresh token now!');
        refreshTokens();
    }

    return () => clearTimeout(timerId);
}, [accessToken, expiresAt]);

const refreshTokens = async () => {
    try {
        const response = await axios.post('http://127.0.0.1:8080/refresh', {}, {
            withCredentials: true, // This will send the HttpOnly cookie
        });
        console.log("Successfully refreshed tokens: ", response.data.refresh);
        login(response.data.access_token);
    } catch (error) {
        console.error('Error refreshing tokens:', error);
        throw error;
    }
};

const login = (token) => {
    const { exp } = jwtDecode(token);
    setExpiresAt(exp * 1000);
};

const logout = async () => {
    setExpiresAt(null);
    try {
        const response = await axios.get('http://127.0.0.1:8080/logout', {
            withCredentials: true // This will send the HttpOnly cookie
        });
        console.log('Logout successful:', response.data);
        toast.success('Logout sucessfully!')
        setTimeout(() => {
            window.location.pathname = '/home';
        },[2000])

    } catch (error) {
        console.error('Error logging out:', error);
    }
};

const isAuthenticated = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8080/check-auth', {
            withCredentials: true
        });
        return response.data.isAuthenticated;
    } catch (error) {
        console.error('Error checking auth:', error);
        return false;
    }
};


useEffect(() => {
    const checkAuth = async () => {
        const auth = await isAuthenticated();
        setAlreadyAuth(auth);
    };
    checkAuth();
}, [alreadyAuth]);




return (
    <AuthContext.Provider value={{ accessToken, setAccessToken,  login, logout, isAuthenticated, setRefreshToken, refreshToken, alreadyAuth, setAlreadyAuth }}>
        {children}
    </AuthContext.Provider>
);
};
