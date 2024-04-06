import React, { useEffect, useState } from "react";
import './FavouritePlaylist.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faHeart, faUser, faMusic, faClock, faCalendarDays, faPlay, faPause, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useRecentTrack } from "../../contexts/RecentTrackContext";
import { useTrack } from "../../contexts/TrackContext";

const FavouriteTrackRow = ({ track, trackOrder }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPlayingActive, setIsPlayingActive] = useState(false);
    const [isFavourited, setIsFavourited] = useState(false);
    const { toggleRecentTrack } = useRecentTrack();
    const { setPyppoTrack, setIsPlaying } = useTrack();
    const [profile, setProfile] = useState();

    const toggleFavourites = () => {
        setIsFavourited(prevState => !prevState);
    }

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleTrackSelected = async () => {
        setPyppoTrack(track);
        toggleRecentTrack();
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/profile', { withCredentials: true });
                setProfile(response.data.profile);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const formatReleaseDate = (releaseDate) => {
        const date = new Date(releaseDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}/${month}/${year}`;
    };
    
    return (
        <div>
            <div className={`row ${isHovered ? 'hovered' : ''} ${isPlayingActive ? 'pause' : 'play'}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="col-info">
                    <div className="id-animation">
                        <span>#{trackOrder}</span>
                        <FontAwesomeIcon className={`favourite-playlist-play-button ${isPlayingActive ? 'pause' : 'play'}`} icon={isPlayingActive ? faPause : faPlay} onClick={handleTrackSelected} />
                    </div>
                    <div className="favourite-playlist-info">
                        <img className="track-image" src={track.spotify_image_url} alt={track.name} />
                        <div className="track-info">
                            <h3 className="favourite-playlist-track-name">{track.name}</h3>
                            <p className="favourite-playlist-track-artist">{track.artists}</p>
                        </div>
                    </div>
                </div>

                <div className="col-name">
                    <FontAwesomeIcon icon={faUser}/>
                    <span className="favourite-playlist-owner">{profile ? profile.username : "User"}</span>
                </div>

                <div className="col-genre">
                    <FontAwesomeIcon icon={faMusic}/>
                    <span className="favourite-playlist-genre">{track.genres == "" ? 'None' : track.genres}</span>
                </div>

                <div className="col-duration">
                    <FontAwesomeIcon icon={faClock}/>
                    <span className="favourite-playlist-duration">{formatTime(track.duration / 1000)}</span>
                </div>

                <div className="col-release">
                    <FontAwesomeIcon icon={faCalendarDays}/>
                    <span className="favourite-playlist-release">{formatReleaseDate(track.release_date)}</span>
                </div>

                {/* <div className="col-settings">
                    <FontAwesomeIcon className={`favourite-playlist-favourite ${isFavourited ? 'active' : ''}`} icon={faHeart} onClick={toggleFavourites}/>
                    <FontAwesomeIcon className="favourite-playlist-setting" icon={faTrash}/>
                </div> */}

            </div>
        </div>
    );
}


const FavouritePlaylist = ({onTrackSelected}) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [playlistTracks, setPlaylistTracks] = useState([]);
    const { encode_id } = useParams();


    useEffect(() => {
        const fetchPlaylistTracks = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/personal/favourites/tracks`, {
                    withCredentials: true
                });
                console.log("Track from the specific playlist: ", response.data.favourite_tracks);
                setPlaylistTracks(response.data.favourite_tracks); 
    
            } catch (error) {
                console.error('Error fetching playlist tracks:', error);
            }
        };
    
        fetchPlaylistTracks();
    }, []);


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
        padding: '20px'
        },
        overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: '1000'
        }
    };

    return (
        <div className="favourite-playlist-container">
            <div className="favourite-playlist-wrapper">
                <div className="favourite-playlist-detail">
                    <h1 className="favourite-playlist-name">Favourite Tracks</h1>
                </div>
            </div>

            <div className="tracks-in-playlist">
                {playlistTracks && playlistTracks.length > 0 ? (
                    playlistTracks.map((track, index) => (
                        <FavouriteTrackRow
                            key={track.id}
                            playlist_encode_id = {encode_id}
                            track={track}
                            trackOrder={index + 1}
                        />
                    ))
                ) : (
                    <div style={{color:'#fff'}}>No tracks found</div>
                )}
            </div>
        </div>
    );
}

export default FavouritePlaylist;
