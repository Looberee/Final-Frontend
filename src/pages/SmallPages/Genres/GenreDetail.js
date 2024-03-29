import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GenreBanner from "../../../components/GenreBanner/GenreBanner";
import Albums from "../../../components/Recommendation/Albums/Albums";
import axios from "axios";

const GenreDetail = () => {
    const { genre_name } = useParams();
    const [tracksGenre, setTracksGenre] = useState();
    const [tracksGenreImage, setTracksGenreImage] = useState();

    const [popularTracks, setPopularTracks] = useState([]);
    const [longestTracks, setLongestTracks] = useState([]);
    const [nearestTracks, setNearestTracks] = useState([]);

    useEffect(() => {
        const fetchTracksGenre = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/recommendation/genres/${genre_name}`);
                console.log(response.data.formatted_tracks);
                setTracksGenre(response.data.formatted_tracks);
            } catch (error) {
                console.error('Error fetching track genres:', error);
            }
        };
        fetchTracksGenre();
    }, [genre_name]);

    useEffect(() => {
        if (tracksGenre && tracksGenre.length > 0) {
            const sortedPopularTracks = [...tracksGenre].sort((a, b) => b.popularity - a.popularity).slice(0, 6);
            setPopularTracks(sortedPopularTracks);
            
            const sortedDurationTracks = [...tracksGenre].sort((a, b) => b.duration_ms - a.duration_ms).slice(0, 6);
            setLongestTracks(sortedDurationTracks);
            
            const today = new Date();
            
            const sortedDateTracks = [...tracksGenre].sort((a, b) => {
                const releaseDateA = new Date(a.release_date);
                const releaseDateB = new Date(b.release_date);
                const diffA = Math.abs(today - releaseDateA);
                const diffB = Math.abs(today - releaseDateB);
                return diffA - diffB;
            }).slice(0, 6);
            setNearestTracks(sortedDateTracks);
        }

        if (tracksGenre && tracksGenre.length > 0) {
            const imageUrls = tracksGenre.map(track => track.image_url);
            setTracksGenreImage(imageUrls);
        }

    }, [tracksGenre]);

    return (
        <div>
            <GenreBanner imageUrls={tracksGenreImage}/>
            <Albums title="Top Popular Tracks" tracks={popularTracks} />
            <Albums title="For Who Want To Enjoy" tracks={longestTracks} />
            <Albums title="Hot As New" tracks={nearestTracks} />
        </div>
    );
}

export default GenreDetail