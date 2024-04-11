import React, { useEffect, useState } from "react";
import './RoomOptions.css';
import axios from 'axios';
import { useRoom } from "../../contexts/RoomContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const RoomOptions = () => {
    const [rooms, setRooms] = useState([]);
    const { roomState, setRoomState } = useRoom();

    useEffect(() =>{
        const fetchRoom = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5001/rooms', { withCredentials: true });
                console.log("Rooms: ", response.data.my_rooms);
                setRooms(response.data.my_rooms);
            }
            catch (err) {
                console.error('Error fetching rooms:', err);
            }
        }
        fetchRoom();
    },[])


    return (
        <div>
            <div>
                <ul className={`rooms ${roomState ? 'active' : ''}`}>
                    {rooms.map((room) => (
                        <li className="room-container" style={{color:'#fff'}} key={room.id}>
                            <a className="room-box" href="#">
                                <h2 className="room-name">{room.name}</h2>
                                <span className="room-type">{room.room_type == 'public' ? <FontAwesomeIcon className="private-room" icon={faLock} />: ''}</span>
                            </a>
                        </li>
                    ))}
                    <button className='create-room-btn'>Create room</button>
                </ul>
            </div> 
        </div>
    )
}

export default RoomOptions;