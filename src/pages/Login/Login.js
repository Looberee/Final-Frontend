import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import './Login.css';
import './LoginUltil.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { login } = useAuth();

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            // Handle Login events
            const response = await axios.post('http://127.0.0.1:5000/login', {
                username,
                password
            });
            console.log('Login successful', response.data);
    
            // Save token or session identifier in local storage or cookies
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('spotify_token', response.data.spotify_access_token);
            console.log('Token: ' + response.data.access_token);
            console.log('Spotify Access Token: ' + response.data.spotify_access_token);
            setIsLoggedIn(true);
            login(localStorage.getItem('token'));
            console.log(response.data.profile);
            onLogin();

        } catch (error) {
            console.log(error.message);
        }
    };
    
    
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div>
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
                        <form className="login100-form validate-form" onSubmit={handleLogin}>
                            <span className="login100-form-title p-b-49">
                                Login
                            </span>

                            <div className="wrap-input100 validate-input m-b-23" data-validate="Username is required">
                                <span className="label-input100">Username</span>
                                <input className="input100" type="text" name="username" placeholder="Type your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                <span className="focus-input100" data-symbol="&#xf206;"></span>
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Password is required">
                                <span className="label-input100">Password</span>
                                <input className="input100" type="password" name="password" placeholder="Type your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <span className="focus-input100" data-symbol="&#xf190;"></span>
                            </div>

                            <div className="text-right p-t-8 p-b-31">
                                <a href="#">
                                    Forgot password?
                                </a>
                            </div>

                            <div className="container-login100-form-btn">
                                <div className="wrap-login100-form-btn">
                                    <div className="login100-form-bgbtn"></div>
                                    <button className="login100-form-btn">
                                        Login
                                    </button>
                                </div>
                            </div>

                            <div className="txt1 text-center p-t-54 p-b-20">
                                <span>
                                    Or Log in Using
                                </span>
                            </div>

                            <div className="flex-c-m">
                                <a href="#" className="login100-social-item bg1">
                                    <FontAwesomeIcon icon={faFacebook} />
                                </a>

                                <a href="#" className="login100-social-item bg2">
                                    <FontAwesomeIcon icon={faFacebook} />
                                </a>

                                <a href="#" className="login100-social-item bg3">
                                    <FontAwesomeIcon icon={faFacebook} />
                                </a>
                            </div>

                            <div className="flex-col-c p-t-155">
                                <span className="txt1 p-b-17">
                                    Or Sign Up Using
                                </span>

                                <a href="#" className="txt2">
                                    Sign Up
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
