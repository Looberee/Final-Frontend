// Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import Banner from '../../../components/Banner/Banner';
import Tracks from '../Tracks/Tracks';

const Home = () => {
    return (
        <div>
            <Banner />
        </div>
    );
};

export default Home;
