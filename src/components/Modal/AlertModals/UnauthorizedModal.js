import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';
import { useModal } from "../../../contexts/ModalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const UnauthorizedModal = () => {
    const { closeModal, openModalId } = useModal();
    const [ openThisModal, setOpenThisModal ] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (openModalId === 'unauthorizedModal') {
            setOpenThisModal(true)
        }
        else 
        {
            setOpenThisModal(false)
        }
    }, [openModalId])

    const modalStyles = {
        content: {
            opacity: openThisModal ? 1 : 0,
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

    const buttonStyle = {
        backgroundColor: 'orange',
        color: 'white', // Change this as needed
        padding: '5px 25px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        margin: '4px 2px',
        cursor: 'pointer',
        borderRadius: '20px'
    };

    const handleLogin = () => {
        navigate('/login')
    }

    return (
        <Modal
            isOpen={openThisModal}
            onRequestClose={closeModal}
            contentLabel="Unauthorized"
            style={modalStyles}
        >
            <FontAwesomeIcon icon={faTimesCircle} color="red" size="4x" />
            <h2 style={{color:'#fff'}}>Unauthorized</h2>
            <p>You must login to use this feature</p>
            <div className="action-btn-modal" style={{display:'inline-flex', gap:'30px', marginTop:'40px'}} >
                <button onClick={closeModal} style={buttonStyle}>Close</button>
                <button onClick={handleLogin} style={buttonStyle}>Login</button>
            </div>
        </Modal>
    );
}

export default UnauthorizedModal;
