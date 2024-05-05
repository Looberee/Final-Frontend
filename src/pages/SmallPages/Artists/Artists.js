import React, { useEffect, useState } from "react";
import './Artists.css';
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner"; // Import loading spinner component
import { Link } from "react-router-dom";

export const Artist = ({ title, genre, fetched_artists }) => {

    const [imageKey, setImageKey] = useState(Date.now());

    const getDetailArtist = (artist) => {
        console.log(artist.artist_id);
    }

    const generateImageKey = () => {
        setImageKey(Date.now());
    };

    return (
        <div>
            <div className="artist-container">
                <h1 className="artist-title">{title}</h1>

                <div className="artists-list-container">
                    <ul className="artists-list">
                        {fetched_artists.map(artist => (
                            <Link to={`/artist/${artist.artist_id}`} key={artist.id} className="artist" onClick={() => getDetailArtist(artist)} onLoad={generateImageKey}>
                                <div className="artist-cover">
                                    <img className="artist-image" src={artist.spotify_image_url} alt={artist.name} loading="lazy" />
                                </div>
                                <div className="artist-info">
                                    <h3>{artist.name}</h3>
                                    <p>{artist.genre}</p>
                                </div>
                            </Link>
                        ))}
                        {/* Render loading spinners for remaining slots */}
                        {Array.from({ length: 6 - fetched_artists.length }).map((_, index) => (
                            <li key={index}>
                                <LoadingSpinner />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const Artists = () => {
    const [genre, setGenre] = useState(['pop', 'rock', 'edm', 'jazz', 'gaming']);
    const [popArtists, setPopArtists] = useState([]);
    const [rockArtists, setRockArtists] = useState([]);
    const [edmArtists, setEdmArtists] = useState([]);
    const [jazzArtists, setJazzArtists] = useState([]);
    const [gamingArtists, setGamingArtists] = useState([]);

    useEffect(() => {
        const fetchArtists = async (genre) => {
            try {
                const response = await fetch(`http://127.0.0.1:8080/recommendation/artists/${genre}`);
                const data = await response.json();
                return data.sorted_artists; // Return sorted artists
            } catch (error) {
                console.error(error);
                return []; // Return empty array in case of error
            }
        };

        const updateArtistsState = async () => {
            const artistsByGenre = {};
            for (const genreItem of genre) {
                const artists = await fetchArtists(genreItem);
                artistsByGenre[genreItem] = artists;
            }

            setPopArtists(artistsByGenre['pop']);
            setRockArtists(artistsByGenre['rock']);
            setEdmArtists(artistsByGenre['edm']);
            setJazzArtists(artistsByGenre['jazz']);
            setGamingArtists(artistsByGenre['gaming']);
        };

        updateArtistsState();
    }, []);

    return (
        <div>
            <Artist title={"Grooving to Catchy Melodies and Infectious Beats"} genre={"Pop"} fetched_artists={popArtists} />
            <Artist title={"Always Ready to Dive Headfirst into The Energy of Rock 'N' Roll"} genre={"Rock"} fetched_artists={rockArtists} />
            <Artist title={"Pulsating Waves of Electronic Sound Create an Irresistible Atmosphere"} genre={"EDM"} fetched_artists={edmArtists} />
            <Artist title={"Jazzing Up the Mood with the Soulful Melodies of Jazz"} genre={"Jazz"} fetched_artists={jazzArtists} />
            <Artist title={"The Adrenaline-Fueled Challenges and Immersive Worlds Provide an Escape into Realms of Adventure and Strategy"} genre={"Gaming"} fetched_artists={gamingArtists} />
        </div>
    );
};

export default Artists;
