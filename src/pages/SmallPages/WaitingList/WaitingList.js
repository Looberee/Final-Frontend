import React, {useState, useEffect } from 'react';
import { useTrack } from '../../../contexts/TrackContext'; 
import './WaitingList.css';

const WaitingList = () => {
    const { waitingList } = useTrack(); // Replace 'useTrack' with the actual hook you are using to fetch the data

    if (waitingList.length === 0) {
        return <div className='list-empty-notification'>The waiting list is currently empty.</div>;
    }

    return (
        <div>
            <h1 className='list-title'>Waiting List</h1>

            <ul className='waiting-list-container'>
                {waitingList.map((track, index) => (
                    <li key={index} className="track">
                        <div className="track-cover">
                            <img className="track-image" src={track.spotify_image_url} alt={track.name} />
                        </div>
                        <div className="track-info">
                            <h3>{track.name}</h3>
                            <p>{track.artists}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WaitingList;