import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import './Genres.css';


const GenreRow = ({ genres }) => {
    const capitalizeFirstLetter = (str) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const handleGetGenre = (genre) => {
        console.log("This is Genre: " , genre);
    }


    return (
        <div className="genres-list-container">
            <ul className="genres-list">
            {genres.map((genre, index) => (
                <Link to={`/genres/${genre.genre_name}`} key={index} className="genres">
                <div className="genres-cover">
                    <img className="genres-image" src={genre.genre_image} alt={genre.genre_name} />
                    <div className="genres-name-overlay">
                        <h3>{capitalizeFirstLetter(genre.genre_name)}</h3>
                    </div>
                </div>
                </Link>
            ))}
            </ul>
        </div>
    );
};

const Genres = () => {
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8080/recommendation/genres');
                setGenres(response.data.genres);
                console.log("Genres: ", response.data.genres);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, []);

    return (
    <div>
        <div className="genres-container">
            <h1 className="genres-title">Genres</h1>
            <GenreRow genres={genres} />
        </div>
    </div>
    );
};

export default Genres;