import React, { useState, useEffect, useMemo } from "react";
import './Searched.css';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faPlay, faPlus, faInfoCircle, faUser, faHeadphonesSimple, faHeart } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import { useRecentTrack } from "../../../contexts/RecentTrackContext";
import Modal from "react-modal";
import PersonalPlaylists from "../../../components/PersonalPlaylists/PersonalPlaylists";
import ModalPlaylists from "../../../components/ModalPlaylists/ModalPlaylists";
import { usePlaylist } from "../../../contexts/PlaylistContext";
import { useTrack } from "../../../contexts/TrackContext";
import UnauthorizedModal from "../../../components/Modal/AlertModals/UnauthorizedModal";
import { useAuth } from "../../../contexts/AuthContext";
import { useModal } from "../../../contexts/ModalContext";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner"; // Import loading spinner component
import { Artist } from "../Artists/Artists";
import { toast } from "react-hot-toast";

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

const Dropdown = ({ track }) => {
    const { togglePlaylist } = usePlaylist();
    const { waitingList, addToWaitingList } = useTrack();
    const options = [
        { 
            value: 'option1', 
            label: (
                <span style={{ fontSize: 'small' }} className="dropdown-option">
                    <FontAwesomeIcon icon={faPlus} /> Add to my playlists
                </span>
            ),
            action: () => setIsModalOpen(true)
        },
        { 
            value: 'option2', 
            label: (
                <span style={{ fontSize: 'small' }} className="dropdown-option">
                    <FontAwesomeIcon icon={faHeadphonesSimple} /> Add to list for next track
                </span>
            ),
            action : () => handleAddToWaitingList(track) 
        },
        { 
            value: 'option3', 
            label: (
                <span style={{ fontSize: 'small' }} className="dropdown-option">
                    <FontAwesomeIcon icon={faHeart} /> Add to favourites
                </span>
            ),
            action : () => handleAddToFavourites(track) 
        },
    ];

    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOptionClick = (option) => {
        setIsOpen(false);
        if (option.action) {
            option.action();
        }
    };

    const handleGetPlaylist = async (playlistId) => {
        // Prepare the data to send in the request body
        const data = {
            playlist_id: playlistId,
            track_spotify_id: track.spotify_id // Assuming track object has an 'id' property
        };
    
        // Send a POST request to the Flask route using Axios
        try {
            const response = await axios.post(`http://127.0.0.1:8080/personal/playlists/${playlistId}/track/${track.spotify_id}`, data, {
                withCredentials: true
            });
            toast.success("A track has been added to your playlist!")
            togglePlaylist();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error:', error);
            toast.error("You are adding the same track in the same playlist!");
        }
    };

    const handleAddToWaitingList = (track) => {
        toast.success(`${track.name} has been added to your waiting list`);
        addToWaitingList(track);

    }

    const handleAddToFavourites = async (track) => {
        try
        {
            const response = await axios.post('http://127.0.0.1:8080/personal/favourites/track', 
            { 'spotify_id' : track.spotify_id }, 
            { withCredentials : true });
            toast.success(`${track.name} has been added to your favourites`);
        }
        catch (error)
        {
            toast.error(`${track.name} has already been in your favourites`);
            console.error('Failed to add track to favourites:', error);
        }
    }

    return (
        <div className="dropdown">
            <div className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
                <FontAwesomeIcon className="" icon={faEllipsisVertical} />
            </div>
            {isOpen && (
                <div className="dropdown-menu">
                    <ul>
                        {options.map(option => (
                            <li key={option.value} onClick={() => handleOptionClick(option)}>
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)} // Close modal when clicking outside or pressing Esc
                contentLabel="Example Modal"
                style={modalStyles} // Accessible label for screen readers
            >
                <ModalPlaylists onAddToPlaylist={handleGetPlaylist}/>
            </Modal>
        </div>
    );
};

const Searched = ({ searchValue }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [artistResults, setArtistResults] = useState([]);
    const [loading, setLoading] = useState(false); // Add loading state
    const [error, setError] = useState(null);
    const [hoveredTrack, setHoveredTrack] = useState(null);
    const [imageKey, setImageKey] = useState(Date.now());
    const [isOpen, setIsOpen] = useState(false);
    const { toggleRecentTrack } = useRecentTrack();
    const { pyppoTrack, setPyppoTrack,  isPlaying, setIsPlaying } = useTrack();
    const { alreadyAuth } = useAuth();
    const { openModal } = useModal();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Set loading to true when fetching data
                if (searchValue) {
                    const spotifyAccessToken = localStorage.getItem('spotify_token');
                    const response = await axios.get(`http://127.0.0.1:8080/search?query=${searchValue}`, {
                        withCredentials: true
                });
                    setSearchResults(response.data.search_results);
                    setArtistResults(response.data.artists_results);
                } else {
                    setSearchResults([]);
                }
                setLoading(false); // Set loading to false after fetching data
            } catch (error) {
                setLoading(false); // Set loading to false if there's an error
                setError(error.message);
            }
        };

        fetchData();
        
    }, [searchValue]);

    const handleMouseEnter = (index) => {
        setHoveredTrack(index);
    };

    const handleMouseLeave = () => {
        setHoveredTrack(null);
    };

    const generateImageKey = () => {
        setImageKey(Date.now());
    };

    const handleTrackSelected = async (track) => {
        if (alreadyAuth)
        {
            setPyppoTrack(track);
            toggleRecentTrack();
        }
        else
        {
            openModal('unauthorizedModal')
        }

    };

    const memoizedSearchResults = useMemo(() => searchResults, [searchResults]);
    
    // Calculate the number of loading spinners to show
    const numLoadingSpinners = Math.min(6, loading ? 6 - memoizedSearchResults.length : 0);

    return (
        <div>
            {!loading ? <h1 className="searched-tracks-title">Based on what you searched</h1> : <div></div>}

            {loading ? ( // Render loading spinners if loading is true
                Array.from({ length: numLoadingSpinners }, (_, index) => (
                    <div style={{display:'inline-flex', marginLeft: '20px'}}><LoadingSpinner key={index} /></div>

                ))
            ) : (
                <ul className="searched-tracks-list">
                    {memoizedSearchResults.map((track, index) => (
                        <li className="searched-track" key={track.id}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            onDoubleClick={() => handleTrackSelected(track)}
                            >
                            <div className="searched-cover">
                                <img className="searched-track-image" src={track.spotify_image_url} loading="lazy" key={`${track.id}-${imageKey}`} onLoad={generateImageKey}/>
                                {hoveredTrack === index && (
                                    <div className="play-button" onClick={() => handleTrackSelected(track)}>
                                        <FontAwesomeIcon icon={faPlay} className="searched-track-play" />
                                    </div>
                                )}
                            </div>

                            <div className="searched-track-info">
                                <h3>{track.name}</h3>
                                <p>{track.artists}</p>
                                {hoveredTrack === index && (
                                    <div className="setting-button">
                                        <Dropdown track={track} isOpen={isOpen} setIsOpen={setIsOpen}/>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <UnauthorizedModal />

            <Artist title="Artists" genre="Artist" fetched_artists={artistResults} />

        </div>
    );
};

export default Searched;
