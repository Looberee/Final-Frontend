import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Register.css';
import axios from 'axios';
import { faLock, faMailBulk, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

import { toast, Toaster } from 'react-hot-toast';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // if (!username) {
        //     toast.error('Username is missing');
        //     return;
        // }
        // if (!email) {
        //     toast.error('Email is missing');
        //     return;
        // }
        // if (!password) {
        //     toast.error('Password is missing');
        //     return;
        // }
        // if (!confirmPassword) {
        //     toast.error('Confirm password is missing');
        //     return;
        // }

        try {
            const response = await axios.post('http://127.0.0.1:8080/register', {
                username,
                email,
                password,
            });

            console.log(response.data); // Assuming your backend returns some data upon successful registration

            // Reset form fields after successful registration
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            toast.success("Succesfully registered! Please login to continue")
            setTimeout(() => {
                navigate('/login');
            },[3000]);

        } catch (error) {
            console.error('Registration failed:', error);
            toast.error('Registration failed! Please try again');
        }

        console.log(username, email, password, confirmPassword);
    };

    const handleBackToHome = () => {
        navigate('/')
    }

    return (
        <div className="limiter">
            <div className="container-login100-register">
                <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
                    <form className="login100-form validate-form" onSubmit={handleSubmit}>
                        <span className="login100-form-title p-b-49">
                            Register to <span className="login100-form-title custom-title" onClick={handleBackToHome}>Pyppo</span>
                        </span>

                        <div className="wrap-input100 validate-input m-b-23" data-validate="Username is required">
                            <span className="label-input100">Username</span>
                            <input className="input100" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Type your username" required />
                            <FontAwesomeIcon icon={faUser} className="fontawesome"/>
                        </div>

                        <div className="wrap-input100 validate-input m-b-23" data-validate="Email is required">
                            <span className="label-input100">Email</span>
                            <input className="input100" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Type your email" required />
                            <FontAwesomeIcon icon={faMailBulk} className="fontawesome"/>
                        </div>

                        <div className="wrap-input100 validate-input m-b-23" data-validate="Password is required">
                            <span className="label-input100">Password</span>
                            <input className="input100" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Type your password" required />
                            <FontAwesomeIcon icon={faLock} className="fontawesome"/>
                        </div>

                        <div className="wrap-input100 validate-input m-b-23" data-validate="Please confirm your password">
                            <span className="label-input100">Confirm password</span>
                            <input className="input100" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required />
                            <FontAwesomeIcon icon={faLock} className="fontawesome"/>
                        </div>

                        <div className="text-right p-t-8 p-b-31">
                                <div className='register-actions'>
                                    Already have an account?
                                    <Link to='/login' href="#" className='login-navigate'>
                                        Login now
                                    </Link>
                                </div>
                        </div>

                        <div className="container-login100-form-btn">
                            <div className="wrap-login100-form-btn">
                                <div className="login100-form-bgbtn"></div>
                                <button className="login100-form-btn" type="submit">
                                    Register
                                </button>
                            </div>
                        </div>
                    <Toaster />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
