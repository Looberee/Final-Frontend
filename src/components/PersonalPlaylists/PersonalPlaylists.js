import React, { useState, useEffect } from "react";
import axios from "axios";
import './PersonalPlaylists.css';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { Link } from "react-router-dom"; // Import Link from React Router
import { usePlaylist } from "../../contexts/PlaylistContext";

const PersonalPlaylists = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { playlistState } = usePlaylist();
    const [ isTextActive , setIsTextActive] = useState(false);

    const fetchPlaylists = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:5000/personal/playlists', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setData(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, [playlistState]);

    const handleCreatePlaylist = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://127.0.0.1:5000/personal/playlists',
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            // After creating the playlist, refresh the playlists data
            fetchPlaylists();
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };

    const toggleTextActive = (encode_id) => {
        setIsTextActive(encode_id);
    }

    if (isLoading || error) {
        return (
            <div>
                <LoadingSpinner />
            </div>
        );
    }

    const playlistItems = data && data.user_playlists ? data.user_playlists.map((playlist, index) =>
        <li className='playlist-container' key={index}>
            {/* Use Link component instead of anchor tag */}
            <Link to={`/personal/playlists/${playlist.encode_id}/tracks`} className='playlist-info' onClick={() => toggleTextActive(playlist.encode_id)}>
                <span className={`name ${isTextActive === playlist.encode_id ? 'active' : ''}`}>{playlist.name}</span>
                <span className={`figure ${isTextActive === playlist.encode_id ? 'active' : ''}`}>{playlist.tracks_count}</span>
            </Link>
        </li>
    ) : null;

    return (
        <div>
            <ul className='playlists'>
                {playlistItems}
                <span className='create-playlist' onClick={handleCreatePlaylist}>+Create new playlist</span>
            </ul>
        </div>
    );
};

export default PersonalPlaylists;

