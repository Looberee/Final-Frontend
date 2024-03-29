import React, { createContext, useContext, useState } from 'react';

// Create a context for the recent track state
const PlaylistContext = createContext();

// Recent track provider component
export const PlaylistProvider = ({ children }) => {
    const [playlistState, setPlaylistState] = useState(false);

    // Function to toggle the recent track state
    const togglePlaylist = () => {
        setPlaylistState(prevState => !prevState);
    };

    // You can define more actions or state as needed

    return (
        <PlaylistContext.Provider value={{ playlistState, togglePlaylist }}>
            {children}
        </PlaylistContext.Provider>
    );
};

// Custom hook to access the recent track state and toggle function
export const usePlaylist = () => useContext(PlaylistContext);
