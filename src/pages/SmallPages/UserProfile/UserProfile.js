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
import { faCircleHalfStroke, faCrown, faDoorOpen, faGem, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { faBots } from '@fortawesome/free-brands-svg-icons';
import toast from 'react-hot-toast';
import FavouriteArtists from '../../../components/FavouriteArtists/FavouriteArtists';

const UserProfile = () => {
    const [profileData, setProfileData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editProfileModalIsOpen, setEditProfileModalIsOpen] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [profileEmail, setProfileEmail] = useState('');
    const [triggerUpdate, setTriggerUpdate] = useState(false);

    const openPaymentModal = () => {
        setModalIsOpen(true);
    };

    const closePaymentModal = () => {
        setModalIsOpen(false);
    };

    const openEditProfileModal = () => {
        setEditProfileModalIsOpen(true);
    }

    const closeEditProfileModal = () => {
        setEditProfileModalIsOpen(false);
        setTriggerUpdate((pre) => !pre);
    }

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
                const response = await axios.get('http://127.0.0.1:8080/profile', { withCredentials: true });
                setProfileData(response.data.profile);
                setProfileName(response.data.profile.username);
                setProfileEmail(response.data.profile.email);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                toast.error("Something goes wrong, please try again")
            }
        };

        fetchUserProfile();
    }, [triggerUpdate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        // Validation check
        if (!profileName) {
            toast.error('Name cannot be empty');
            return;
        }

        if (!profileEmail) {
            toast.error('Email cannot be empty');
            return;
        }

        if (!emailRegex.test(profileEmail)) { 
            toast.error('Please enter a valid email');
            return;
        }
    
        try {
            const response = await axios.put('http://127.0.0.1:8080/profile', {
                username: profileName,
                email: profileEmail,
            }, {withCredentials : true});

            if (response.data.exists_name) {
                toast.error("Username has already exists")
                return;
            }

            if (response.data.exists_email) {
                toast.error("Email has already exists")
                return;
            }
    

            toast.success("Profile updated successfully!")
            closeEditProfileModal();
        } catch (error) {
            console.error(error);
            toast.error("Something goes wrong, please try again")
        }
    };

    return (     
        <div>
            {isLoading ? (
                <div></div>
            ) : (
                <div>
                    <div className='profile-container'>
                        <div className='image-container'>
                            <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' loading='lazy' />
                        </div>

                        <div className='info-container'>
                            <div className='username-status-container'>
                                <h1 className='username' onClick={openEditProfileModal}>{profileData.username}</h1>
                                {profileData.role === 'regular' ? '' :<FontAwesomeIcon className='crown-icon' icon={faCrown} />}
                                <Modal isOpen={editProfileModalIsOpen} onRequestClose={closeEditProfileModal} contentLabel="Standard Modal" style={modalStyles}>
                                    <h1 className='edit-profile-title'>Edit Profile</h1>
                                    <form className='edit-profile-form' onSubmit={handleSubmit}>
                                        <input type='text' placeholder='Username' className='edit-profile-username' value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                                        <input type='text' placeholder='Email' className='edit-profile-email' value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
                                        <button className='edit-profile-btn' type='submit'>Save</button>
                                    </form>
                                </Modal>
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
                            <div className='modal-payment-header'>
                                <h1 className='modal-payment-title'>Update to Pyppo Premium</h1>
                                <FontAwesomeIcon icon={faGem} className='modal-payment-icon'/>
                            </div>

                            <ul className='offers-container'>
                                {/* <li className='offer' style={{color:'#fff'}}>
                                    <FontAwesomeIcon icon={faCircleHalfStroke} className='payment-modal-icon'/>
                                    <span>Dark Mode / Light Mode switch</span>
                                </li> */}

                                <li className='offer' style={{color:'#fff'}}>
                                    <FontAwesomeIcon icon={faDoorOpen} className='payment-modal-icon'/>
                                    <span>Pyppo Room Live</span>
                                </li>

                                {/* <li className='offer' style={{color:'#fff'}}>
                                    <FontAwesomeIcon icon={faBots} className='payment-modal-icon'/>
                                    <span>Chat bot in pyppo room</span>
                                </li> */}
                            </ul>
                            <PayPalButton />
                        </Modal>
                        
                    </div>

                    <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                        <ProfilePlaylist />

                        <FavouritePlaylist/>

                        <FavouriteArtists />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
