import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Room.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

  // Change this to the URL of your server


const Room = () => {
    const [allRooms, setAllRooms] = useState([]);

    useEffect(() => {
        const fetchAllRoom = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5001/rooms/all', {withCredentials: true});
                setAllRooms(response.data.all_rooms);

            }
            catch (err) {
                console.error('Error fetching rooms:', err);
            }
        }

        fetchAllRoom();
    },[])

    return (
        <div className="allrooms-page">
            <h1 className='allroom-title'>Rooms</h1>

            <ul className='allrooms'>
                {allRooms && allRooms.map((room) => (
                    <li className="allroom-container" style={{color:'#fff'}} key={room.id}>
                        <a className="allroom-box" href="#">
                            <h2 className="allroom-name">{room.name}</h2>
                            <span className="allroom-type">{room.room_type == 'public' ? <FontAwesomeIcon className="private-room" icon={faLock} />: ''}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Room;