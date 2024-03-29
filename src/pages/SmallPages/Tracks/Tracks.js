import React ,{ useState , useEffect} from "react";
import './Tracks.css'

const Track = ({title, fetched_tracks}) => {
    const [trackTitle, setTrackTitle] = useState("Title");
    const [tracks, setTracks ] = useState([{}])

    useEffect(() =>{
        setTrackTitle(title);
        setTracks(fetched_tracks)
    },[title, fetched_tracks])
        

    return (
        <div>
            <div className="track-container">
                <h1 className="track-title">{trackTitle}</h1>

                <div className="tracks-list-container">
                    <ul className="tracks-list">
                        {tracks.map((track, index) => (
                            <li key={index} className="track">
                                <div className="track-cover">
                                    <img className="track-image" src={track.image_url} alt={track.name} />
                                </div>
                                <div className="track-info">
                                    <h3>{track.track_name}</h3>
                                    <p>{track.artists}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    )

}

const Tracks = () => {
    const [genre, setGenre ] = useState(['pop', 'rock','hiphop','edm','jazz','country','gaming', 'rnb']);
    const [popTracks, setPopTracks] = useState([]);
    const [rockTracks, setRockTracks] = useState([]);
    const [hiphopTracks, setHipHopTracks] = useState([]);
    const [edmTracks, setEdmTracks] = useState([]);
    const [jazzTracks, setJazzTracks] = useState([]);
    const [countryTracks, setCountryTracks] = useState([]);
    const [gamingTracks, setGamingTracks] = useState([]);
    const [rnbTracks, setRNBTracks] = useState([]);

        useEffect(() => {
        const fetchTracks = async (genre) => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/recommendation/tracks/${genre}`);
                const data = await response.json();
                return data.sorted_tracks; // Return sorted Tracks
            } catch (error) {
                console.error(error);
                return []; // Return empty array in case of error
            }
        };
    
        const updateTracksState = async () => {
            const tracksByGenre = {};
            for (const genreItem of genre) {
                const tracks = await fetchTracks(genreItem);
                tracksByGenre[genreItem] = tracks;
            }
    
            // Update state hooks with fetched artists
            setPopTracks(tracksByGenre['pop']);
            console.log('Pop Tracks:', tracksByGenre['pop'])
            setRockTracks(tracksByGenre['rock']);
            console.log('Rock Tracks:', tracksByGenre['rock'])
            setHipHopTracks(tracksByGenre['hiphop']);
            console.log('Hip Hop Tracks:', tracksByGenre['hiphop'])
            setEdmTracks(tracksByGenre['edm']);
            console.log('EDM Tracks:', tracksByGenre['edm'])
            setJazzTracks(tracksByGenre['jazz']);
            console.log('Jazz Tracks:', tracksByGenre['jazz'])
            setCountryTracks(tracksByGenre['country']);
            console.log('Country Tracks:', tracksByGenre['country'])
            setGamingTracks(tracksByGenre['gaming']);
            console.log('Gaming Tracks:', tracksByGenre['gaming'])
            setRNBTracks(tracksByGenre['rnb']);
            console.log('RNB Tracks:', tracksByGenre['rnb'])
        };
    
        updateTracksState();
    }, []);

    return (
        <div>
            <Track title={"Each Catchy Chorus and Infectious Rhythm is an Euphoric Journey"} fetched_tracks={popTracks} />
            <Track title={"Each Raw Guitar Riff and Thunderous Beat is an Electrifying Experience"} fetched_tracks={rockTracks} />
            {/* <Track title={"Hip Hop"} fetched_tracks={hiphopTracks} /> */}
            <Track title={"Every Thumping Bassline and Hypnotic Synth is a Transcendent Escape"} fetched_tracks={edmTracks} />
            <Track title={"Each Soulful Note and Swinging Rhythm is a Timeless Journey"} fetched_tracks={jazzTracks} />
            {/* <Track title={"Each Twangy Tune and Heartfelt Lyric is a Journey Through the Heartland"} fetched_tracks={countryTracks} /> */}
            <Track title={"Each Pixelated Adventure and Strategic Maneuver is an Immersive Odyssey"} fetched_tracks={gamingTracks} />
            {/* <Track title={"RNB"} fetched_tracks={rnbTracks} /> */}

        </div>
    )
}

export default Tracks;