import React, { useState, useEffect } from 'react';
import './UserProfile.css'
import axios from 'axios';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import Cookies from 'js-cookie';

const UserProfile = () => {
    const [profileData, setProfileData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:5000/cookies', { withCredentials: true });
                const response = await axios.get('http://127.0.0.1:5000/profile', { withCredentials: true });
                setProfileData(response.data.profile);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        console.log("Profile data: ", profileData);
    },[profileData])

    return (     
        <div>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className='profile-container'>
                    <div className='image-container'>
                        <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' loading='lazy' />
                    </div>

                    <div className='info-container'>
                        <h1 className='username'>{profileData.username}</h1>
                        <h3 className='user-role'>{profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)} User</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
