import React, { useState, useEffect } from 'react';
import './UserProfile.css'
import axios from 'axios';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';


const UserProfile = () => {
    const [profileData, setProfileData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming you stored the token in local storage
                const response = await axios.get('http://localhost:5000/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('User profile data:', response.data);
                setProfileData(response.data);
                setIsLoading(false);

                console.log(profileData);
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
