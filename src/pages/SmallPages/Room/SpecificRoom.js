import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import './SpecificRoom.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faL, faMusic, faPlay, faUserTie, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useTrack } from '../../../contexts/TrackContext';

const SpecificRoom = () => {
    const { id } = useParams();
    const [currentUser, setCurrentUser] = useState("User"); // Replace with your user object from the context
    const [users, setUsers ] = useState([])
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [joinSuccess, setJoinSuccess] = useState(null); // Track join success or failure
    const socket = useRef(io('http://127.0.0.1:5001', { withCredentials: true })); // Replace with your socket server URL
    const [userInput, setUserInput] = useState([]);
    const [trackSearchedValue, setTrackSearchedValue] = useState('');
    const [trackSearchedResults, setTrackSearchedResults] = useState([]);
    const [showTrackSearchResults, setShowTrackSearchResults] = useState(false);
    const [commandResults, setCommandResults] = useState(['!pplay', '!pchat']);
    const [showCommandResults, setShowCommandResults] = useState(false);

    // useEffect(() => {
    //     console.log("User Input: ", userInput);
    //     console.log("Track Searched Value: ", trackSearchedValue);
    //     console.log("Show Command Results: ", showCommandResults);
    //     console.log("Show Track Search Results: ", showTrackSearchResults);
    //     console.log("trackSearchedResults: ", trackSearchedResults);
    //     console.log("Command Results: ", commandResults);
    //     console.log("Message: ", messages);
    // },[userInput, showCommandResults, showTrackSearchResults, trackSearchedResults, commandResults])

    useEffect(() => {
        // Connect to the socket server
        socket.current.connect();
        console.log('Connected to socket server');

        socket.current.emit('join', {room_id: id });
    
        // Listen for incoming messages
        socket.current.on('message', (data) => {
            if (data.room_id === id)
            {
                console.log('Received message:', data.msg);
                setMessages((prevObject) => [...prevObject, {"text" : data.msg, "user" : data.user}]);
            }
            else
            {
                console.log('Received message:', data.msg);
                setMessages((prevObject) => [...prevObject, {"text" : data.msg, "user" : data.user}]);
            }
            
        });


    
        return () => {
            // Emit leave event when the component is unmounted or user leaves the page
            socket.current.emit('leave', {room_id: id });
            // Disconnect from the socket server
            socket.current.disconnect();
            console.log('Disconnected from socket server');
            window.location.href= '/home';
        };
    }, []);

    // useEffect(() => {
    //     console.log("Message: ", messages)
    //     console.log("Users: ", users);
    // },[messages])

    useEffect(() => {
        socket.current.on('member_list', (data) => {
            console.log("Member data: ", data);
            setUsers(data.member_list);
        });
    },[messages])

    // useEffect(() => {
    //     socket.current.on('track_list', (data) => {
    //         console.log("Track data: ", data);
    //         setTrackSelectedList(data.track_list);
    //     });
    // },[messages])

    // useEffect(() => {
    //     console.log("Track Selected: ", trackSelectedList );
    // },[trackSelectedList]);

    // useEffect(() => {
    //     if (trackSelectedList.length > 0) {
    //         socket.current.emit('play_this_track', {'track' :trackSelectedList[0], 'device_id': myDeviceId});
    //     }
    //     else{
    //         console.log("No track selected in list!", trackSelectedList)
    //         console.log("Device_id: ", myDeviceId)
    //     }
    // })

    // useEffect(() => {
    //     socket.current.on('play_sync', function(data) {
    //         console.log('play_sync data:', data);
    
    //         var track = data['track'];
    //         var position = data['position'];
    //         const access_token = localStorage.get('spotify_token')
    
    //         console.log('myDeviceId:', myDeviceId);
    //         console.log('access_token:', access_token);
    //         console.log('track:', track);
    //         console.log('position:', position);
    
    //         // Start playing the track
    //         fetch(`https://api.spotify.com/v1/me/player/play?device_id=${myDeviceId}`, {
    //             method: 'PUT',
    //             body: JSON.stringify({ uris: [`spotify:track:${track["spotify_id"]}`] }),
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${access_token}`  // Use the OAuth token from your application's state
    //             },
    //         }).then(() => {
    //             // Seek to the broadcasted playback position
    //             myPlayer.seek(position);
    //         });
    //     });

    //     return () => socket.off('play_sync');
    // },[])



    // Handle leaving the specific room and emitting a leave event
    const handleLeaveRoom = () => {
        // Emit leave event when the user leaves manually
        socket.current.emit('leave', {room_id: id });
        window.location.href= '/home';
        socket.current.on('leave', (data) => {
        })
        console.log("User has left the room!");
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            console.log("You typed: ", event.target.value)
            socket.current.emit('send_message', {'message': event.target.value, "room_id": id})
            event.target.value = ''; // Clear input after sending message
            setUserInput('')
    }
        

    };

    const handleRoomInputChange = (event) => {
        setUserInput(event.target.value);
        // if (event.target.value.startsWith('!pplay')) {
        //     setShowCommandResults(false);
        //     setTrackSearchedValue(event.target.value.slice(7));
        //     setShowTrackSearchResults(true);
        // }
        // else if (event.target.value.startsWith('!pchat')) {
        //     setShowCommandResults(false);
        //     setShowTrackSearchResults(false);
        // } else if (event.target.value.startsWith('!')) {
        //     setShowCommandResults(true);
        //     setShowTrackSearchResults(false);
        // } else {
        //     setShowCommandResults(false);
        //     setShowTrackSearchResults(false);
        // }
    };


    useEffect(() => {
        const fetchTrackSearchResults = async () => {
            try {
                if (trackSearchedValue) {
                    const response = await axios.get(`http://127.0.0.1:8080/search?query=${trackSearchedValue}`, {
                        withCredentials: true
                });
                    setTrackSearchedResults(response.data.search_results);
                } else {
                    setTrackSearchedResults([]);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchTrackSearchResults();
    },[trackSearchedValue])

    // const handleCommand = (track) => {
    //     setTrackSelectedList((prevObject) => [...prevObject, track]);
    // }



    return (
        <div className='specific-room-container'>
            <div className='member-sidebar'>
                <h1 className='branch-title' onClick={handleLeaveRoom}>Pyppo</h1>

                {/* <div className='host-container'>
                    <div className='host-title-container'>
                        <FontAwesomeIcon className='lock-icon' icon={faUserTie} />
                        <h2 className='host-title'>Host</h2>
                    </div>

                    <div className='host-info'>
                        <img className='host-avatar' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' alt=''></img>
                        <span className='host-name'>Host</span>
                    </div>

                </div> */}

                <div className='member-container'>

                    <div className='member-title-container'>
                        <FontAwesomeIcon className='lock-icon' icon={faUsers} />
                        <h2 className='member-title'>Members</h2>
                    </div>

                    <ul className='members-list'>
                        {users.map((username, index) => (
                            <li className='member-object'>
                                <img className='member-avatar' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' alt=''></img>
                                <span className='member-name'>{username}</span>
                            </li> 
                        ))}

                    </ul>
                </div>
            </div>

            <div className='room-content'>
                <div className='messages-board'>
                    {messages.map((message, index) =>(
                        <div key={index} className='message'>
                            <div className='member-info'>
                                <img className='member-avatar' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'/>
                                <span className='member-name'>{message.user}</span>
                            </div>
                            <p className='member-text' style={{color:'#fff'}}>{message.text}</p>

                        </div>
                    ))}
                </div>

                <div className='chat-input'>
                    {/* {showCommandResults && (
                        <div className='command-results-box'>
                            {commandResults.map((command, index) => (
                                <li key={index} className='room-search-result' onClick={() => {setUserInput(command); setShowCommandResults(false);}}>
                                    {command}
                                </li>
                            ))}
                        </div>
                    )} */}
                    {/* {showTrackSearchResults && (
                        <div className='room-search-results-box'>
                            <ul>
                                {trackSearchedResults.map((track, index) => (
                                    <li key={index} className='room-search-result' onClick={() => { setUserInput(`!pplay ${track.name}`); setShowTrackSearchResults(false); setTrackSelected(track) }}>
                                        <img src={track.spotify_image_url} alt={track.name} className='room-search-result-img'/>
                                        <div className='room-search-result-info'>
                                            <span className='room-search-result-name'>{track.name}</span>
                                            <span className='room-search-result-artists'>{track.artists}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )} */}
                    <input type="text" placeholder="Type a message..." value={userInput} onChange={handleRoomInputChange} onKeyPress={handleKeyPress}/>
                </div>
            </div>

            {/* <div className='track-queue'>
                <h1 className='branch-title'>Track Queue</h1>

                <div className='track-queue-container'>
                    <div className='track-queue-title-container'>
                        <FontAwesomeIcon className='lock-icon' icon={faPlay} />
                        <h2 className='track-queue-title'>Is Playing Now</h2>
                    </div>

                    <div className='track-queue-object'>
                        <img className='track-queue-avatar' src={trackSelectedList.length > 0 && trackSelectedList[0].spotify_image_url ? trackSelectedList[0].spotify_image_url : ""} alt=''></img>
                        <div className='track-queue-info'>
                            <span className='track-queue-name'>{trackSelectedList.length > 0 && trackSelectedList[0].name ? trackSelectedList[0].name : ""}</span>
                            <span className='track-queue-composer'>{trackSelectedList.length > 0 && trackSelectedList[0].artists ? trackSelectedList[0].artists : ""}</span>
                        </div>
                    </div>

                </div>

                <div className='track-queue-container'>

                    <div className='track-queue-title-container'>
                        <FontAwesomeIcon className='lock-icon' icon={faMusic} />
                        <h2 className='track-queue-title'>Waiting Tracks</h2>
                    </div>

                    <ul className='track-queues-list'>
                        {trackSelectedList.slice(1).map((track, index) => (
                            <li key={index} className='track-queue-object'>
                                <img className='track-queue-avatar' src={track.spotify_image_url} alt=''></img>
                                <div className='track-queue-info'>
                                    <span className='track-queue-name'>{track.name}</span>
                                    <span className='track-queue-composer'>{track.artists}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div> */}
        </div>
    );
};

export default SpecificRoom;
