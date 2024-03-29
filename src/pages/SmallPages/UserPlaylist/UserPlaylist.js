import React, { useEffect, useState } from "react";
import './UserPlaylist.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faHeart, faUser, faMusic, faClock, faCalendarDays, faPlay, faPause, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { usePlaylist } from "../../../contexts/PlaylistContext";
import { useRecentTrack } from "../../../contexts/RecentTrackContext";

const TrackRow = ({ track, trackOrder, onTrackSelected, playlist_encode_id }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFavourited, setIsFavourited] = useState(false);
    const { playlistState, togglePlaylist } = usePlaylist();
    const { toggleRecentTrack } = useRecentTrack();

    const toggleFavourites = () => {
        setIsFavourited(prevState => !prevState);
    }

    const togglePlay = () => {
        setIsPlaying(prevState => !prevState);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleTrackSelected = async () => {
        onTrackSelected(track);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://127.0.0.1:5000/personal/recent/tracks', {
                'spotify_id' : track.spotify_id,
                'played_at' : Date.now()
            }, {
                headers: {
                    'Authorization': `Bearer ${token}` // Include Bearer token in the request headers
                }
            });

            console.log(response.data); // Log the response from the Flask route
            toggleRecentTrack();

        } catch (error) {
            console.log(track.spotify_id)
            console.error('Error adding recent track:', error);
        }

        try
        {
            const token = localStorage.getItem('token');
            const trackUri = 'spotify:track:' + track.spotify_id
            console.log(trackUri);
            const response = await axios.post('http://127.0.0.1:5000/playback/play' , { trackUri }, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            console.log(response.data.message)
        }
        catch (error)   
        {
            console.error('Error adding recent track:', error);
        }

    };
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
    

    const handleDeleteTrackInPlaylist = async (track) => {
        try {
            console.log("Hello:", playlist_encode_id, "and: ", track);
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `http://127.0.0.1:5000/personal/playlists/${playlist_encode_id}/track/${track.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Track deleted successfully:', response.data);
            togglePlaylist();
        } catch (error) {
            console.error('Error deleting track:', error);
        }
    };
    


    return (
        <div>
            <div className={`row ${isHovered ? 'hovered' : ''} ${isPlaying ? 'pause' : 'play'}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="col-info">
                    <div className="id-animation" onClick={togglePlay}>
                        <span>#{trackOrder}</span>
                        <FontAwesomeIcon className={`user-playlist-play-button ${isPlaying ? 'pause' : 'play'}`} icon={isPlaying ? faPause : faPlay} onClick={handleTrackSelected}/>
                    </div>
                    <div className="user-playlist-info">
                        <img className="track-image" src={track.spotify_image_url} alt={track.name} />
                        <div className="track-info">
                            <h3 className="user-playlist-track-name">{track.name}</h3>
                            <p className="user-playlist-track-artist">{track.artists}</p>
                        </div>
                    </div>
                </div>

                <div className="col-name">
                    <FontAwesomeIcon icon={faUser}/>
                    <span className="user-playlist-owner">Dennis</span>
                </div>

                <div className="col-genre">
                    <FontAwesomeIcon icon={faMusic}/>
                    <span className="user-playlist-genre">{track.genres == "" ? 'None' : track.genres}</span>
                </div>

                <div className="col-duration">
                    <FontAwesomeIcon icon={faClock}/>
                    <span className="user-playlist-duration">{formatTime(track.duration / 1000)}</span>
                </div>

                <div className="col-release">
                    <FontAwesomeIcon icon={faCalendarDays}/>
                    <span className="user-playlist-release">{formatReleaseDate(track.release_date)}</span>
                </div>

                <div className="col-settings">
                    <FontAwesomeIcon className={`user-playlist-favourite ${isFavourited ? 'active' : ''}`} icon={faHeart} onClick={toggleFavourites}/>
                    <FontAwesomeIcon className="user-playlist-setting" icon={faTrash} onClick={() => handleDeleteTrackInPlaylist(track)}/>
                </div>

            </div>
        </div>
    );
}


