import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForwardStep, faBackwardStep, faPause, faPlay, faRepeat, faShuffle, faVolumeUp, faHeart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './TrackPlayer.css';
import { useTrack } from '../../contexts/TrackContext';
import { useRecentTrack } from '../../contexts/RecentTrackContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const TrackPlayer = () => {
    const { alreadyAuth } = useAuth();

    const [pyppoPlayer, setPyppoPlayer] = useState();
    const [alreadyPlayed, setAlreadyPlayed] = useState(false);

    const [isPlayingTrack, setIsPlayingTrack] = useState()

    const [isScaled, setIsScaled] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [deviceId, setDeviceId] = useState();
    const [trackUri, setTrackUri] = useState()

    const [currentTrackPosition, setCurrentTrackPosition] = useState("0:00")

    const [counter, setCounter] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    const { pyppoTrack, setPyppoTrack, isPlaying, setIsPlaying, myDeviceId, setMyDeviceId, waitingList, removeFromWaitingList, toggleDuplicate, setToggleDuplicate, isTrackFavourite, setIsTrackFavourite, setMyPlayer} = useTrack();
    const { toggleRecentTrack, recentTrackState } = useRecentTrack();
    const [shuffleState, setShuffleState] = useState(false);
    const [shuffleActive, setShuffleActive] = useState(false);
    const [repeatState, setRepeatState] = useState('off');
    const [repeatActive, setRepeatActive] = useState(false);
    const [trackEnd, setTrackEnd] = useState(false);

    useEffect(() => {
        const initSpotifyPlayer = () => {
            if (window.Spotify) {
                console.log('Spotify object is available:', window.Spotify);
        
                const spotify_access_token = localStorage.getItem('spotify_token');
                console.log('Spotify access token:', spotify_access_token);
        
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
                setMyPlayer(player);

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
        if (trackEnd && waitingList.length != 0) {
            setIsPlayingTrack(null);
            setTrackUri(null);
            setIsPlaying(false);
            setAlreadyPlayed(false);
        }
    },[trackEnd, waitingList])

    useEffect(() => {
        if (trackUri)
        {
            handlePlayTrackInPlayer();
            setIsPlaying(true);
            setAlreadyPlayed(true);
        }
    },[trackUri])

    useEffect(() => {
        if (isPlayingTrack)
        {
            handleAddRecentTrack();
        }

        if (isPlayingTrack === null && waitingList.length > 0 )
        {
            setPyppoTrack(waitingList[0]);
            setIsPlayingTrack(waitingList[0]);  
            removeFromWaitingList(waitingList[0]);
            toggleRecentTrack();
            setTrackEnd(false); 
        }

    },[isPlayingTrack, waitingList])

    useEffect(() => {
        let intervalId;
    
        if (isPlayingTrack && (isPlaying == true)) {
            const trackDurationInSeconds = isPlayingTrack.duration / 1000;
    
            intervalId = setInterval(() => {
                setCounter(prevCounter => {
                    if (prevCounter < trackDurationInSeconds) {
                        return prevCounter + 1;
                    } else {
                        setTrackEnd(true);
                        console.log('Track end', trackEnd);
                        if (repeatActive === false) {
                            clearInterval(intervalId);
                            console.log('Repeat state is false');   
                            setIsPlaying(false);
                            setAlreadyPlayed(false);
                            setSliderValue(0);
                            return 0;
                        } else {
                            console.log('Repeat state is true');
                            setIsPlaying(true);
                            setAlreadyPlayed(true);
                            setTrackEnd(false);
                            setSliderValue(0);
                            handlePlayTrackInPlayer();
                            return 0;
                        }
                    }
                });
            }, 1000);
        }
    
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isPlayingTrack, repeatActive, isPlaying]);
    
    // Reset the counter to 0 whenever the song changes
    useEffect(() => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
        setCounter(0);
        setSliderValue(0);
    }, [pyppoTrack]);

    useEffect(() => {
        if (currentTrackPosition == '0:00' && isPlayingTrack == pyppoTrack) {
            if (repeatState === 'track') {
                console.log("Repeat track")
            }
            else
            {
                setPyppoTrack(null);
                setIsPlaying(false);
                setTrackEnd(false);
            }
        }
    }, [currentTrackPosition]);

    useEffect(() => {
        if (isPlayingTrack && isPlayingTrack.duration > 0) {
            const trackDurationInSeconds = isPlayingTrack.duration / 1000;
            const sliderValue = (counter / trackDurationInSeconds) * 100;
            setSliderValue(sliderValue);
        }
    }, [counter]);


    const handleSliderChange = (event) => {
        const value = parseInt(event.target.value);
        console.log("Slider value: ", value)
        setSliderValue(value);
    };

    const handleAddToFavourites = async (track) => {
        try
        {
            const response = await axios.post('http://127.0.0.1:8080/personal/favourites/track', 
            { 'spotify_id' : track.spotify_id }, 
            { withCredentials : true });
            console.log('Message : ', response.data.message)
            toast.success("The current track has been added to the favorite list")

        }
        catch (error)
        {
            toast.error("An error occurred while adding the current track to the favorite list")
            console.error('Failed to add track to favourites:', error);
        }
    }

    const handleRemoveFromFavourites = async (track) => {
        try {
            const response = await axios.delete('http://127.0.0.1:8080/personal/favourites/track', {
                data: { 'spotify_id' : track.spotify_id },
                withCredentials: true
            });
            console.log('Message : ', response.data.message)
            toast.success("Remove the current track from the favorite list sucessfully!")
        }
        catch (err) {
            toast.error("An error occurred while removing the current track from the favorite list")
            console.error('Failed to remove track from favourites:', err)
        }
    }


    const toggleFavourite = (track) => {
        if (track)
        {
            if (!isTrackFavourite)
            {
                handleAddToFavourites(track);
                setIsTrackFavourite(true);
            }
            else
            {
                handleRemoveFromFavourites(track);
                setIsTrackFavourite(false);
            }


        }
        else
        {
            toast.error("No track is playing now!")
        }
    };

    const handleSeek = async () => {
        try {
            // Calculate the new position in milliseconds based on the slider value
            const newPositionMs = (sliderValue / 100) * isPlayingTrack.duration;
            setCounter(parseInt(newPositionMs / 1000));
            console.log("Slider value in seek function: ", sliderValue)
            console.log("Is Playing Track: ", isPlayingTrack.name)
            console.log("Track duration: ",isPlayingTrack.duration)

            if (!isPlaying) {
                handleResumeTrackInPlayer();
            }

            const response = await axios.post('http://127.0.0.1:8080/playback/seek', { newPositionMs, 'isPlaying' : isPlaying }, {withCredentials: true});
            setIsPlaying(true);
            console.log('Seek request sent successfully');
            
        } catch (error) {
            console.error('Failed to send seek request:', error);
        }
    };


    

    const handleClick = () => {
        setIsScaled(true);
        setTimeout(() => setIsScaled(false), 200); // Reset scaling after 200ms
        togglePlay();
    };

    const handlePlayTrackInPlayer = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8080/playback/play', { myDeviceId, trackUri }, {
                withCredentials: true,
            });
            setIsPlaying(true);
            setAlreadyPlayed(true)
        } catch (error) {
            if (error.message.includes('https://api.spotify.com/v1/melody/v1/check_scope?scope=web-playback')) {
                try {
                    // Refresh the Spotify token
                    toast.error("401 from Spotify");
                    handlePlayTrackInPlayer();
                    // Retry the playback control request
                    // Your code to send playback control request...
                } catch (refreshError) {
                    console.error('Failed to refresh Spotify token and retry playback control request:', refreshError);
                }
            }
        }
    }

    const handleResumeTrackInPlayer = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8080/playback/resume', { myDeviceId }, {
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
            const response = await axios.post('http://127.0.0.1:8080/playback/pause', { myDeviceId }, {
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
            if (!alreadyAuth)
            {
                toast.error("Please log in to Pyppo to play a track!")
                return;
            }
            handlePauseTrackInPlayer()
            setTrackEnd(false);
            setIsPlaying((pre) => (!pre))
        } else 
        {
            if (alreadyPlayed)
            {
                if (!alreadyAuth)
                {
                    toast.error("Please log in to Pyppo to play a track!")
                    return;
                }
                handleResumeTrackInPlayer();
                setTrackEnd(false);
                setIsPlaying((pre) => (!pre))
            }
            else
            {
                if (!alreadyAuth)
                {
                    toast.error("Please log in to Pyppo to play a track!")
                    return;
                }
                handlePlayTrackInPlayer();
                setTrackEnd(false);
                setIsPlaying((pre) => (!pre))
            }
        } 
    };

    const handleClickNext = async () => {
        try {
            setTrackEnd(true);

            if (waitingList.length > 0) {
                setIsPlayingTrack(null);
            }
            else {
                const response = await axios.post('http://127.0.0.1:8080/playback/next', { myDeviceId }, {
                    withCredentials: true
                });
                console.log('Playback control request sent successfully');
                setTrackEnd(false);
                setIsPlaying(true);
                setAlreadyPlayed(true)
                setIsPlayingTrack(response.data.nextTrack);
                setPyppoTrack(response.data.nextTrack);
                toggleRecentTrack();
                toast.success("The next track has been played!")
            }

            
        } catch (error) {
            toast.error("Please log in to Pyppo to play a track!")
        }     
    }

    const handleClickPrevious = async () => {
        try {
            setTrackEnd(true);
            const response = await axios.post('http://127.0.0.1:8080/playback/previous', { myDeviceId }, {
                withCredentials: true
            });
            console.log('Playback control request sent successfully');
            setTrackEnd(false);
            setIsPlaying(true);
            setAlreadyPlayed(true)
            setIsPlayingTrack(response.data.previousTrack);
            setPyppoTrack(response.data.previousTrack);
            toggleRecentTrack();
            toast.success("The previous track has been played!")

        } catch (error) {
            toast.error("Please log in to Pyppo to play a track!")
        }
    }

    const handleShuffle = async () => {
        try {
            if (!alreadyAuth)
            {
                toast.error("Please log in to Pyppo to play a track!")
                return;
            }
            const response = await axios.post('http://127.0.0.1:8080/playback/shuffle', {
                myDeviceId: deviceId,
                shuffleState: !shuffleState // Toggle shuffle state
            }, {
                withCredentials: true
            });
            const { success, message } = response.data;
            if (success) {
                console.log(message);
                setShuffleState(!shuffleState); // Update local state after successful shuffle
                if (!shuffleState) {
                    toast.success("Shuffle has been enabled")
                }
                else {
                    toast.success("Shuffle has been disabled")
                }
            } else {
                console.error('Failed to toggle shuffle:', message);
            }
        } catch (error) {
            
            console.error('Error toggling shuffle:', error);
        }
    };
    
    const handleRepeat = async (repeatMode) => {
        try {
            if (!alreadyAuth)
            {
                toast.error("Please log in to Pyppo to play a track!")
                return;
            }
            const response = await axios.post('http://127.0.0.1:8080/playback/repeat', {
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
            if (!alreadyAuth)
            {
                toast.error("Please log in to Pyppo to play a track!")
                return;
            }
        }
        else
        {
            if (!alreadyAuth)
            {
                toast.error("Please log in to Pyppo to play a track!")
                return;
            }
            setRepeatActive(!repeatActive);
            if (repeatActive) {
                handleRepeat('off');
                toast.success("The current track will not be repeated")
            } else {
                handleRepeat('track');
                toast.success("Repeat the current track")
            }
        }
    }

    const handleShuffleToggle = () => {
        setShuffleActive(!shuffleActive);
        handleShuffle();
    }

    const handleAddRecentTrack = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8080/personal/recent/tracks', {
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

    const checkScope = async () => {
        try {
            const response = await axios.get('https://api.spotify.com/v1/melody/v1/check_scope?scope=web-playback', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('spotify_token')}`
                }
            });
    
            // ...rest of your code...
    
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Refresh the token if the request fails with a 401 status
                const refreshResponse = await axios.post('http://127.0.0.1:8080/spotify/refresh', {withCredentials: true})
                localStorage.setItem('spotify_token', refreshResponse.data.spotify_token)
                localStorage.setItem('spotify_expires_at', refreshResponse.data.spotify_expires_at)
    
                // After refreshing the token, try to play again
                try {
                    // Replace this with your actual play function
                    await handlePlayTrackInPlayer();
                } catch (playError) {
                    console.error('Failed to play after refreshing token:', playError);
                }
            } else {
                console.error('Failed to check scope:', error);
            }
        }
    };
    

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const duration = isPlayingTrack ? formatTime(isPlayingTrack.duration / 1000) : '0:00';

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
                    onChange={(event) => handleSliderChange(event)}
                    onMouseUp={handleSeek} // Trigger seek when user releases mouse after adjusting seek bar
                />
                <span className='time track-player-duration-time'>{duration}</span>
            </div>

            <div className="settings-icon">
                <FontAwesomeIcon
                    icon={faHeart}
                    className={`track-player-favourite ${isTrackFavourite ? 'active' : ''}`}


                    onClick={() => toggleFavourite(isPlayingTrack)}
                    
                />
            </div>
        </div>
    );
};

export default TrackPlayer;
