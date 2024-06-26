import React ,{ useState , useEffect} from "react";
import { useTrack } from "../../../contexts/TrackContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import './Tracks.css'
import Albums from "../../../components/Recommendation/Albums/Albums";
import { toast } from "react-hot-toast";

const Track = ({title, fetched_tracks}) => {
    const [trackTitle, setTrackTitle] = useState("Title");
    const [tracks, setTracks ] = useState([])
    const { setPyppoTrack } = useTrack();

    useEffect(() =>{
        setTrackTitle(title);
        setTracks(fetched_tracks)
    },[title, fetched_tracks])
    
    const handleTrackSelected = (track) => {
        setPyppoTrack(track);
    }
        

    const renderedTracks = React.useMemo(() => {
        if (tracks.length > 0) {
            return tracks.map((track, index) => (
                <li key={index} className="track" onDoubleClick={() => handleTrackSelected(track)}>
                    <div className="track-cover">
                        <img className="track-image" src={track.spotify_image_url} alt={track.name} />
                    </div>
                    <div className="track-info">
                        <h3>{track.name}</h3>
                        <p>{track.artists}</p>
                    </div>
                </li>
            ));
        } else {
            return <li>No tracks available</li>; // Or any other appropriate message
        }
    }, [tracks, handleTrackSelected]);

return (
    <div>
        <div className="track-container">
            <h1 className="track-title">{trackTitle}</h1>

            <div className="tracks-list-container">
                <ul className="tracks-list">
                    {renderedTracks}
                </ul>
            </div>
        </div>
    </div>
);

}

const Tracks = () => {
    const [genre, setGenre ] = useState(['pop', 'rock','edm','jazz','gaming']);
    const [popTracks, setPopTracks] = useState([]);
    const [rockTracks, setRockTracks] = useState([]);
    const [edmTracks, setEdmTracks] = useState([]);
    const [jazzTracks, setJazzTracks] = useState([]);
    const [gamingTracks, setGamingTracks] = useState([]);

        useEffect(() => {
            const fetchTracks = async (genre) => {
                try {
                    const response = await fetch(`http://127.0.0.1:8080/recommendation/tracks/${genre}`);
                    const data = await response.json();
                    return data.sorted_tracks; // Return sorted Tracks
                } catch (error) {
                    console.error(error);
                    toast.error("Something goes wrong, please try again")
                    return []; // Return empty array in case of error
                }
        };
    
        const updateTracksState = async () => {
            const tracksByGenre = {};
            for (const genreItem of genre) {
                const tracks = await fetchTracks(genreItem);
                tracksByGenre[genreItem] = tracks;
            }
    
            setPopTracks(tracksByGenre['pop']);
            setRockTracks(tracksByGenre['rock']);
            setEdmTracks(tracksByGenre['edm']);
            setJazzTracks(tracksByGenre['jazz']);
            setGamingTracks(tracksByGenre['gaming']);
        };
    
        updateTracksState();
    }, []);

    return (
        <div>
            <Albums title={"Each Catchy Chorus and Infectious Rhythm is an Euphoric Journey"} tracks={popTracks} />
            <Albums title={"Each Raw Guitar Riff and Thunderous Beat is an Electrifying Experience"} tracks={rockTracks} />
            <Albums title={"Every Thumping Bassline and Hypnotic Synth is a Transcendent Escape"} tracks={edmTracks} />
            <Albums title={"Each Soulful Note and Swinging Rhythm is a Timeless Journey"} tracks={jazzTracks} />
            <Albums title={"Each Pixelated Adventure and Strategic Maneuver is an Immersive Odyssey"} tracks={gamingTracks} />

        </div>
    )
}

export default Tracks;