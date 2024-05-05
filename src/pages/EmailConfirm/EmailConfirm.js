import React, { useState, useEffect} from 'react';
import axios from 'axios';
import './EmailConfirm.css'
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const EmailConfirm = () => {
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Get the token from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');


        // Send a GET request to the backend server to confirm the email
        axios.get('http://127.0.0.1:8080/confirm-email/' + token)
            .then(response => {
                setMessage(response.data.message);
                toast.success(`${message}`)
                console.message(response.data.message);
                
            })
            .catch(error => {
                console.error('Error confirming email:', error);
                setMessage('Error confirming email');
            });
    }, []);


    const handleResetPassword = async (event) => {
        event.preventDefault();
        // const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,}$/;

        // if (!passwordRegex.test(password)) {
        //     toast.error('Password must be at least 6 characters long and include at least one uppercase letter, one number, and one special character.');
        //     return;
        // }

        // if (password !== confirmPassword) {
        //     toast.error('Password and confirm password do not match.');
        //     return;
        // }

        try {
            toast.success(`${email}`)
            const response = await axios.post('http://127.0.0.1:8080/request-reset', { email });
            console.log(response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error("This mail does not exist in Pyppo! Please try again.");
            } else {
                // Handle other errors
            }   
        }
    }


    return (
        <div className='email-confirm-page'>
            <Link to={'/'} className='email-confirm-branch-title'>Pyppo</Link>
            <div className='email-confirm-container'>
                <Link to={'/'} className='email-confirm-form-branch-title'>Pyppo</Link>
                <FontAwesomeIcon icon={faEnvelope} className='mail-confirm-icon' size='3x'/>
                <h1>Email Confirm</h1>
                <form className='email-confirm-form' onSubmit={handleResetPassword}>
                    <div className='email-container'>
                        <label className='email-title'>Email</label>
                        <input type='email' placeholder='Enter your email' className='email-input' value={email} onChange={e => setEmail(e.target.value)}></input>
                    </div>
                    {/* <div className='new-password-container'>
                        <label className='new-password-title'>New password</label>
                        <input type='password' placeholder='Enter your new password' className='new-password-input' value={password} onChange={e => setPassword(e.target.value)}></input>
                    </div>
                    <div className='confirm-new-password-container'>
                        <label className='confirm-new-password-title'>Confirm new password</label>
                        <input type='password' placeholder='Enter your new password again' className='confirm-new-password-input' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}></input>
                    </div> */}
                    <button type='submit' className='email-confirm-btn'>Email Confirm</button>
                </form>
            </div>
        </div>
    );
}

export default EmailConfirm;