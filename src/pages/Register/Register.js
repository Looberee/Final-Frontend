import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import './Register.css';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:5000/register', {
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
        } catch (error) {
            console.error('Registration failed:', error);
            // Handle registration failure, e.g., show error message to user
        }

        console.log(username, email, password, confirmPassword);
    };

    return (
        <div className="limiter">
            <div className="container-login100">
                <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
                    <form className="login100-form validate-form" onSubmit={handleSubmit}>
                        <span className="login100-form-title p-b-49">
                            Register
                        </span>

                        <div className="wrap-input100 validate-input m-b-23" data-validate="Username is required">
                            <span className="label-input100">Username</span>
                            <input className="input100" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Type your username" required />
                            <span className="focus-input100" data-symbol="&#xf206;"></span>
                        </div>

                        <div className="wrap-input100 validate-input m-b-23" data-validate="Email is required">
                            <span className="label-input100">Email</span>
                            <input className="input100" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Type your email" required />
                            <span className="focus-input100" data-symbol="&#xf206;"></span>
                        </div>

                        <div className="wrap-input100 validate-input m-b-23" data-validate="Password is required">
                            <span className="label-input100">Password</span>
                            <input className="input100" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Type your password" required />
                            <span className="focus-input100" data-symbol="&#xf190;"></span>
                        </div>

                        <div className="wrap-input100 validate-input m-b-23" data-validate="Please confirm your password">
                            <span className="label-input100">Confirm password</span>
                            <input className="input100" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required />
                            <span className="focus-input100" data-symbol="&#xf190;"></span>
                        </div>

                        <div className="container-login100-form-btn">
                            <div className="wrap-login100-form-btn">
                                <div className="login100-form-bgbtn"></div>
                                <button className="login100-form-btn" type="submit">
                                    Register
                                </button>
                            </div>
                        </div>

                        <div className="txt1 text-center p-t-54 p-b-20">
                            <span>
                                Or Sign Up Using
                            </span>
                        </div>

                        <div className="flex-c-m">
                            <a href="#" className="login100-social-item bg1">
                                <FontAwesomeIcon icon={faFacebook} />
                            </a>

                            <a href="#" className="login100-social-item bg2">
                                <FontAwesomeIcon icon={faGoogle} />
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
