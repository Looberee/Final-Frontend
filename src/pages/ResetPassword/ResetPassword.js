import React, { useState, useEffect} from 'react';
import axios from 'axios';
import './ResetPassword.css'
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [serverToken , setServerToken] = useState('');
    const navigate = useNavigate();

    const { token } = useParams();

    useEffect(() => {
        setServerToken(token);
    }, [token]); // Add token to the dependency array

    const handleResetPassword = async (event) => {
        event.preventDefault();
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,}$/;

        if (!passwordRegex.test(password)) {
            toast.error('Password must be at least 6 characters long and include at least one uppercase letter, one number, and one special character.');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Password and confirm password do not match.');
            return;
        }

        try {
            toast.success(`${password}`)
            const response = await axios.post(`http://127.0.0.1:8080/personal/reset-password/${serverToken}`, { password });
            console.log(response.data);
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.status === 404) {  
                toast.error("Hmm! Something went wrong! Please try again.");
            } else {
                // Handle other errors
            }   
        }
    }


    return (
        <div className='reset-password-page'>
            <Link to={'/'} className='reset-password-branch-title'>Pyppo</Link>
            <div className='reset-password-container'>
                <Link to={'/'} className='reset-password-form-branch-title'>Pyppo</Link>
                <FontAwesomeIcon icon={faKey} className='reset-password-icon' size='3x'/>
                <h1>Reset Password</h1>
                <form className='reset-password-form' onSubmit={handleResetPassword}>
                    <div className='new-password-container'>
                        <label className='new-password-title'>New password</label>
                        <input type='password' placeholder='Enter your new password' className='new-password-input' value={password} onChange={e => setPassword(e.target.value)}></input>
                    </div>
                    <div className='confirm-new-password-container'>
                        <label className='confirm-new-password-title'>Confirm new password</label>
                        <input type='password' placeholder='Enter your new password again' className='confirm-new-password-input' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}></input>
                    </div>
                    <button type='submit' className='email-confirm-btn'>Confirm</button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;