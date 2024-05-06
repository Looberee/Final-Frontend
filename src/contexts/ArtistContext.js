import React, { createContext, useContext, useState } from 'react';

// Create a new context for the room
const ArtistContext = createContext();

// Custom hook to access the room context
export const useArtist = () => useContext(ArtistContext);

// ArtistContext Provider component
export const ArtistProvider = ({ children }) => {
    const [artistState, setArtistState ] = useState(false);

    return (
        <ArtistContext.Provider value={{ artistState, setArtistState }}>
            {children}
        </ArtistContext.Provider>
    );
};