import React, { useState, useEffect } from 'react';
import './CustomSidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMusic, faUser, faHeadphonesSimple, faDoorOpen, faSun, faMoon, faRightFromBracket, faBookmark, faMicrophoneLines, faBuildingUser, faUsers, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import PersonalPlaylists from '../PersonalPlaylists/PersonalPlaylists';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRecentTrack } from '../../contexts/RecentTrackContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTrack } from '../../contexts/TrackContext';
import { Link } from 'react-router-dom';
import { useRoom } from '../../contexts/RoomContext';
import { isElement } from 'lodash';
import RoomOptions from '../RoomOptions/RoomOptions';
import { useModal } from '../../contexts/ModalContext';
import UnauthorizedModal from '../../components/Modal/AlertModals/UnauthorizedModal';
import { useDarkTheme } from '../../contexts/DarkThemeContext';
import toast from 'react-hot-toast';


const CustomSidebar = () => {
    const [storedPlaylists, setStoredPlaylists] = useState([]);
    const [fiveFavouriteArtists, setFiveFavouriteArtists] = useState([]);
    const [recentTracks, setRecentTracks] = useState([]);
    const [activeItem, setActiveItem] = useState('home'); // Initialize activeItem with 'home'
    const [activeExtraItem, setActiveExtraItem] = useState('moon');
    const { recentTrackState, toggleRecentTrack } = useRecentTrack();
    const navigate = useNavigate();
    const { logout, isAuthenticated, alreadyAuth } = useAuth();
    const { setPyppoTrack, setToggleDuplicate } = useTrack();
    const { roomState, setRoomState } = useRoom();
    const { openModal } = useModal();
    const { toggleDarkMode } = useDarkTheme();


    const sidebarItems = [
        { id: 'home', icon: faHome },
        { id: 'user', icon: faUser },
        { id: 'headphones', icon: faHeadphonesSimple },
        { id: 'door', icon: faDoorOpen },
    ];

    const extraSidebarItems = [
        // { id: 'moon', icon: faMoon },
        // { id: 'sun', icon: faSun },
        { id: 'rightFromBracket', icon: faRightFromBracket },
        { id : 'circleUser', icon: faCircleUser, link: '/login'}
    ];

    const menuOptions = [
        { label: 'Home', link: '/' },
        { label: 'Tracks', link: '/tracks' },
        { label: 'Artists', link: '/artists' },
        { label: 'Genres', link: '/genres' },
    ];

    const handleClick = async (item) => {
        setActiveItem(item);

        if (item === 'rightFromBracket') {
            setRoomState(false);
            logout();
        }
        else if ( item === 'user')
        {
            if (alreadyAuth)
            {
                setRoomState(false);
                navigate('/personal/profile');
            }
            else
            {  
                setActiveItem(false)
                handleOpenUnauthorized();
            }

        }
        else if ( item === 'home')
        {
            setRoomState(false);
            navigate('/');
            
        }
        else if ( item === 'headphones')
        {
            if (alreadyAuth)
            {
                setRoomState(false);
                navigate('/waiting/tracks');
            }
            else
            {
                setActiveItem(false)
                handleOpenUnauthorized();
            }
        }
        else if ( item == 'door')
        {
            if (alreadyAuth)
            {
                const res = await axios.get('http://127.0.0.1:8080/profile', {withCredentials : true})
                if (res.data.profile.role == 'premium')
                    {
                        navigate('/room');
                        setRoomState(true);
                    }
                else {
                    toast.error("You need to be a premium user to access this feature!")
                }

            }
            else
            {
                setActiveItem(false)
                handleOpenUnauthorized();
            }
        }
        else if (item === 'moon') {
            if (alreadyAuth) {
                setRoomState(false);
                setActiveExtraItem('moon');
                toggleDarkMode(); // Add this line
            } else {
                setActiveItem(false);
                setActiveExtraItem(false);
                handleOpenUnauthorized();
            }
        }
        else if (item === 'sun') {
            if (alreadyAuth) {
                setRoomState(false);
                setActiveExtraItem('sun');
                toggleDarkMode(); // Add this line
            } else {
                setActiveItem(false);
                setActiveExtraItem(false);
                handleOpenUnauthorized();
            }
        }

    };

    const handleOpenUnauthorized = () => {
        openModal('unauthorizedModal');
    }

    useEffect(() => {
        setActiveItem('moon')
    },[])

    useEffect(() => {
        const handleGetArtists = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8080/personal/favourites/artists/random', { withCredentials : true})
                console.log(response.data.favorite_artists)
                setFiveFavouriteArtists(response.data.favorite_artists);
            }
            catch (err) {
                console.error('Error fetching favourite artists:', err);
            }
            
        }

        handleGetArtists();
    },[])

    useEffect(() => {
        // Fetch recent tracks when component mounts
        const fetchRecentTracks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8080/personal/recent/tracks', {
                    withCredentials: true
                });
                setRecentTracks(response.data.recent_tracks);
            } catch (error) {
                console.error('Error fetching recent tracks:', error);
            }
        };

        fetchRecentTracks();

    }, [recentTrackState]);

    useEffect(() => {
        // Load playlists from local storage when component mounts
        const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
        setStoredPlaylists(playlists);
    }, []);

    const handleUpdatePlaylists = (updatedPlaylists) => {
        setStoredPlaylists(updatedPlaylists);
        localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
    };

    const handlePlayTrack = (track) =>
    {
        console.log('Track: ', track)
        setPyppoTrack(track);
        toggleRecentTrack();
    }



    return (
        <div className={'sidebar'}>
            <div className='icon-sidebar'>
                <ul className='main'>
                    {/* Map over the sidebarItems array to render each item dynamically */}
                    {sidebarItems.map((item) => (
                        <li key={item.id}>
                            <a className="special-a" onClick={() => handleClick(item.id)}>
                                <FontAwesomeIcon 
                                    className={`i-sidebar ${item.id === 'door' ? (roomState ? 'room' : '') : (activeItem === item.id ? 'active' : '')}`} 
                                    icon={item.icon} 
                                />
                            </a>
                        </li>
                    ))}
                </ul>

                {alreadyAuth ? <hr></hr> : <div></div>}

                <ul className='extra'>
                    <li key={'moon'}>
                        <a href='#' onClick={() => handleClick('moon')}>
                            <FontAwesomeIcon className={`i-sidebar active`} icon={faMoon} /> 
                        </a>
                    </li>
                    {extraSidebarItems.map((item) => {
                        if ((alreadyAuth && item.id === 'rightFromBracket') || (!alreadyAuth && item.id === 'circleUser')) {
                            return (
                                <li key={item.id}>
                                    <a href={alreadyAuth ? item.link : '/login'} onClick={() => handleClick(item.id)}>
                                        <FontAwesomeIcon 
                                            className={`i-sidebar ${alreadyAuth && activeExtraItem === item.id ? 'authorized' : ''}`} 
                                            icon={item.icon} style={{cursor: 'pointer'}}
                                        />
                                    </a>
                                </li>
                            );
                        }
                    })}
                </ul>

            </div>

            <div className={`room-sidebar ${roomState ? 'room' : '' }`}>
                <div className='room-gadgets'>
                    <div className='title'>
                        <FontAwesomeIcon className='' icon={faBuildingUser} />
                        <span>Your Room</span>
                    </div>
                </div>

                <RoomOptions />

            </div>
            

            <div className={`track-sidebar ${roomState ? 'room' : '' }`}>
                <div className='menu'>
                    <div className='title'>
                        <FontAwesomeIcon className='' icon={faBookmark} />
                        <span>Dashboard</span>
                    </div>

                    <ul className='menu-option'>
                        {menuOptions.map((option, index) => (
                            <li key={index}>
                                <Link to={option.link} className='highlight-option'>{option.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {alreadyAuth ?
                    <div className='personal-playlists'>
                        <div className='title'>
                            <FontAwesomeIcon className='' icon={faMusic} />
                            <span>Playlists</span>
                        </div>

                        <PersonalPlaylists playlists={storedPlaylists} onUpdatePlaylists={handleUpdatePlaylists}/>

                    </div> : <div></div>}

                { alreadyAuth ?    
                <div className='recently-played-track'>
                    <div className='title'>
                        <FontAwesomeIcon className='' icon={faMicrophoneLines} />
                        <span>Recently played</span>
                    </div>

                    <ul className='recent-tracks'>
                        {recentTracks.map((track, index) => (
                            <li key={index} className='recent-track-container' onClick={() => handlePlayTrack(track)}>
                                <a href='#' className='recent-track-link'>
                                    <img src={track.spotify_image_url} alt={track.name} />

                                    <div className='recent-track-info'>
                                        <span className='recent-track-name'>{track.name}</span>
                                        <span className='recent-track-artist'>{track.artists.join(', ')}</span>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div> : <UnauthorizedModal />}

                { alreadyAuth ?    
                <div className='recently-played-track'>
                    <div className='title'>
                        <FontAwesomeIcon className='' icon={faUsers} />
                        <span>Favourite artists</span>
                    </div>

                    <ul className='recent-tracks'>
                        {fiveFavouriteArtists.map((artist, index) => (
                            <li key={index} className='recent-track-container'>
                                <Link 
                                    to={`/artist/${artist.artist_id}`} 
                                    className='recent-track-link'
                                    key={`/artist/${artist.artist_id}`} // Add this line
                                >
                                    <img src={artist.spotify_artist_image_url} alt={artist.name} />

                                    <div className='recent-track-info'>
                                        <span className='recent-track-name'>{artist.name}</span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div> : <UnauthorizedModal />}

            </div>

        </div>
    );
};

export default CustomSidebar;
