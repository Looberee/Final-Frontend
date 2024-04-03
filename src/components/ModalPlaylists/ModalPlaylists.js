import React, { useState, useEffect } from "react";
import axios from "axios";
import './ModalPlaylists.css';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { Link } from "react-router-dom"; // Import Link from React Router
import { usePlaylist } from "../../contexts/PlaylistContext";

const ModalPlaylists = ({ onAddToPlaylist }) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { playlistState } = usePlaylist();

    const fetchPlaylists = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:5000/personal/playlists', {
                withCredentials: true
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
                'http://localhost:5000/personal/playlists',
                {},
                {
                    withCredentials: true
                }
            );
            // After creating the playlist, refresh the playlists data
            fetchPlaylists();
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };

    const handleGetPlaylist = (myPlaylist) => {
        console.log("Playlist Id: ", myPlaylist.encode_id);
        onAddToPlaylist(myPlaylist.encode_id);
    };

    if (isLoading || error) {
        return (
            <div>
                <LoadingSpinner />
            </div>
        );
    }

    const playlistItems = data && data.user_playlists ? data.user_playlists.map((playlist, index) =>
        <li className='playlist-container' key={index}>
            <div className='playlist-info' onClick={() => handleGetPlaylist(playlist)}>
                <span className='name'>{playlist.name}</span>
                <span className='figure'>{playlist.tracks_count}</span>
            </div>
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

export default ModalPlaylists;

