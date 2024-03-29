import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForwardStep, faBackwardStep, faPause, faPlay, faRepeat, faShuffle, faVolumeUp, faHeart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './TrackPlayer.css'; // Import your CSS file for styling

const TrackPlayer = ({ trackSelected }) => {
    const [pyppoPlayer, setPyppoPlayer] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [alreadyPlayed, setAlreadyPlayed] = useState(false);

    const [isPlayingTrack, setIsPlayingTrack] = useState()

    const [isScaled, setIsScaled] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [isFavourite, setIsFavourite] = useState(false);

    const [spotifyStatus, setSpotifyStatus] = useState('Connecting to Spotify...');
    const [deviceId, setDeviceId] = useState();
    const trackUri = 'spotify:track:69otoiAkG6D5JIzROH2YBq'

    

    
    useEffect(() => {
        const initSpotifyPlayer = () => {
            if (window.Spotify) {
                console.log('Spotify object is available:', window.Spotify);
        
                const spotify_access_token = localStorage.getItem('spotify_token');
                console.log('Access token:', spotify_access_token);
        
                if (!spotify_access_token) {
                    console.error('Access token not found in local storage');
                    return;
                }
        
                const player = new window.Spotify.Player({
                    name: 'Pyppo Web Player',
                    getOAuthToken: cb => { cb(spotify_access_token); },
                    volume : 0.1
                });
        
                // Error handling
                player.addListener('initialization_error', ({ message }) => { console.error('Initialization error:', message); });
                player.addListener('authentication_error', ({ message }) => { console.error('Authentication error:', message); });
                player.addListener('account_error', ({ message }) => { console.error('Account error:', message); });
                player.addListener('playback_error', ({ message }) => { console.error('Playback error:', message); });
                
                player.addListener('ready', ({ device_id }) => {
                    console.log('Ready with device ID:', device_id);
                    setDeviceId(device_id);
                });

                player.connect().then(async success => {
                    console.log('Connect success:', success);
                    if (success) {
                        console.log('The Web Playback SDK successfully connected to Spotify!');
                        
                    }
                });
            } else {
                // Spotify object not available yet, try again after a delay
                console.log('Spotify object not available yet. Trying again after a delay...');
                setTimeout(initSpotifyPlayer, 100);
            }
        };
        initSpotifyPlayer();
        console.log("Now playing: ", isPlayingTrack)
    }, []);

    useEffect(() => {
        setIsPlayingTrack(trackSelected)
    },[trackSelected]);


    const toggleFavourite = () => {
        setIsFavourite(prevState => !prevState);
    };

    const handleSliderChange = (event) => {
        setSliderValue(parseInt(event.target.value));
        pyppoPlayer.seek(event.target.value * pyppoPlayer.getCurrentState().duration / 100);
    };

    const handleClick = () => {
        setIsScaled(true);
        setTimeout(() => setIsScaled(false), 200); // Reset scaling after 200ms
        togglePlay();
    };

    const togglePlay = async () => {

        setIsPlaying((pre) => (!pre))
        if (isPlaying)
        {
            try {
                const response = await axios.post('http://127.0.0.1:5000/playback/pause', { deviceId });
                console.log('Playback control request sent successfully');
                console.log(response.data.message);
            } catch (error) {
                console.error('Failed to send playback control request:', error);
            }
        }
        else
        {
            if (alreadyPlayed)
            {
                try {
                    const response = await axios.post('http://127.0.0.1:5000/playback/resume', { deviceId });
                    console.log('Playback control request sent successfully');
                    console.log(response.data.message);
                } catch (error) {
                    console.error('Failed to send playback control request:', error);
                }
            }
            else
            {
                try {
                    const response = await axios.post('http://127.0.0.1:5000/playback/play', { deviceId, trackUri });
                    console.log('Playback control request sent successfully');
                    setAlreadyPlayed(true)
                    console.log(response.data.message);
                } catch (error) {
                    console.error('Failed to send playback control request:', error);
                }
            }
            
        }
    };

    const handleClickNext = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/playback/next', { deviceId });
            console.log('Playback control request sent successfully');
            setAlreadyPlayed(true)
            console.log("Hello Next: ", response.data);
            setIsPlayingTrack(response.data.nextTrack);
        } catch (error) {
            console.error('Failed to send playback control request:', error);
        }     
    }

    const handleClickPrevious = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/playback/previous', { deviceId });
            console.log('Playback control request sent successfully');
            setAlreadyPlayed(true)
            console.log("Hello Previous: ", response.data);
            setIsPlayingTrack(response.data.previousTrack);
        } catch (error) {
            console.error('Failed to send playback control request:', error);
        }
    }

    

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const currentTime = formatTime(sliderValue * pyppoPlayer?.getCurrentState().duration / 100 || 0);

    const duration = isPlayingTrack ? formatTime(isPlayingTrack.duration / 1000) : '0.00';

    return (
        <div className="track-player">
            <div className="track-player-container">
                <div className='track-player-image-container'>
                    <img className='track-player-image' src={isPlayingTrack ? isPlayingTrack.spotify_image_url : ''} alt='' />
                </div>

                <div className='track-player-info'>
                    <h3 className="track-player-name">{isPlayingTrack ? isPlayingTrack.name : '.........'}</h3>
                    <p className="player-composer">{isPlayingTrack ? isPlayingTrack.artists : '......'}</p>
                </div>
            </div>

            <div className="controls" style={{ color: '#fff' }}>
                <FontAwesomeIcon icon={faShuffle} className="shuffle" />
                <FontAwesomeIcon icon={faBackwardStep} className="backward" onClick={handleClickPrevious}/>
                <div className={`play-pause-container ${isScaled ? 'scaled' : ''}`} onClick={handleClick}>
                    <FontAwesomeIcon
                        icon={isPlaying ? faPause : faPlay}
                        className="play-pause"
                    />
                </div>
                <FontAwesomeIcon icon={faForwardStep} className="forward" onClick={handleClickNext}/>
                <FontAwesomeIcon icon={faRepeat} className="repeat" />
            </div>

            <div className="track-player-slider">
                <span className='time track-player-current-time'>{currentTime}</span>
                <input
                    type="range"
                    value={sliderValue}
                    min="0"
                    max="100"
                    className="seek-bar"
                    onChange={handleSliderChange}
                />
                <span className='time track-player-duration-time'>{duration}</span>
            </div>

            <div className="settings-icon">
                <FontAwesomeIcon icon={faVolumeUp} className="track-player-volume" />
                <FontAwesomeIcon
                    icon={faHeart}
                    className={`track-player-favourite ${isFavourite ? 'active' : ''}`}
                    onClick={toggleFavourite}
                />
            </div>

            <div className="spotify-status">{spotifyStatus}</div>
        </div>
    );
};

export default TrackPlayer;
