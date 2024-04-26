import React from "react";

const FavouriteArtistRow = () => {

}

const FavouriteArtists = () => {


    return (
        <div>
            <div className="favourite-artist-container">
                <h1 className="favourite-artist-title">Favourite Artists</h1>
                <div className="favourite-artist-list-container">
                    <ul className="favourite-artist-list">
                        <FavouriteArtistRow />
                    </ul>
                </div>
            </div>
        </div>
    )

}

export default FavouriteArtists