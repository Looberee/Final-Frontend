import React, { useEffect } from 'react';
import io from 'socket.io-client';
import './Room.css';

const socket = io('http://127.0.0.1:5000');  // Change this to the URL of your server

function Room() {

    const handleClick = () => {
        socket.emit('test', { message: 'Hello from client!' });
    };

    return (
        <div className="room">
            <h1>Socket.IO Client</h1>
            <button onClick={handleClick}>Send Message</button>
        </div>
    );
}

export default Room;