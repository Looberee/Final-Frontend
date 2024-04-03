import React, { createContext, useContext, useState } from 'react';

// Create a new context for the room
const RoomContext = createContext();

// Custom hook to access the room context
export const useRoom = () => useContext(RoomContext);

// RoomContext Provider component
export const RoomProvider = ({ children }) => {
    const [roomState, setRoomState] = useState(false);

    return (
        <RoomContext.Provider value={{ roomState, setRoomState }}>
            {children}
        </RoomContext.Provider>
    );
};