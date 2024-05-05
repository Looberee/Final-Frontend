import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ArtistDetail.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Albums from '../../../components/Recommendation/Albums/Albums';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';

const ArtistDetail = () => {

    const { artist_id } = useParams();
    const [isFavouriteArtist, setIsFavouriteArtist] = useState(false);
    const [artist, setArtist ] = useState('');
    const [artistTopTracks, setArtistTopTracks] = useState([]);
    const { alreadyAuth } = useAuth();

    useEffect(() => {
        const fetchArtistDetail = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8080/artists/${artist_id}`);
                console.log(response.data);
                setArtist(response.data);
            } 
            catch (error) {
                console.error('Error fetching artist detail:', error);
            }
        }

        fetchArtistDetail();
    },[isFavouriteArtist, artist_id]);

    useEffect(() => {
        const fetchArtistTopTracks = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8080/artists/${artist_id}/top-tracks`);
                console.log(response.data);
                setArtistTopTracks(response.data);
            }
            catch (err) {
                console.error('Error fetching artist top tracks:', err);
            }
        }


        fetchArtistTopTracks();
    },[artist_id])

    useEffect(() => {
        const checkFavouriteArtist = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8080/personal/favourites/artists/check', {
                    "artist_id": artist_id
                }
                , { withCredentials: true })
                setIsFavouriteArtist(response.data.favourite);
                console.log("Favourited: ", response.data);
                
            }
            catch (error) {
                console.error('Error checking favourite artist:', error);
            }
        }

        checkFavouriteArtist();
    },[isFavouriteArtist])

    const handleToggleFavouriteArtist = () => {
        console.log(isFavouriteArtist)
        if (!isFavouriteArtist)
        {
            handleAddFavouriteArtist();
            setIsFavouriteArtist(true);
        }
        else {
            handleRemoveFavoriteArtist();
            setIsFavouriteArtist(false);
        }
    }

    const handleAddFavouriteArtist = async () => {
        try {
            const response = await axios.post(
                'http://127.0.0.1:8080/personal/favourites/artists', 
                {"artist_id": artist_id}, 
                {withCredentials: true}
            )
            console.log(response.data.message)
            toast.success("Artist has been added to your favourites!")
        }
        catch (error) {
            toast.error("You must login!")
            setIsFavouriteArtist(false);
            console.error('Error adding favourite artist:', error);
        }
    }

    const handleRemoveFavoriteArtist = async () => {
        try {
            const response = await axios.delete(
                'http://127.0.0.1:8080/personal/favourites/artists',
                {
                    data: { "artist_id" : artist_id },
                    withCredentials : true
                }
            )
            console.log(response.data.message)
            toast.success("Artist has been removed from your favourites!")
        }
        catch (err) {
            toast.error("You must login!")
            setIsFavouriteArtist(false);
            console.error('Error removing favourite artist:', err);
        };
    }

    return (
        <div>
            <div className='artist-profile-container'>
                <div className='artist-image-container'>
                    <img src={artist ? artist.image : ""} loading='lazy' />
                </div>

                <div className='artist-info-container'>
                    <div className='artist-status-container'>
                        <h1 className='artist-name'>{artist ? artist.name : "Artist"}</h1>

                    </div>

                    <div className='artist-status-container'>
                        <h3 className='artist-followers'>{artist ? artist.followers : "0"} followers</h3>
                        <FontAwesomeIcon className={`heart-icon ${isFavouriteArtist && alreadyAuth ? 'active' : ''}`}  icon={faHeart} onClick={handleToggleFavouriteArtist}/>
                    </div>
                </div>               
            </div>

            <Albums title={`Top Tracks`} tracks={artistTopTracks} />
        </div>
    );
};

export default ArtistDetail;