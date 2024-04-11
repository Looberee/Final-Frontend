import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useModal } from "../../../contexts/ModalContext";

const EditPlaylistModal = () => {
    const { closeModal, openModalId } = useModal();
    const [ openThisModal, setOpenThisModal ] = useState(false)

    useEffect(() => {
        if (openModalId === 'edit') {
            setOpenThisModal(true)
        }
        else 
        {
            setOpenThisModal(false)
        }
    }, [openModalId])

    const modalStyles = {
        content: {
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
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: '1000'
        }
    };

    return (
        <Modal
            isOpen={openThisModal}
            onRequestClose={closeModal}
            contentLabel="Edit Playlist"
            style={modalStyles}
        >
            <h2>Edit Playlist</h2>
        </Modal>
    );
}

export default EditPlaylistModal;
