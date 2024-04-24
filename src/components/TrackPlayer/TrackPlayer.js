import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForwardStep, faBackwardStep, faPause, faPlay, faRepeat, faShuffle, faVolumeUp, faHeart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './TrackPlayer.css';
import { useTrack } from '../../contexts/TrackContext';
import { useRecentTrack } from '../../contexts/RecentTrackContext';
import { useAuth } from '../../contexts/AuthContext';

const TrackPlayer = () => {
    const { accessToken } = useAuth();

    const [pyppoPlayer, setPyppoPlayer] = useState();
    const [alreadyPlayed, setAlreadyPlayed] = useState(false);

    const [isPlayingTrack, setIsPlayingTrack] = useState()

    const [isScaled, setIsScaled] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);

    const [spotifyStatus, setSpotifyStatus] = useState('Connecting to Spotify...');
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

        console.log("???????????????????????")
        console.log("Track in pyppo state: ", pyppoTrack)
        console.log("Track is playing now: " + isPlayingTrack)
        console.log("IsPlaying: " + isPlaying) 
        console.log("Repeat: " + repeatActive)
        console.log("Shuffle: " + shuffleActive)
        console.log("Already played: " + alreadyPlayed)
        console.log("Waiting List: ", waitingList)
        console.log("???????????????????????")



    },[isPlayingTrack, isPlaying, repeatActive, shuffleActive, alreadyPlayed, waitingList, pyppoTrack])


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
        handlePlayTrackInPlayer();
        setIsPlaying(true);
        setAlreadyPlayed(true);
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
            else if (repeatState === 'context') {
                console.log("Repeat context")
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
        }
        catch (error)
        {
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
        }
        catch (err) {
            console.error('Failed to remove track from favourites:', err)
        }
    }


    const toggleFavourite = (track) => {
        setIsTrackFavourite(prevState => !prevState);
        if (track)
        {
            if (!isTrackFavourite)
            {
                handleAddToFavourites(track);
            }
            else
            {
                handleRemoveFromFavourites(track);
            }
        }
        else
        {
            console.log("Something wrong here")
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
            const response = await axios.post('http://127.0.0.1:8080/playback/seek', { newPositionMs }, {withCredentials: true});
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

    const handlePlayTrackInPlayer = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8080/playback/play', { myDeviceId, trackUri }, {
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
            console.log('Pausing track in player...');
            handlePauseTrackInPlayer()
            setTrackEnd(false);
            setIsPlaying((pre) => (!pre))
        } else 
        {
            if (alreadyPlayed)
            {
                console.log('Resuming track in player...');
                handleResumeTrackInPlayer();
                setTrackEnd(false);
                setIsPlaying((pre) => (!pre))
            }
            else
            {
                console.log('Playing track in player...');
                handlePlayTrackInPlayer();
                setTrackEnd(false);
                setIsPlaying((pre) => (!pre))
            }
        } 
    };

    const handleClickNext = async () => {
        try {
            setTrackEnd(true);
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

        } catch (error) {
            console.error('Failed to send playback control request:', error);
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

        } catch (error) {
            console.error('Failed to send playback control request:', error);
        }
    }

    const handleShuffle = async () => {
        try {
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
            } else {
                console.error('Failed to toggle shuffle:', message);
            }
        } catch (error) {
            console.error('Error toggling shuffle:', error);
        }
    };
    
    const handleRepeat = async (repeatMode) => {
        try {
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
                <FontAwesomeIcon icon={faVolumeUp} className="track-player-volume" />
                <FontAwesomeIcon
                    icon={faHeart}
                    className={`track-player-favourite ${isTrackFavourite && pyppoTrack != null ? 'active' : ''}`}

                    onClick={() => toggleFavourite(isPlayingTrack)}
                />
            </div>
        </div>
    );
};

export default TrackPlayer;
