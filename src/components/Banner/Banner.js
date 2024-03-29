import React, { useState, useEffect } from "react";
import './Banner.css';

const images = ['https://w.wallhaven.cc/full/l8/wallhaven-l8v3ey.png', 'https://w.wallhaven.cc/full/6d/wallhaven-6d7xmx.jpg', 'https://w.wallhaven.cc/full/2y/wallhaven-2ywd3y.png','https://w.wallhaven.cc/full/85/wallhaven-858lz1.png'];

const Banner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(true); // Trigger fade effect
            setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
            setTimeout(() => {
                setFade(false); // Remove fade effect after 1 second
            }, 800);
        }, 5000); // Change slide every 10 seconds

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, []);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };
    

    return (
        <div className="container">
            <div className="slider-wrapper">
                <div className={`slider-content ${fade ? 'fade-out' : ''}`}>
                    <span>Top playlists</span>
                    <h1>Discover new music</h1>
                    <p>Listen to new music and create your own playlists</p>
                    <button>Play now</button>
                </div>

                <div className="slider" style={{ transform: `translate3d(${-currentIndex * 100}%, 0, 0)` }}>
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            id={`slide-${index}`}
                            className={`slide-image ${index === currentIndex ? "active" : ""}`}
                            loading="lazy"
                        />
                    ))}
                </div>

                <div className="slider-nav">
                    {images.map((_, index) => (
                        <div
                            href={`#slide-${index}`}
                            className={`slider-point ${index === currentIndex ? "active" : ""}`}
                            key={index}
                            onClick={() => goToSlide(index)}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Banner;
