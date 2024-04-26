import React, { useEffect, useState } from "react";
import './UserPlaylist.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faHeart, faUser, faMusic, faClock, faCalendarDays, faPlay, faPause, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { usePlaylist } from "../../../contexts/PlaylistContext";
import { useRecentTrack } from "../../../contexts/RecentTrackContext";
import { useTrack } from "../../../contexts/TrackContext";
import { useModal } from "../../../contexts/ModalContext";
import EditPlaylistModal from "../../../components/Modal/StandardModals/EditPlaylistModal";
import toast from "react-hot-toast";

const TrackRow = ({ track, trackOrder, playlist_encode_id }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPlayingActive, setIsPlayingActive] = useState(false);
    const [isFavourited, setIsFavourited] = useState(false);
    const { playlistState, togglePlaylist } = usePlaylist();
    const { toggleRecentTrack } = useRecentTrack();
    const { setPyppoTrack, setIsPlaying } = useTrack();
    const [profile, setProfile] = useState();

    useEffect(() => {
        if (track.is_favourite)
        {
            setIsFavourited(true)
        }
        else {
            setIsFavourited(false)
        }
    },[])

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
                const response = await axios.get('http://127.0.0.1:8080/profile', { withCredentials: true });
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
    

    const handleDeleteTrackInPlaylist = async (track) => {
        try {
            const response = await axios.delete(
                `http://127.0.0.1:8080/personal/playlists/${playlist_encode_id}/track/${track.id}`,
                {
                    withCredentials: true
                }
            );
            console.log('Track deleted successfully:', response.data);
            togglePlaylist();
            toast.success("The track has been removed from the current playlist!")
        } catch (error) {
            console.error('Error deleting track:', error);
            toast.error("Failed to remove the track from the current playlist!")
        }
    };

    const handleAddToFavourites = async (track) => {
        try
        {
            const response = await axios.post('http://127.0.0.1:8080/personal/favourites/track', 
            { 'spotify_id' : track.spotify_id }, 
            { withCredentials : true });
            console.log('Message : ', response.data.message)
            toast.success("The track has been added to the favorite list!")
        }
        catch (error)
        {
            console.error('Failed to add track to favourites:', error);
            toast.error("Failed to add track to favourites list!")
        }
    }

    const handleRemoveFromFavourites = async (track) => {
        try {
            const response = await axios.delete('http://127.0.0.1:8080/personal/favourites/track', {
                data: { 'spotify_id' : track.spotify_id },
                withCredentials: true
            });
            console.log('Message : ', response.data.message)
            toast.success("The track has been removed from the favorite list!")
        }
        catch (err) {
            console.error('Failed to remove track from favourites:', err)
            toast.error("Failed to remove track from favourites list!")
        }
    }


    const toggleFavourite = (track) => {
        setIsFavourited(prevState => !prevState);
        if (track)
        {
            if (!isFavourited)
            {
                handleAddToFavourites(track);
            }
            else
            {
                handleRemoveFromFavourites(track);
            }
        }
        else
        {
            console.log("Something wrong here")
        }
    };

    return (
        <div>
            <div className={`row ${isHovered ? 'hovered' : ''} ${isPlayingActive ? 'pause' : 'play'}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="col-info">
                    <div className="id-animation">
                        <span>#{trackOrder}</span>
                        <FontAwesomeIcon className={`user-playlist-play-button ${isPlayingActive ? 'pause' : 'play'}`} icon={isPlayingActive ? faPause : faPlay} onClick={handleTrackSelected} />
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
                    <span className="user-playlist-owner">{profile ? profile.username : "User"}</span>
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
                    <FontAwesomeIcon className={`user-playlist-favourite ${isFavourited ? 'active' : ''}`} icon={faHeart} onClick={() => toggleFavourite(track)}/>
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
    const { openModal } = useModal();
    const { isTrackFavourite, setIsTrackFavourite } = useTrack();
    const [favouriteTracks, setFavouriteTracks] = useState([]);

    useEffect(() => {
        const fetchPlaylistTracks = async () => {
            try {
                // Fetch playlist tracks from the server
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://127.0.0.1:8080/personal/playlists/${encode_id}/tracks`, {
                    withCredentials: true
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
                'http://127.0.0.1:8080/personal/playlists',
                { encode_id: encode_id, new_name: name }, // Send encode_id and new_name in the request body
                {
                    withCredentials: true
                }
            );
            console.log('Playlist name updated successfully:', response.data);
            setPlaylistName(name); // Update the local state with the new name
            setIsEditModalOpen(false);
            togglePlaylist();
            toast.success("Playlist name updated successfully!")
        } catch (error) {
            console.error('Error updating playlist name:', error);
        }
    };

    const handleDeletePlaylist = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                'http://127.0.0.1:8080/personal/playlists', // Correct endpoint
                {
                    withCredentials: true,
                    data: { encode_id: encode_id } // Pass encode_id in the request body
                }
            );
            console.log('Playlist deleted successfully:', response.data);
            setIsDeleteModalOpen(false);
            togglePlaylist();
            toast.success("Playlist deleted successfully!")
        } catch (error) {
            console.error('Error deleting playlist:', error);
        }
    };

    return (
        <div className="user-playlist-container">
            <div className="user-playlist-wrapper">
                <div className="user-playlist-detail">
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
                        <EditPlaylistModal />
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
                            trackOrder={index + 1} // Pass function to toggle favourite state
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
