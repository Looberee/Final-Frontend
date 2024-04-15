import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import './SpecificRoom.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faL, faMusic, faPlay, faUserTie, faUsers } from '@fortawesome/free-solid-svg-icons';

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

    useEffect(() => {
        console.log("User Input: ", userInput);
        console.log("Track Searched Value: ", trackSearchedValue);
        console.log("Show Command Results: ", showCommandResults);
        console.log("Show Track Search Results: ", showTrackSearchResults);
        console.log("trackSearchedResults: ", trackSearchedResults);
        console.log("Command Results: ", commandResults);
    },[userInput, showCommandResults, showTrackSearchResults, trackSearchedResults, commandResults])

    useEffect(() => {
        // Connect to the socket server
        socket.current.connect();
        console.log('Connected to socket server');

        socket.current.emit('join', {room_id: id });
    
        // Listen for incoming messages
        socket.current.on('message', (data) => {
            console.log('Received message:', data.msg);
            setMessages((prevObject) => [...prevObject, {"text" : data.msg, "user" : data.user}]);
        });
    
        // Emit join event
    
        return () => {
            // Emit leave event when the component is unmounted or user leaves the page
            socket.current.emit('leave', {room_id: id });
            // Disconnect from the socket server
            socket.current.disconnect();
            console.log('Disconnected from socket server');
            window.location.href= '/home';
        };
    }, []);

    useEffect(() => {
        console.log("Message: ", messages)
    },[messages])


    // Handle leaving the specific room and emitting a leave event
    const handleLeaveRoom = () => {
        // Emit leave event when the user leaves manually
        socket.current.emit('leave', {room_id: id });
        window.location.href= '/home';
        socket.current.on('leave', (data) => {
        })
        console.log("User has left the room!");
    };

    const sendMessage = (message) => {
            socket.current.emit('send_message', { room_id: id, message: message});
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            console.log("You typed: ", event.target.value)
            if ((event.target.value).startsWith('!')) {
                console.log("Play command!")
                socket.current.emit('command', {'message': event.target.value, 'room_id': id})
                event.target.value = ''
            } else {
                sendMessage(event.target.value);
                event.target.value = ''; // Clear input after sending message
            }
        }
        

    };

    const handleRoomInputChange = (event) => {
        setUserInput(event.target.value);
        if (event.target.value.startsWith('!pplay')) {
            setShowCommandResults(false);
            setTrackSearchedValue(event.target.value.slice(7));
            setShowTrackSearchResults(true);
        }
        else if (event.target.value.startsWith('!pchat')) {
            setShowCommandResults(false);
            setShowTrackSearchResults(false);
        } else if (event.target.value.startsWith('!')) {
            setShowCommandResults(true);
            setShowTrackSearchResults(false);
        } else {
            setShowCommandResults(false);
            setShowTrackSearchResults(false);
        }
    };


    useEffect(() => {
        const fetchTrackSearchResults = async () => {
            try {
                if (trackSearchedValue) {
                    const response = await axios.get(`http://127.0.0.1:5000/search?query=${trackSearchedValue}`, {
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



    return (
        <div className='specific-room-container'>
            <div className='member-sidebar'>
                <h1 className='branch-title'>Pyppo</h1>

                <div className='host-container'>
                    <div className='host-title-container'>
                        <FontAwesomeIcon className='lock-icon' icon={faUserTie} />
                        <h2 className='host-title'>Host</h2>
                    </div>

                    <div className='host-info'>
                        <img className='host-avatar' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' alt=''></img>
                        <span className='host-name'>Host</span>
                    </div>

                </div>

                <div className='member-container'>

                    <div className='member-title-container'>
                        <FontAwesomeIcon className='lock-icon' icon={faUsers} />
                        <h2 className='member-title'>Members</h2>
                    </div>

                    <ul className='members-list'>
                        <li className='member-object'>
                            <img className='member-avatar' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' alt=''></img>
                            <span className='member-name'>User 1</span>
                        </li>

                        <li className='member-object'>
                            <img className='member-avatar' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' alt=''></img>
                            <span className='member-name'>User 1</span>
                        </li>

                        <li className='member-object'>
                            <img className='member-avatar' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' alt=''></img>
                            <span className='member-name'>User 1</span>
                        </li>

                        <li className='member-object'>
                            <img className='member-avatar' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' alt=''></img>
                            <span className='member-name'>User 1</span>
                        </li>

                        <li className='member-object'>
                            <img className='member-avatar' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' alt=''></img>
                            <span className='member-name'>User 1</span>
                        </li>

                        
                    </ul>
                </div>
            </div>

            <div className='room-content'>
                <div className='chat-input'>
                    {showCommandResults && (
                        <div className='command-results-box'>
                            {commandResults.map((command, index) => (
                                <li key={index} className='room-search-result' onClick={() => {setUserInput(command); setShowCommandResults(false);}}>
                                    {command}
                                </li>
                            ))}
                        </div>
                    )}
                    {showTrackSearchResults && (
                        <div className='room-search-results-box'>
                            <ul>
                                {trackSearchedResults.map((track, index) => (
                                    <li key={index} className='room-search-result' onClick={() => { setUserInput(`!pplay ${track.name}`); setShowTrackSearchResults(false); }}>
                                        <img src={track.spotify_image_url} alt={track.name} className='room-search-result-img'/>
                                        <div className='room-search-result-info'>
                                            <span className='room-search-result-name'>{track.name}</span>
                                            <span className='room-search-result-artists'>{track.artists}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <input type="text" placeholder="Type a message..." value={userInput} onChange={handleRoomInputChange} onKeyPress={handleKeyPress}/>
                </div>
            </div>

            <div className='track-queue'>
                <h1 className='branch-title'>Track Queue</h1>

                <div className='track-queue-container'>
                    <div className='track-queue-title-container'>
                        <FontAwesomeIcon className='lock-icon' icon={faPlay} />
                        <h2 className='track-queue-title'>Is Playing Now</h2>
                    </div>

                    <div className='track-queue-object'>
                        <img className='track-queue-avatar' src='https://res.cloudinary.com/dckgpl1ys/image/upload/v1711105274/y2p2lbvpvxu3ewh7evbz.jpg' alt=''></img>
                        <div className='track-queue-info'>
                            <span className='track-queue-name'>Play Fast!</span>
                            <span className='track-queue-composer'>Embark Studio</span>
                        </div>
                    </div>

                </div>

                <div className='track-queue-container'>

                    <div className='track-queue-title-container'>
                        <FontAwesomeIcon className='lock-icon' icon={faMusic} />
                        <h2 className='track-queue-title'>Waiting Tracks</h2>
                    </div>

                    <ul className='track-queues-list'>
                        <li className='track-queue-object'>
                            <img className='track-queue-avatar' src='https://res.cloudinary.com/dckgpl1ys/image/upload/v1711105274/y2p2lbvpvxu3ewh7evbz.jpg' alt=''></img>
                            <div className='track-queue-info'>
                                <span className='track-queue-name'>Play Fast!</span>
                                <span className='track-queue-composer'>Embark Studio</span>
                            </div>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SpecificRoom;