const UserPlaylist = ({onTrackSelected}) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [playlistName, setPlaylistName] = useState();
    const [playlistTracks, setPlaylistTracks] = useState();
    const { encode_id } = useParams();
    const { playlistState, togglePlaylist } = usePlaylist();

    useEffect(() => {
        const fetchPlaylistTracks = async () => {
            try {
                // Fetch playlist tracks from the server
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://127.0.0.1:5000/personal/playlists/${encode_id}/tracks`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Replace token with your actual token value
                    }
                });
                console.log("Track from the specific playlist: ", response.data.playlist.tracks);
                setPlaylistTracks(response.data.playlist.tracks);
                setPlaylistName(response.data.playlist.name);
    
            } catch (error) {
                console.error('Error fetching playlist tracks:', error);
            }
        };
    
        if (encode_id) {
            fetchPlaylistTracks();
        }
    }, [encode_id, playlistState]);


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

    const openEditModal = () => {
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const getNewName = async (name) => {
        try {
            console.log("This is the name: " + name)
            const token = localStorage.getItem('token');
            const response = await axios.put(
                'http://127.0.0.1:5000/personal/playlists',
                { encode_id: encode_id, new_name: name }, // Send encode_id and new_name in the request body
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Playlist name updated successfully:', response.data);
            setPlaylistName(name); // Update the local state with the new name
            setIsEditModalOpen(false);
            togglePlaylist();
        } catch (error) {
            console.error('Error updating playlist name:', error);
        }
    };

    const handleDeletePlaylist = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                'http://127.0.0.1:5000/personal/playlists', // Correct endpoint
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    data: { encode_id: encode_id } // Pass encode_id in the request body
                }
            );
            console.log('Playlist deleted successfully:', response.data);
            setIsDeleteModalOpen(false);
            togglePlaylist();
        } catch (error) {
            console.error('Error deleting playlist:', error);
        }
    };
    
    const handleTrackSelected = (track) => {
        onTrackSelected(track);
    };
    

    return (
        <div className="user-playlist-container">
            <div className="user-playlist-wrapper">
                <div className="user-playlist-detail">
                    <img className="user-playlist-image" src="https://i.scdn.co/image/ab67616d00001e02c2504e80ba2f258697ab2954"/>
                    <h1 className="user-playlist-name">{playlistName}</h1>
                    <div className="user-playlist-ed-btn">
                        <FontAwesomeIcon className="user-playlist-edit" icon={faPenToSquare} onClick={openEditModal}/>
                        <Modal 
                        isOpen={isEditModalOpen}
                        onRequestClose={closeEditModal}
                        contentLabel="Edit Playlist Modal"
                        style={modalStyles}>
                        <div className="modal-nameEdit-container">
                            <h2>Edit name of the playlist</h2>
                            <div className="user-playlist-nameEdit-container">
                                <input type="text" value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} />
                                <button onClick={() => getNewName(playlistName)}>Done</button>
                            </div>
                        </div>
                        </Modal>
                        <FontAwesomeIcon className="user-playlist-delete" icon={faTrash} onClick={openDeleteModal}/>
                        <Modal 
                        isOpen={isDeleteModalOpen}
                        onRequestClose={closeDeleteModal}
                        contentLabel="Delete Playlist Modal"
                        style={modalStyles}>
                        <div className="modal-nameEdit-container">
                            <h2>Are you sure want to delete this playlist</h2>
                            <div className="user-playlist-nameEdit-container">
                                <button onClick={closeDeleteModal}>No</button>
                                <button onClick={handleDeletePlaylist}>Yes</button>
                            </div>
                        </div>
                        </Modal>
                    </div>
                </div>
            </div>

            <div className="tracks-in-playlist">
                {playlistTracks && playlistTracks.length > 0 ? (
                    playlistTracks.map((track, index) => (
                        <TrackRow
                            key={track.id}
                            playlist_encode_id = {encode_id}
                            track={track}
                            trackOrder={index + 1}
                            onTrackSelected={handleTrackSelected}
                        />
                    ))
                ) : (
                    <div style={{color:'#fff'}}>No tracks found</div>
                )}
            </div>
        </div>
    );
}

export default UserPlaylist;