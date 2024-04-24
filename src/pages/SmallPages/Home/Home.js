// Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import Banner from '../../../components/Banner/Banner';
import { useAuth } from '../../../contexts/AuthContext';
import Albums from '../../../components/Recommendation/Albums/Albums';
import { Artist } from '../Artists/Artists'

const Home = () => {
    const { accessToken } = useAuth();
    const [databaseTracks, setDatabaseTracks] = useState([]);
    const [ncsTracks, setNcsTracks] = useState([]);
    const [electronicTracks , setElectronicTracks] = useState([]);
    const [relaxTracks, setRelaxTracks] = useState([]);
    const [edmArtists, setEdmArtists] = useState([]);

    useEffect(() => {
        const fetchHomeTrack = async () =>
        { 
            try {
                const response = await axios.get('http://localhost:8080/home')

                setDatabaseTracks(response.data.tracks);
                console.log(response.data.tracks)
                console.log(response.data.ncs_tracks)
                setNcsTracks(response.data.ncs_tracks);
                setElectronicTracks(response.data.electronic_tracks);
                setRelaxTracks(response.data.relax_tracks);
                setEdmArtists(response.data.edm_artists);
            }
            catch (error) {
                console.error('Error fetching home track:', error);
            }
        }

        fetchHomeTrack();

    },[]);

    return (
        <div>
            <Banner />
            {/* <Albums title="Recommended from Pyppo" tracks={databaseTracks} /> */}
            <Albums title="From NCS with love" tracks={ncsTracks} />
            <Artist title="Recommended EDM Artists" genre="edm" fetched_artists={edmArtists} />
            <Albums title="Maybe you want to chill out" tracks={relaxTracks} />
            <Albums title="Electronic and Dance" tracks={electronicTracks} /> 

        </div>
    );
};

export default Home;
