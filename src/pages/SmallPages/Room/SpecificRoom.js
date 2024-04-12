import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const SpecificRoom = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [joinedUsers, setJoinedUsers] = useState([]);
    const [joinSuccess, setJoinSuccess] = useState(null); // Track join success or failure
    const socket = useRef(io('http://127.0.0.1:5001', { withCredentials: true })); // Replace with your socket server URL

    useEffect(() => {
        // Connect to the socket server
        socket.current.connect();
        console.log('Connected to socket server');

        // Listen for incoming messages
        socket.current.on('message', (data) => {
            console.log('Received message:', data);
            if (data.success !== undefined) {
                // Join response message
                setJoinSuccess(data.success);
                console.log('Join success:', data.success);
            } else {
                // Normal chat message
                setMessages((prevMessages) => [...prevMessages, data.msg]);
                console.log('New message:', data.msg);
            }
        });

        // Listen for user joined event
        socket.current.on('user_joined', (userData) => {
            console.log('User joined:', userData);
            setJoinedUsers((prevUsers) => [...prevUsers, userData.username]);
        });

        // Cleanup function to disconnect from the socket server on component unmount or leave
        return () => {
            // Emit leave event when the component is unmounted or user leaves the page
            socket.current.emit('leave', { username: 'YourUsername', room: 'SpecificRoom' });
            // Disconnect from the socket server
            socket.current.disconnect();
            console.log('Disconnected from socket server');
        };
    }, []);

    // Handle sending a message
    const handleSendMessage = () => {
        // Send the new message to the server
        socket.current.emit('message', newMessage);
        console.log('Sent message:', newMessage);

        // Clear the input field
        setNewMessage('');
    };

    // Handle leaving the specific room and emitting a leave event
    const handleLeaveRoom = () => {
        // Emit leave event when the user leaves manually
        socket.current.emit('leave', { username: 'YourUsername', room: 'SpecificRoom' });
        console.log("User has been left room!")
    };

    return (
        <div>
            <h1>Specific Room</h1>
            {/* Display join success or failure message */}
            {joinSuccess !== null && (
                <p>{joinSuccess ? 'Successfully joined the room' : 'Failed to join the room. Incorrect password.'}</p>
            )}
            <div>
                <p>Joined Users:</p>
                <ul>
                    {/* Display list of joined users */}
                    {joinedUsers.map((user, index) => (
                        <li key={index}>{user}</li>
                    ))}
                </ul>
                <p>Messages:</p>
                {/* Display list of messages */}
                {messages.map((message, index) => (
                    <p key={index}>{message}</p>
                ))}
            </div>
            {/* Input field for sending messages */}
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />
            {/* Button to send message */}
            <button onClick={handleSendMessage}>Send</button>
            {/* Button to leave the room */}
            <button onClick={handleLeaveRoom}>Leave Room</button>
        </div>
    );
};

export default SpecificRoom;
