import React, { useEffect, useState } from "react";
import './RoomOptions.css';
import axios from 'axios';
import { useRoom } from "../../contexts/RoomContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import { toast } from "react-hot-toast";

const RoomOptions = () => {
    const [rooms, setRooms] = useState([]);
    const { roomState, setRoomState, toggleRoom , setToggleRoom } = useRoom();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [specificRoom, setSpecificRoom] = useState();

    const modalStyles = {
        content: {
            opacity: 1,
            transition: 'opacity 0.5s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            backgroundColor: '#090f1b',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            border: 'none',
            padding: '20px'
        },
        overlay: {
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: '1000'
        }
    };

    const openModal = (room) => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setRoomName(''); // Clear roomName when modal is closed
        setModalIsOpen(false);

    };

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5001/personal/rooms', { withCredentials: true });
                setRooms(response.data.my_rooms);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    // Set a state variable to indicate that no rooms were found
                    setRooms([]);
                } else {
                    console.error('Error fetching rooms:', err);
                }
            }
        }
        fetchRoom();
    }, [toggleRoom])

    const handleCreateRoom = async () => {
        try {
            const response = await axios({
                method: 'post',
                url: 'http://127.0.0.1:5001/personal/rooms',
                withCredentials: true
            });
            toast.success("A room has been created succesfully!")
            setToggleRoom((pre) => !pre)

        }
        catch (err) {
            console.error('Error creating room:', err);
        }
    }

    const setNameToggle = (room) => {
        setRoomName(room.name);
        setSpecificRoom(room);
        openModal();
    }

    const handleEditRoom = async () => {
        try {
            const response = await axios.put('http://127.0.0.1:5001/personal/rooms', {'room_encode_id': specificRoom.encode_id, 'new_name': roomName} , { withCredentials: true });
            setToggleRoom((pre) => !pre)
            closeModal();
            toast.success("Your room has been edited succesfully!")
        }
        catch (err) {
            console.error('Error editing room:', err);
            toast.error("This room name is already in use by other user. Please try another name!")
        }
    };

    const handleDeleteRoom = async () => {
        try {
            const response = await axios({
                method: 'delete',
                url: 'http://127.0.0.1:5001/personal/rooms',
                data: { 'room_encode_id': specificRoom.encode_id },
                withCredentials: true
            });
            setToggleRoom((pre) => !pre)
            closeModal();
            toast.success("Your room has been deleted succesfully!")
        }
        catch (err) {
            toast.error("Failed to delete the room!")
            console.error('Error deleting room:', err);
        }
    };
    

    return (
        <div>
            <div>
                <ul className={`rooms ${roomState ? 'active' : ''}`}>
                    {rooms.map((room) => (
                        <li className="room-container" style={{color:'#fff'}} key={room.encode_id} onClick={() => setNameToggle(room)}>
                            <a className="room-box" href="#">
                                <h2 className="room-name">{room.name}</h2>
                            </a>
                        </li>
                    ))}
                    <button className='create-room-btn' onClick={handleCreateRoom}>Create room</button>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        contentLabel="Example Modal"
                        style={modalStyles}
                    >
                        <h1 style={{color:'#fff'}}>Your Room Information</h1>
                        <div className="user-playlist-nameEdit-container">
                        <input type="text" placeholder="Room Name" className="room-modal-input" value={roomName} onChange={(event) => setRoomName(event.target.value)}/>
                        </div>

                        <div className="room-modal-function-buttons">
                            <button className="room-modal-function-button" onClick={handleEditRoom}>Edit</button>
                            <button className="room-modal-function-button" onClick={handleDeleteRoom}>Delete</button>
                        </div>
                    </Modal>
                </ul>
            </div> 


        </div>
    )
}

export default RoomOptions;