import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import './SpecificRoom.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faL, faMusic, faPlay, faUserTie, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useTrack } from '../../../contexts/TrackContext';

const SpecificRoom = () => {
    const { encode_id } = useParams();
    const [currentUser, setCurrentUser] = useState("User"); // Replace with your user object from the context
    const [users, setUsers ] = useState([])
    const [messages, setMessages] = useState([]);
    const socket = useRef(io('http://127.0.0.1:5001', { withCredentials: true })); // Replace with your socket server URL
    const [userInput, setUserInput] = useState([]);
    const [trackSearchedValue, setTrackSearchedValue] = useState('');
    const [trackSearchedResults, setTrackSearchedResults] = useState([]);
    const { setPyppoTrack } = useTrack();

    useEffect(() => {
        socket.current.connect();

        console.log('Connected to socket server');

        socket.current.emit('join', {room_encode_id: encode_id });
    
        // Listen for incoming messages
        socket.current.on('message', (data) => {
            console.log('Received message:', data.msg);
            setMessages((prevObject) => [...prevObject, {"text" : data.msg, "user" : data.user}]);
        });

        return () => {
            // Emit leave event when the component is unmounted or user leaves the page
            socket.current.emit('leave', {room_encode_id: encode_id });
            // Disconnect from the socket server
            socket.current.disconnect();
            console.log('Disconnected from socket server');
            window.location.href= '/home';
        };
    }, []);


    useEffect(() => {
        socket.current.on('member_list', (data) => {
            console.log("Member data: ", data);
            setUsers(data.member_list);
        });
    },[messages])

    useEffect(() => {
        // Emit leave_room event when page is reloaded or closed
        const handleBeforeUnload = () => {
            socket.current.emit('leave', { "room_encode_id": encode_id });
            socket.current.disconnect();
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // Handle leaving the specific room and emitting a leave event
    const handleLeaveRoom = () => {
        // Emit leave event when the user leaves manually
        socket.current.emit('leave', {room_encode_id: encode_id });
        window.location.href= '/home';
        socket.current.on('leave', (data) => {
        })
        console.log("User has left the room!");
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            console.log("You typed: ", event.target.value)
            socket.current.emit('send_message', {'message': event.target.value, "room_encode_id": encode_id})
            event.target.value = ''; // Clear input after sending message
            setUserInput('')
    }
    };

    const handleRoomInputChange = (event) => {
        setUserInput(event.target.value);
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

    return (
        <div className='specific-room-container'>
            <div className='member-sidebar'>
                <h1 className='branch-title' onClick={handleLeaveRoom}>Pyppo</h1>

                <div className='member-container'>

                    <div className='member-title-container'>
                        <FontAwesomeIcon className='lock-icon' icon={faUsers} />
                        <h2 className='member-title'>Members</h2>
                    </div>

                    <ul className='members-list'>
                        {users.map((username, index) => (
                            <li className='member-object' key={index}>
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
                    <input type="text" placeholder="Type a message..." value={userInput} onChange={handleRoomInputChange} onKeyPress={handleKeyPress}/>
                </div>
            </div>

        </div>
    );
};

export default SpecificRoom;
