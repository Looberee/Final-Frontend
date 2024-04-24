import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import io from 'socket.io-client';
import './Room.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { useRoom } from '../../../contexts/RoomContext';

const socket = io('http://127.0.0.1:5001', { withCredentials: true });

const Room = () => {
    const [allRooms, setAllRooms] = useState([]);
    const { toggleRoom, setToggleRoom } = useRoom();

    useEffect(() => {
        const fetchAllRoom = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5001/rooms/all', { withCredentials: true });
                setAllRooms(response.data.all_rooms);

            } catch (err) {
                console.error('Error fetching rooms:', err);
            }
        }

        fetchAllRoom();
    }, [toggleRoom])

    const handleJoinRoom = (room) => {
        socket.emit('join', { room_id: room.id});
    };
    
    
    

    return (
        <div className="allrooms-page">
            <h1 className='allroom-title'>Rooms</h1>

            <ul className='allrooms'>
                {allRooms && allRooms.map((room) => (
                    <li className="allroom-container" style={{ color: '#fff' }} key={room.id} onClick={() => handleJoinRoom(room)}>
                        <Link to={`/room/${room.id}`} className="allroom-box"> {/* Change to Link */}
                            <h2 className="allroom-name">{room.name}</h2>
                            <span className="allroom-type">{room.room_type == 'private' ? <FontAwesomeIcon className="private-room" icon={faLock} /> : ''}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Room;
