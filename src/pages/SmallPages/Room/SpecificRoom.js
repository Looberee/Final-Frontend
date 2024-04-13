import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import './SpecificRoom.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faPlay, faUserTie, faUsers } from '@fortawesome/free-solid-svg-icons';

const SpecificRoom = () => {
    const { id } = useParams();
    const [currentUser, setCurrentUser] = useState("User"); // Replace with your user object from the context
    const [users, setUsers ] = useState([])
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [joinSuccess, setJoinSuccess] = useState(null); // Track join success or failure
    const socket = useRef(io('http://127.0.0.1:5001', { withCredentials: true })); // Replace with your socket server URL

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
            sendMessage(event.target.value);
            event.target.value = ''; // Clear input after sending message
        }
    };



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
                <div className='messages-board'>
                    {messages.map((message) => (
                        <div className='message'>
                            <div className='member-info'>
                                <img className='member-avatar' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' alt=''></img>
                                <p className='member-name' style={{color:'#fff'}}>{message.user}</p>
                            </div>

                            <p className='member-text' style={{color:'#fff'}}>{message.text}</p>
                        </div>
                    ))}
                </div>
                <div className='chat-input'>
                    <input type="text" placeholder="Type a message..." onKeyPress={handleKeyPress} />
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
