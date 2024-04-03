import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForwardStep, faBackwardStep, faPause, faPlay, faRepeat, faShuffle, faVolumeUp, faHeart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './TrackPlayer.css';
import { useTrack } from '../../contexts/TrackContext';
import { useRecentTrack } from '../../contexts/RecentTrackContext';
import { useAuth } from '../../contexts/AuthContext';
import Cookies from 'js-cookie';

const TrackPlayer = () => {
    const { accessToken } = useAuth();

    const [pyppoPlayer, setPyppoPlayer] = useState();
    const [alreadyPlayed, setAlreadyPlayed] = useState(false);

    const [isPlayingTrack, setIsPlayingTrack] = useState()

    const [isScaled, setIsScaled] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [isFavourite, setIsFavourite] = useState(false);

    const [spotifyStatus, setSpotifyStatus] = useState('Connecting to Spotify...');
    const [deviceId, setDeviceId] = useState();
    const [trackUri, setTrackUri] = useState()

    const [currentTrackPosition, setCurrentTrackPosition] = useState("0:00")

    const [counter, setCounter] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    const { pyppoTrack, setPyppoTrack, isPlaying, setIsPlaying, myDeviceId, setMyDeviceId, waitingList, removeFromWaitingList, toggleDuplicate, setToggleDuplicate } = useTrack();
    const { toggleRecentTrack, recentTrackState } = useRecentTrack();
    const [shuffleState, setShuffleState] = useState(false);
    const [shuffleActive, setShuffleActive] = useState(false);
    const [repeatState, setRepeatState] = useState('off');
    const [repeatActive, setRepeatActive] = useState(false);

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
                    volume : 0.5
                });
        
                // Error handling
                player.addListener('initialization_error', ({ message }) => { console.error('Initialization error:', message); });
                player.addListener('authentication_error', ({ message }) => { console.error('Authentication error:', message); });
                player.addListener('account_error', ({ message }) => { console.error('Account error:', message); });
                player.addListener('playback_error', ({ message }) => { console.error('Playback error:', message); });
                
                player.addListener('ready', ({ device_id }) => {
                    console.log('Ready with device ID:', device_id);
                    setMyDeviceId(device_id);
                });

                player.connect().then(async success => {
                    console.log('Connect success:', success);
                    if (success) {
                        console.log('The Web Playback SDK successfully connected to Spotify!');
                        
                    }
                });

                setPyppoPlayer(player);

            } else {
                // Spotify object not available yet, try again after a delay
                console.log('Spotify object not available yet. Trying again after a delay...');
                setTimeout(initSpotifyPlayer, 100);
            }
        };
        initSpotifyPlayer();
    }, []);

    useEffect(() => {
        if (pyppoTrack) {
            setTrackUri(`spotify:track:${pyppoTrack.spotify_id}`)
            setIsPlayingTrack(pyppoTrack);
        }
        else
        {
            setIsPlayingTrack(null);
            setTrackUri(null);
            setIsPlaying(false);
        }
    },[pyppoTrack]);

    useEffect(() => {
        handlePlayTrackInPlayer();
        setIsPlaying(true);
        setAlreadyPlayed(true);
    },[trackUri])

    useEffect(() => {
        if (isPlayingTrack)
        {
            console.log("Now playing: ", isPlayingTrack.name);
            handleAddRecentTrack();
        }

        if (isPlayingTrack === null && waitingList.length > 0)
        {
            console.log("Now playing the Waiting Track: ", waitingList[0].name);
            setIsPlaying(waitingList[0]);
            removeFromWaitingList(waitingList[0]);
        }

    },[isPlayingTrack, waitingList])

    useEffect(() => {
        if (isPlayingTrack) {
            const trackDurationInSeconds = isPlayingTrack.duration / 1000; // Assuming duration is in milliseconds
    
            // Start the counter when a track starts playing
            const id = setInterval(() => {
                setCounter(prevCounter => {
                    if (prevCounter < trackDurationInSeconds) {
                        return prevCounter + 1;
                    } else {
                        // When the counter reaches the track duration, clear the interval and print "Track end"
                        clearInterval(id);
                        console.log('Track end');
                        setIsPlaying(false);
                        setAlreadyPlayed(false);
                        return 0; // Reset the counter
                    }
                });
            }, 1000);
    
            // Save the interval ID so we can clear it later
            setIntervalId(id);
        }
    
        // Clear the interval when the component unmounts or when the track changes
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isPlayingTrack, isPlaying]);

    useEffect(() => {
        setSliderValue((counter / (isPlayingTrack ? isPlayingTrack.duration / 1000 : 1)) * 100);
    },[counter])

    useEffect(() => {
        if (currentTrackPosition == '0:00' && isPlayingTrack == pyppoTrack) {
            if (repeatState === 'track') {
                console.log("Repeat track")
            }
            else if (repeatState === 'context') {
                console.log("Repeat context")
            }
            else
            {
                setPyppoTrack(null);
                setIsPlaying(false);
            }
        }
    }, [currentTrackPosition]);

    const handleSliderChange = (PositionInSec) => {
        const newPosition = parseInt(PositionInSec);
        setSliderValue(newPosition);
    
        // Calculate the new position in seconds based on the slider value and track duration
        const newTrackPosition = (newPosition / 100) * (isPlayingTrack.duration / 1000);
        setCurrentTrackPosition(formatTime(newTrackPosition)); // Update the displayed time
    };
    
    const toggleFavourite = () => {
        setIsFavourite(prevState => !prevState);
    };

    const handleSeek = async () => {
        try {
            // Calculate the new position in milliseconds based on the slider value
            const newPositionMs = (sliderValue / 100) * isPlayingTrack.duration;
            console.log(newPositionMs)
            const response = await axios.post('http://127.0.0.1:5000/playback/seek', { newPositionMs });
            console.log('Seek request sent successfully');
            // setSliderValue(response.data.new_position_ms / isPlayingTrack.duration * 100);
        } catch (error) {
            console.error('Failed to send seek request:', error);
        }
    };
    

    const handleClick = () => {
        setIsScaled(true);
        setTimeout(() => setIsScaled(false), 200); // Reset scaling after 200ms
        togglePlay();
    };

    const handlePlayTrackInPlayer =     async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/playback/play', { myDeviceId, trackUri }, {
                withCredentials: true,
            });
            setIsPlaying(true);
            setAlreadyPlayed(true)
        } catch (error) {
            console.error('Failed to send playback control request:', error);
        }
    }

    const handleResumeTrackInPlayer = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/playback/resume', { myDeviceId }, {
                withCredentials: true
            });
            console.log('Playback control request sent successfully');
            console.log(response.data.message);
            setIsPlaying(true);
            setAlreadyPlayed(true)
        } catch (error) {
            console.error('Failed to send playback control request:', error);
        }
    }

    const handlePauseTrackInPlayer = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/playback/pause', { myDeviceId }, {
                withCredentials: true
            });
            console.log('Playback control request sent successfully');
            console.log(response.data.message);
            setIsPlaying(false);
        } catch (error) {
            console.error('Failed to send playback control request:', error);
        }
    }

    const togglePlay = async () => {
        if (isPlaying) {
            console.log('Pausing track in player...');
            handlePauseTrackInPlayer()
            setIsPlaying((pre) => (!pre))
        } else 
        {
            if (alreadyPlayed)
            {
                console.log('Resuming track in player...');
                handleResumeTrackInPlayer();
                setIsPlaying((pre) => (!pre))
            }
            else
            {
                console.log('Playing track in player...');
                handlePlayTrackInPlayer();
                setIsPlaying((pre) => (!pre))
            }
        } 
    };

    const handleClickNext = async () => {
        try {
            setIsPlaying(true);
            const response = await axios.post('http://127.0.0.1:5000/playback/next', { myDeviceId }, {
                withCredentials: true
            });
            console.log('Playback control request sent successfully');

            setAlreadyPlayed(true)
            console.log("Hello Next: ", response.data);
            setIsPlayingTrack(response.data.nextTrack);
            toggleRecentTrack();

        } catch (error) {
            console.error('Failed to send playback control request:', error);
        }     
    }

    const handleClickPrevious = async () => {
        try {
            setIsPlaying(true);
            const response = await axios.post('http://127.0.0.1:5000/playback/previous', { myDeviceId }, {
                withCredentials: true
            });
            console.log('Playback control request sent successfully');

            setAlreadyPlayed(true)
            console.log("Hello Previous: ", response.data);
            setIsPlayingTrack(response.data.previousTrack);
            toggleRecentTrack();

        } catch (error) {
            console.error('Failed to send playback control request:', error);
        }
    }

    const handleShuffle = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/playback/shuffle', {
                myDeviceId: deviceId,
                shuffleState: !shuffleState // Toggle shuffle state
            }, {
                withCredentials: true
            });
            const { success, message } = response.data;
            if (success) {
                console.log(message);
                setShuffleState(!shuffleState); // Update local state after successful shuffle
            } else {
                console.error('Failed to toggle shuffle:', message);
            }
        } catch (error) {
            console.error('Error toggling shuffle:', error);
        }
    };
    
    const handleRepeat = async (repeatMode) => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/playback/repeat', {
                myDeviceId: deviceId, // Assuming deviceId is a simple string or number
                repeatState: repeatMode
            }, {
                withCredentials: true
            });
            const { success, message } = response.data;
            if (success) {
                console.log(message);
                setRepeatState(repeatMode); // Update local state after successful repeat mode change
            } else {
                console.error('Failed to set repeat mode:', message);
            }
        } catch (error) {
            console.error('Error setting repeat mode:', error);
        }
    };
    
    const handleRepeatToggle = () => {
        if (isPlaying == false)
        {
            
        }
        else
        {
            setRepeatActive(!repeatActive);
            if (repeatActive) {
                handleRepeat('off');
            } else {
                handleRepeat('track');
            }
        }
    }

    const handleShuffleToggle = () => {
        setShuffleActive(!shuffleActive);
        handleShuffle();
    }

    const handleAddRecentTrack = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/personal/recent/tracks', {
                'spotify_id' : isPlayingTrack.spotify_id,
                'played_at' : Date.now()
            }, {
                withCredentials: true // This ensures that cookies (including the HttpOnly cookie with the JWT token) are included in the request
            });
            toggleRecentTrack();
    
        } catch (error) {
            console.log(isPlayingTrack.spotify_id)
            console.error('Error adding recent track:', error);
        }
    };
    

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const duration = isPlayingTrack ? formatTime(isPlayingTrack.duration / 1000) : '0.00';

    return (
        <div className="track-player">
            <div className="track-player-container">
                <div className='track-player-image-container'>
                    <img className='track-player-image' src={isPlayingTrack ? isPlayingTrack.spotify_image_url : ''} alt='' />
                </div>

                <div className='track-player-info'>
                    <h3 className="track-player-name">{isPlayingTrack ? isPlayingTrack.name : '.........'}</h3>
                    <p className="track-player-composer">{isPlayingTrack ? isPlayingTrack.artists : '......'}</p>
                </div>
            </div>

            <div className="controls" style={{ color: '#fff' }}>
                <FontAwesomeIcon icon={faShuffle} className={`shuffle ${shuffleActive ? 'active' : ''}`} onClick={handleShuffleToggle}/>
                <FontAwesomeIcon icon={faBackwardStep} className="backward" onClick={handleClickPrevious}/>
                <div className={`play-pause-container ${isScaled ? 'scaled' : ''}`} onClick={handleClick}>
                    <FontAwesomeIcon
                        icon={isPlaying ? faPause : faPlay}
                        className="play-pause"
                    />
                </div>
                <FontAwesomeIcon icon={faForwardStep} className="forward" onClick={handleClickNext}/>
                <FontAwesomeIcon icon={faRepeat} className={`repeat ${repeatActive ? 'active' : ''}`} onClick={handleRepeatToggle}/>
            </div>

            <div className="track-player-slider">
                <span className='time track-player-current-time'>{formatTime(counter)}</span>
                <input
                    type="range"
                    value={sliderValue}
                    min="0"
                    max="100"
                    className="seek-bar"
                    onChange={handleSliderChange}
                    onMouseUp={handleSeek} // Trigger seek when user releases mouse after adjusting seek bar
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
