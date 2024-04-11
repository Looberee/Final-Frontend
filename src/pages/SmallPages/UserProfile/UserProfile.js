import React, { useState, useEffect } from 'react';
import './UserProfile.css'
import axios from 'axios';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import Cookies from 'js-cookie';
import Favourite from '../../../components/FavouritePlaylist/FavouritePlaylist'; 
import FavouritePlaylist from '../../../components/FavouritePlaylist/FavouritePlaylist';
import Albums from '../../../components/Recommendation/Albums/Albums';
import { ProfilePlaylist } from '../../../components/PersonalPlaylists/PersonalPlaylists';
import PayPalButton from '../../../components/PaypalButton/PaypalButton';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';

const UserProfile = () => {
    const [profileData, setProfileData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openPaymentModal = () => {
        setModalIsOpen(true);
    };

    const closePaymentModal = () => {
        setModalIsOpen(false);
    };

    const modalStyles = {
        content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        backgroundColor: '#090f1b',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        border: 'none',
        padding: '20px',
        maxHeight: '80vh',
        minWidth: '25vw',
        overflow: 'auto'
        },
        overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: '1000'
        }
    };

    

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/profile', { withCredentials: true });
                setProfileData(response.data.profile);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    return (     
        <div>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div>
                    <div className='profile-container'>
                        <div className='image-container'>
                            <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' loading='lazy' />
                        </div>

                        <div className='info-container'>
                            <div className='username-status-container'>
                                <h1 className='username'>{profileData.username}</h1>
                                {profileData.role === 'regular' ? '' :<FontAwesomeIcon className='crown-icon' icon={faCrown} />}
                            </div>

                            <div className='role-status-container'>
                                <h3 className='user-role'>{profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)} User</h3>
                                {profileData.role === 'regular' ? <span className='premium-perform-btn' onClick={openPaymentModal}>Upgrade to Premium</span> : <span></span>}  
                            </div>
                            
                        </div>


                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={closePaymentModal}
                            contentLabel="Standard Modal"
                            style={modalStyles}
                        >
                            <h1 style={{color:'#fff'}}>Standard Modal</h1>
                            <p style={{color:'#fff'}}>This is a standard modal</p>
                            <PayPalButton />
                        </Modal>
                        
                    </div>

                    <ProfilePlaylist />

                    <FavouritePlaylist />
                </div>
            )}
        </div>
    );
};

export default UserProfile;
