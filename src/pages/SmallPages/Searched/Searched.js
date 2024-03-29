import React, { useState, useEffect, useMemo } from "react";
import './Searched.css';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faPlay, faPlus, faInfoCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import { useRecentTrack } from "../../../contexts/RecentTrackContext";
import Modal from "react-modal";
import PersonalPlaylists from "../../../components/PersonalPlaylists/PersonalPlaylists";
import ModalPlaylists from "../../../components/ModalPlaylists/ModalPlaylists";
import { usePlaylist } from "../../../contexts/PlaylistContext";

const customStyles = {
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #ccc',
        color: state.isSelected ? 'white' : 'black',
        background: state.isSelected ? '#007bff' : 'white',
        '&:hover': {
            background: state.isSelected ? '#007bff' : '#f0f0f0',
        },
    }),
    control: (provided) => ({
        ...provided,
        width: 200,
        borderRadius: 8,
        border: '1px solid #ced4da',
    }),
    menu: (provided) => ({
        ...provided,
        width: 200,
        borderRadius: 8,
        border: '1px solid #ced4da',
    }),
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
    padding: '20px'
    },
    overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: '1000'
    }
};

const Dropdown = ({ track }) => {
    const { togglePlaylist } = usePlaylist();
    const options = [
        { 
            value: 'option1', 
            label: (
                <span style={{ fontSize: 'small' }}>
                    <FontAwesomeIcon icon={faPlus} /> Add to my playlists
                </span>
            ),
            action: () => setIsModalOpen(true)
        },
        { 
            value: 'option2', 
            label: (
                <span style={{ fontSize: 'small' }}>
                    <FontAwesomeIcon icon={faInfoCircle} /> View track information
                </span>
            )
        },
        { 
            value: 'option3', 
            label: (
                <span style={{ fontSize: 'small' }}>
                    <FontAwesomeIcon icon={faUser} /> View artist information
                </span>
            )
        }
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
        console.log(`Adding song to playlist: ${playlistId}`);
        console.log("Track object: ", track.spotify_id);
    
        // Prepare the data to send in the request body
        const data = {
            playlist_id: playlistId,
            track_spotify_id: track.spotify_id // Assuming track object has an 'id' property
        };
    
        // Send a POST request to the Flask route using Axios
        try {
            const token = localStorage.getItem('token');
    
            // Send a POST request to the Flask route using Axios with authorization header
            const response = await axios.post(`http://127.0.0.1:5000/personal/playlists/${playlistId}/track/${track.spotify_id}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log('Response:', response.data);
            togglePlaylist();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error:', error);
            // Handle error if needed
        }
    };

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



const Searched = ({ searchValue, onTrackSelected }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const [hoveredTrack, setHoveredTrack] = useState(null);
    const [imageKey, setImageKey] = useState(Date.now());
    const [isOpen, setIsOpen] = useState(false);
    const { toggleRecentTrack } = useRecentTrack();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (searchValue) {
                    const spotifyAccessToken = localStorage.getItem('spotify_token');
                    const response = await axios.get(`http://127.0.0.1:5000/search?query=${searchValue}`, {
                    headers: {
                        Authorization: `Bearer ${spotifyAccessToken}`
                    }
                });
                    setSearchResults(response.data.search_results);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
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
        onTrackSelected(track);
        console.log(track);

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

    const handleAddTrack = (track) => {
        setIsOpen(!isOpen);
    };

    const memoizedSearchResults = useMemo(() => searchResults, [searchResults]);

    return (
        <div>
            <h1 className="searched-tracks-title">Based on what you searched</h1>

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
        </div>
    );
};

export default Searched;
