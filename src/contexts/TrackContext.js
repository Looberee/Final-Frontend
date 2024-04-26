import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';


const TrackContext = createContext();

export const useTrack = () => useContext(TrackContext);

export const TrackProvider = ({ children }) => {
    const [myDeviceId, setMyDeviceId] = useState(null);
    const [pyppoTrack, setPyppoTrack] = useState(null);
    const [waitingList, setWaitingList] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [toggleDuplicate, setToggleDuplicate] = useState(false);
    const [isTrackFavourite, setIsTrackFavourite] = useState(false);
    const [myPlayer, setMyPlayer] = useState();

    useEffect(() => {
        console.log("--------------------------------------------------------")
        console.log('Current device ID:', myDeviceId);
        console.log('Current track in context:', pyppoTrack);
        console.log('Waiting list:', waitingList);
        console.log('Current State: ', isPlaying);
        console.log('Is favourite track:', isTrackFavourite);
        console.log("--------------------------------------------------------")

    }, [pyppoTrack, isPlaying, waitingList, myDeviceId, isTrackFavourite])

    useEffect(() => {
        const handleCheckFavourite = async () => {
                try {
                    console.log('Check Favourite Track:', pyppoTrack.id);
                    const response = await axios.post('http://127.0.0.1:8080/personal/favourites/track/check',{
                        'track_id' : pyppoTrack.id
                    },{
                        withCredentials : true
                    })
                    console.log("Is Favourite Track: ",response.data.favourite)
                    setIsTrackFavourite(response.data.favourite);
                }
                catch (err) {
                    console.error('Error checking favourite:', err);
                }
            }
            // else if (pyppoTrack.spotify_id)
            // {
            //     try {
            //         console.log('Check Favourite Track with Spotify Id:', pyppoTrack.spotify_id);
            //         const response = await axios.post('http://127.0.0.1:8080/personal/favourites/track/check',{
            //             'spotify_id' : pyppoTrack.spotify_id
            //         },{
            //             withCredentials : true
            //         })
            //         console.log("Is Favourite Track: ",response.data.favourite)
            //         setIsTrackFavourite(response.data.favourite);
            //     }
            //     catch (err) {
            //         console.error('Error checking favourite:', err);
            //     }
            // }

        if (pyppoTrack)
        {
            handleCheckFavourite();
        }

    },[pyppoTrack, isTrackFavourite])

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
                toggleDuplicate, setToggleDuplicate,
                isTrackFavourite, setIsTrackFavourite,
                myPlayer, setMyPlayer
            }}
        >
            {children}
        </TrackContext.Provider>
    );
};