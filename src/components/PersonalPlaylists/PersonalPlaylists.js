import React, { useState, useEffect } from "react";
import axios from "axios";
import './PersonalPlaylists.css';
import './ProfilePlaylist.css';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { PlaylistLoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { Link } from "react-router-dom"; // Import Link from React Router
import { usePlaylist } from "../../contexts/PlaylistContext";

import { toast, Toaster } from 'react-hot-toast';


export const ProfilePlaylist = () => {
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        const getPlaylists = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8080/personal/playlists', {withCredentials : true})
                setPlaylists(response.data.user_playlists)
            }
            catch (err) {
                console.error("Fail to fetch playlists: ", err);
                toast.error("Something goes wrong, please try again")
            }
        }
        getPlaylists();
    },[])

    return (

        <div>
            {playlists.length > 0 ? 
            <div className="profile-playlist-container">
                <h1 className="profile-playlist-title">Personal Playlists</h1>

                <div className="profile-playlists-list-container">
                    <ul className="profile-playlists-list">
                    {playlists.map((playlist, index) => (
                        <Link to={`/personal/playlists/${playlist.encode_id}/tracks`} key={playlist.id} className="profile-playlist">
                            <div className="profile-playlist-cover">
                                <img className="profile-playlist-image" src="https://w.wallhaven.cc/full/m3/wallhaven-m3m5vy.jpg" loading="lazy" />
                            </div>
                            <div className="profile-playlist-info">
                                <h3>{playlist.name}</h3>
                            </div>
                        </Link>
                    ))}
                    </ul>
                </div>
            </div> : <div></div> }
        </div>
    )
}

const PersonalPlaylists = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { playlistState, togglePlaylist } = usePlaylist();
    const [ isTextActive , setIsTextActive] = useState(false);

    const fetchPlaylists = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/personal/playlists', {
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
            const response = await axios.post(
                'http://127.0.0.1:8080/personal/playlists',
                {},
                {
                    withCredentials: true
                }
            );
            toast.success(`${response.data.playlist_name} has been created succesfully!`)
            togglePlaylist();
        } catch (error) {
            console.error('Error creating playlist:', error);
            toast.error("Something goes wrong, please try again")
        }
    };

    const toggleTextActive = (encode_id) => {
        setIsTextActive(encode_id);
    }

    // if (isLoading || error) {
    //     return (
    //         <div>
    //             <PlaylistLoadingSpinner />
    //         </div>
    //     );
    // }

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

