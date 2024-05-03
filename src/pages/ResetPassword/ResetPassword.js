import React, { useState } from 'react';
import axios from 'axios';
import './ResetPassword.css'
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


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
            const response = await axios.post('http://127.0.0.1:8080/reset-password', { password });
            console.log(response.data);
        } catch (error) {
            console.error('Failed to reset password:', error);
            toast.error('Failed to reset password. Please try again.');
        }
    }


    return (
        <div className='reset-password-page'>
            <div className='reset-password-img-container'>
                <Link to={'/'} className='reset-password-branch-title'>Pyppo</Link>
                <img src='https://w.wallhaven.cc/full/x6/wallhaven-x6wjkv.png' className='reset-password-img'></img>
            </div>
            <div className='reset-password-container'>
                <h1>Email Confirm</h1>
                <form className='reset-password-form' onSubmit={handleResetPassword}>
                    <div className='email-container'>
                        <label className='email-title'>Email</label>
                        <input type='email' placeholder='Enter your email' className='email-input' value={email} onChange={e => setEmail(e.target.value)}></input>
                    </div>
                    <div className='new-password-container'>
                        <label className='new-password-title'>New password</label>
                        <input type='password' placeholder='Enter your new password' className='new-password-input' value={password} onChange={e => setPassword(e.target.value)}></input>
                    </div>
                    <div className='confirm-new-password-container'>
                        <label className='confirm-new-password-title'>Confirm new password</label>
                        <input type='password' placeholder='Enter your new password again' className='confirm-new-password-input' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}></input>
                    </div>
                    <button type='submit' className='reset-password-btn'>Reset Password</button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;