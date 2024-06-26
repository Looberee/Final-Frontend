import React, { useState, useEffect } from "react";
import './GenreBanner.css';

const GenreBanner = ({imageUrls, names}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(false);
    const [images, setImages] = useState([]);
    const [trackNames, setTrackNames] = useState([]);

    // Update images state when imageUrls prop changes
    useEffect(() => {
        if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
            setImages(imageUrls);
        }
    }, [imageUrls]);

    useEffect(() => {
        if (names && Array.isArray(names) && names.length > 0) {
            setTrackNames(names);
        }
    }, [names]);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(true); // Trigger fade effect
            setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
            setTimeout(() => {
                setFade(false); // Remove fade effect after 1 second
            }, 800);
        }, 5000); // Change slide every 10 seconds

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, [images]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };
    

    return (
        <div className="genre-container">
            <div className="genre-slider-wrapper">
                <div className={`genre-slider-content ${fade ? 'fade-out' : ''}`}>
                    <span>Top tracks</span>
                    <h1>{trackNames[currentIndex]}</h1>
                    <p>Listen to new music and create your own playlists</p>
                </div>

                <div className="genre-slider" style={{ transform: `translate3d(${-currentIndex * 100}%, 0, 0)` }}>
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            id={`slide-${index}`}
                            className={`genre-slide-image ${index === currentIndex ? "active" : ""}`}
                            loading="lazy"
                        />
                    ))}
                </div>

                {/* <div className="genre-slider-nav">
                    {images.map((_, index) => (
                        <div
                            href={`#slide-${index}`}
                            className={`genre-slider-point ${index === currentIndex ? "active" : ""}`}
                            key={index}
                            onClick={() => goToSlide(index)}
                        ></div>
                    ))}
                </div> */}
            </div>
        </div>
    );
};

export default GenreBanner;
