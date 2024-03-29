import React from "react";
import './Albums.css'

const Albums = ({title, tracks}) => {

    return (
        <div>
            <div className="album-container">
                <h1 className="album-title">{title}</h1>

                <div className="albums-list-container">
                    <ul className="albums-list">
                        {tracks.map((track, index) => (
                            <li key={index} className="album">
                                <div className="album-cover">
                                    <img className="album-image" src={track.image_url} alt={track.name} />
                                </div>
                                <div className="album-info">
                                    <h3>{track.name}</h3>
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
export default Albums;