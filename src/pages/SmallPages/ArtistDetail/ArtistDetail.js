import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ArtistDetail.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Albums from '../../../components/Recommendation/Albums/Albums';

const ArtistDetail = () => {

    const { artist_id } = useParams();
    const [isFavouriteArtist, setIsFavouriteArtist] = useState(false);
    const [artist, setArtist ] = useState('');
    const [artistTopTracks, setArtistTopTracks] = useState([]);

    useEffect(() => {
        const fetchArtistDetail = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/artist/${artist_id}`);
                console.log(response.data);
                setArtist(response.data);
            } 
            catch (error) {
                console.error('Error fetching artist detail:', error);
            }
        }

        fetchArtistDetail();
    },[isFavouriteArtist]);

    useEffect(() => {
        const fetchArtistTopTracks = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/artist/${artist_id}/top-tracks`);
                console.log(response.data);
                setArtistTopTracks(response.data);
            }
            catch (err) {
                console.error('Error fetching artist top tracks:', err);
            }
        }


        fetchArtistTopTracks();
    },[])

    const handleAddFavouriteArtist = (artist) => {
        console.log(isFavouriteArtist)
        setIsFavouriteArtist(!isFavouriteArtist);
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
                        <FontAwesomeIcon className={`heart-icon ${isFavouriteArtist ? 'active' : ''}`}  icon={faHeart} onClick={() => handleAddFavouriteArtist(artist)}/>
                    </div>
                </div>               
            </div>

            <Albums title={`Top Tracks`} tracks={artistTopTracks} />
        </div>
    );
};

export default ArtistDetail;