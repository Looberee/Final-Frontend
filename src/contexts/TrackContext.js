import React, { createContext, useContext, useEffect, useState } from 'react';


const TrackContext = createContext();

export const useTrack = () => useContext(TrackContext);

export const TrackProvider = ({ children }) => {
    const [myDeviceId, setMyDeviceId] = useState(null);
    const [pyppoTrack, setPyppoTrack] = useState(null);
    const [waitingList, setWaitingList] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        console.log("--------------------------------------------------------")
        console.log('Current device ID:', myDeviceId);
        console.log('Current track in context:', pyppoTrack);
        console.log('Waiting list:', waitingList);
        console.log('Current State: ', isPlaying);
        console.log("--------------------------------------------------------")

    }, [pyppoTrack, isPlaying, waitingList, myDeviceId])

    const addToWaitingList = (newTrack) => {
        setWaitingList([...waitingList, newTrack]);
    };

    const removeFromWaitingList = (trackToRemove) => {
        setWaitingList(waitingList.filter((pyppoTrack) => pyppoTrack !== trackToRemove));
    };

    const toggleIsPlaying = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <TrackContext.Provider
            value={{
                myDeviceId, setMyDeviceId,
                pyppoTrack, setPyppoTrack,
                waitingList, addToWaitingList,removeFromWaitingList,
                isPlaying, setIsPlaying, toggleIsPlaying,
            }}
        >
            {children}
        </TrackContext.Provider>
    );
};