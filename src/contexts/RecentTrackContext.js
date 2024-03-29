import React, { createContext, useContext, useState } from 'react';

// Create a context for the recent track state
const RecentTrackContext = createContext();

// Recent track provider component
export const RecentTrackProvider = ({ children }) => {
    const [recentTrackState, setRecentTrackState] = useState(false);

    // Function to toggle the recent track state
    const toggleRecentTrack = () => {
        setRecentTrackState(prevState => !prevState);
    };

    // You can define more actions or state as needed

    return (
        <RecentTrackContext.Provider value={{ recentTrackState, toggleRecentTrack }}>
            {children}
        </RecentTrackContext.Provider>
    );
};

// Custom hook to access the recent track state and toggle function
export const useRecentTrack = () => useContext(RecentTrackContext);
