
import React, { createContext, useState, useContext, useEffect } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
const [openModalId, setOpenModalId] = useState(null);
const [data, setData ] = useState("")

useEffect(() => {
    console.log("Modal Id: " + openModalId)
},[openModalId]);

const openModal = (modalId) => {
    setOpenModalId(modalId);
};

const closeModal = () => {
    setOpenModalId(null);
};

return (
    <ModalContext.Provider value={{ openModal, closeModal, openModalId, data , setData }}>
        {children}
    </ModalContext.Provider>
);
};
