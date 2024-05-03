import React, { useEffect, useState } from "react";
import './FavouriteArtists.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faHeart, faUser, faMusic, faClock, faCalendarDays, faPlay, faPause, faPenToSquare, faTrash, faCaretUp, faCaretDown, faUsers } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import { useParams, Link } from 'react-router-dom';
import axios from "axios";
import { useRecentTrack } from "../../contexts/RecentTrackContext";
import { useTrack } from "../../contexts/TrackContext";

const FavouriteArtistRow = ({ artist, artistOrder, profile }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPlayingActive, setIsPlayingActive] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    
    return (
        <div>
            <Link to={`/artist/${artist.artist_id}`} className='row'>
                <div className="col-info">
                    <div className="id-animation">
                        <span>#{artistOrder}</span>
                    </div>
                    <div className="favourite-artist-info">
                        <img className="favourite-artist-image" src={artist.spotify_image_url ? artist.spotify_image_url : ""}/>
                        <h3 className="favourite-artist-name">{artist.name ? artist.name : ""}</h3>
                    </div>
                </div>

                <div className="col-genre">
                    <FontAwesomeIcon icon={faMusic}/>
                    <span className="favourite-playlist-genre">{artist.genres == "" ? 'None' : artist.genres}</span>
                </div>

                <div className="col-followers">
                    <FontAwesomeIcon icon={faUsers}/>
                    <span className="favourite-artist-followers">{artist.followers == "" ? '0' : artist.followers} followers</span>
                </div>


            </Link>
        </div>
    );
}


const FavouriteArtists = () => {
    const [artists, setArtists] = useState([]);
    const { encode_id } = useParams();
    const { isTrackFavourite } = useTrack()
    const [profile, setProfile] = useState();
    const [isCollapse, setIsCollapse] = useState(false);


    useEffect(() => {
        const fetchFavouriteArtists = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8080/personal/favourites/artists`, {
                    withCredentials: true
                });
                console.log("Track from the specific playlist: ", response.data.favourite_artists);
                setArtists(response.data.favourite_artists); 
    
            } catch (error) {
                console.error('Error fetching playlist tracks:', error);
            }
        };
    
        fetchFavouriteArtists();
    }, [isTrackFavourite]);

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

    const handleCollapseList = () => {
        setIsCollapse(prevState => !prevState);
    }

    return (
        <div>
            {artists.length > 0 ? 
            <div className="favourite-artists-container">
                <div className="favourite-artists-wrapper">
                    <div className="favourite-artists-detail">
                        <h1 className="favourite-artists-name">Favourite Aritsts</h1>
                        <FontAwesomeIcon icon={isCollapse ? faCaretUp : faCaretDown } className="favourite-caret-up" onClick={handleCollapseList}/>
                    </div>
                </div>

                <div className={`favourite-artists ${!isCollapse ? 'collapsed' : '' }`}>
                    {artists && artists.length > 0 ? (
                        artists.map((artist, index) => (
                            <FavouriteArtistRow
                                key={artists.id}
                                playlist_encode_id = {encode_id}
                                artist={artist}
                                artistOrder={index + 1}
                                profile={profile}
                            />
                        ))
                    ) : (
                        <div style={{color:'#fff'}}>No artists found</div>
                    )}
                </div>
            </div> : <div></div> }
        </div>
    );
}

export default FavouriteArtists;
