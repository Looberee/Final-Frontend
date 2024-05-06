import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle, faSpotify } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import './Login.css';
import './LoginUltil.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRoom } from '../../contexts/RoomContext';
import { Link } from 'react-router-dom';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import { toast, Toaster } from 'react-hot-toast';
import Modal from 'react-modal';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { setAccessToken, setRefreshToken, login, setAlreadyAuth } = useAuth();
    const { roomState } = useRoom();
    const [isModalOpen, setIsModalOpen] = useState(false); //

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            // Handle Login events
            const response = await axios.post('http://127.0.0.1:8080/login', {
                username,
                password
            }, {withCredentials: true});  // Make sure to include this to send cookies
    
            if (response.data.login) {
                setIsLoggedIn(true);
                setAlreadyAuth(true);
            } else {
                toast.error("Something goes wrong, please try again")
            }

            if (response.data.spotify_token)
            {
                localStorage.setItem('spotify_token', response.data.spotify_token);


            }
            if (response.data.spotify_expire_at)
            {
                localStorage.setItem('spotify_expires_at', response.data.spotify_expire_at);
                const spotifyExpireAt = new Date(response.data.spotify_expire_at * 1000);
            }
            toast.success('Logged in successfully');
    
        } catch (error) {
            if (error.response && error.response.status === 429) {
                toast.error('Too many requests. Please try again later.');
            } else {
                toast.error('Wrong username or password!');
            }
        }
    };
    
    
    useEffect(() => {
        if (isLoggedIn) {
            if (roomState === true) {
                navigate('/room')
            }
            else {
                setTimeout(() => {
                    navigate('/');
                }, 2000); // Wait for 2 seconds before navigating
            }
        }
    }, [isLoggedIn, navigate]);

    const handleBackToHome = () => {
        navigate('/');
    }

    const handleOpenForgotPassword = () => {
        handleOpenModal();
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(255, 255, 255, 0.75)' // white overlay with 75% opacity
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            width: '700px',
            height: '500px',
            zIndex : '8888'
        }
    };

    return (
        <div>
            <div className="limiter">
                <div className="container-login100-login">
                    <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
                        <form className="login100-form validate-form" onSubmit={handleLogin}>
                            

                            <span className="login100-form-title p-b-49">
                                Welcome to <span className="login100-form-title custom-title" onClick={handleBackToHome}>Pyppo</span>
                            </span>

                            <div className="wrap-input100 validate-input m-b-23" data-validate="Username is required">
                                <span className="label-input100">Username</span>
                                <input className="input100" type="text" name="username" placeholder="Type your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                <FontAwesomeIcon icon={faUser} className="fontawesome"/>
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Password is required">
                                <span className="label-input100">Password</span>
                                <input className="input100" type="password" name="password" placeholder="Type your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <FontAwesomeIcon icon={faLock} className="fontawesome"/>
                            </div>

                            <div className="text-right p-t-8 p-b-31">
                                <div className='login-actions'>
                                    <Link to={'/email-confirm'}>
                                        Forgot password?
                                    </Link>

                                    <Link to='/register'>Sign up here!</Link>
                                </div>
                            </div>

                            <div className="container-login100-form-btn">
                                <div className="wrap-login100-form-btn">
                                    <div className="login100-form-bgbtn"></div>
                                    <button className="login100-form-btn">
                                        Login
                                    </button>
                                </div>
                            </div>

                            {/* <div className="txt1 text-center p-t-54 p-b-20">
                                <span>
                                    Or Log in Using
                                </span>
                            </div> */}

                            {/* <div className="flex-c-m">
                                <div className="login100-social-item bg2" style={{cursor:'pointer'}} onClick={handleLoginWithSpotify}>
                                    <FontAwesomeIcon icon={faSpotify} />
                                </div>
                            </div> */}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
