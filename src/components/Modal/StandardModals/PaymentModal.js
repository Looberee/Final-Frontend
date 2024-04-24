import React, { useState } from "react";
import Modal from "react-modal";
import PayPalButton from "../../PaypalButton/PaypalButton";

const PaymentModal = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openPaymentModal = () => {
        setModalIsOpen(true);
    };

    const closePaymentModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closePaymentModal}
                contentLabel="Standard Modal"
            >
                <h1>Update to Pyppo Premium</h1>
                <p>This is a standard modal</p>
                <p>This is a standard modal</p>
                <p>This is a standard modal</p>
                <p>This is a standard modal</p>
                <PayPalButton />
                <button onClick={closePaymentModal}>Close Modal</button>
            </Modal>
        </div>
    )
}

export default PaymentModal;