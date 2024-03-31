import React, { useEffect, useState } from "react";
import './Artists.css';

const Artist = ({title, genre, fetched_artists}) => {
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        setArtists(fetched_artists);
    },[fetched_artists])

    return (
        <div>
            <div className="artist-container">
                <h1 className="artist-title">{title}</h1>

                <div className="artists-list-container">
                    <ul className="artists-list">
                    {artists.map(artist => (
                        <li key={artist.id} className="artist">
                        <div className="artist-cover">
                            <img className="artist-image" src={artist.spotify_image_url} alt={artist.name} loading="lazy" />
                        </div>
                        <div className="artist-info">
                            <h3>{artist.name}</h3>
                            <p>{artist.genre}</p>
                        </div>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
    )

};

const Artists = () => 
{
    const [genre, setGenre ] = useState(['pop', 'rock','hiphop','edm','jazz','country','gaming', 'rnb']);
    const [popArtists, setPopArtists] = useState([]);
    const [rockArtists, setRockArtists] = useState([]);
    const [hiphopArtists, setHipHopArtists] = useState([]);
    const [edmArtists, setEdmArtists] = useState([]);
    const [jazzArtists, setJazzArtists] = useState([]);
    const [countryArtists, setCountryArtists] = useState([]);
    const [gamingArtists, setGamingArtists] = useState([]);
    const [rnbArtists, setRNBArtists] = useState([]);

    useEffect(() => {
        const fetchArtists = async (genre) => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/recommendation/artists/${genre}`);
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
    
            // Update state hooks with fetched artists
            setPopArtists(artistsByGenre['pop']);
            console.log('Pop artists:', artistsByGenre['pop'])
            setRockArtists(artistsByGenre['rock']);
            console.log('Rock artists:', artistsByGenre['rock'])
            setHipHopArtists(artistsByGenre['hiphop']);
            console.log('Hip Hop artists:', artistsByGenre['hiphop'])
            setEdmArtists(artistsByGenre['edm']);
            console.log('EDM artists:', artistsByGenre['edm'])
            setJazzArtists(artistsByGenre['jazz']);
            console.log('Jazz artists:', artistsByGenre['jazz'])
            setCountryArtists(artistsByGenre['country']);
            console.log('Country artists:', artistsByGenre['country'])
            setGamingArtists(artistsByGenre['gaming']);
            console.log('Gaming artists:', artistsByGenre['gaming'])
            setRNBArtists(artistsByGenre['rnb']);
            console.log('RNB artists:', artistsByGenre['rnb'])
        };
    
        updateArtistsState();
    }, []);


    return (
        <div>
            <Artist title={"Grooving to Catchy Melodies and Infectious Beats"} genre={"Pop"} fetched_artists={popArtists}/>
            <Artist title={"Always Ready to Dive Headfirst into The Energy of Rock 'N' Roll"} genre={"Rock"} fetched_artists={rockArtists}/>
            {/* <Artist title={"Grooving to the Beat, Dropping Rhymes with Swagger in the Vibrant World of Hip Hop"} genre={"Hip Hop"} fetched_artists={hiphopArtists}/> */}
            <Artist title={"Pulsating Waves of Electronic Sound Create an Irresistible Atmosphere"} genre={"EDM"} fetched_artists={edmArtists}/>
            <Artist title={"Jazzing Up the Mood with the Soulful Melodies of Jazz"} genre={"Jazz"} fetched_artists={jazzArtists}/>
            {/* <Artist title={"Country Music, the Heart and Soul of the American Countryside"} genre={"Country"} fetched_artists={countryArtists}/> */}
            <Artist title={"The Adrenaline-Fueled Challenges and Immersive Worlds Provide an Escape into Realms of Adventure and Strategy"} genre={"Gaming"} fetched_artists={gamingArtists}/>
            {/* <Artist title={"Rhythm and Blues, the Soulful Soundtrack of the Heart"} genre={"RNB"} fetched_artists={rnbArtists}/> */}

        </div>
    )

}
export default Artists;