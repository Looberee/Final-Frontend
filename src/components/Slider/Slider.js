import React, { useState, useEffect, useRef } from "react";
import './Slider.css'

const images = [
"https://w.wallhaven.cc/full/l8/wallhaven-l8v3ey.png",
"https://w.wallhaven.cc/full/6d/wallhaven-6d7xmx.jpg",
"https://w.wallhaven.cc/full/2y/wallhaven-2ywd3y.png",
"https://w.wallhaven.cc/full/85/wallhaven-858lz1.png"
];
const delay = 2500;

export default function Slideshow() {
const [index, setIndex] = useState(0);
const timeoutRef = useRef(null);

function resetTimeout() {
    if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    }
}

useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
    () =>
        setIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
        ),
    delay
    );

    return () => {
    resetTimeout();
    };
}, [index]);

return (
    <div className="container">
        <div className="slideshow">
            <div
            className="slideshowSlider"
            style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
                {images.map((image, idx) => (
                <img
                    className="slide"
                    key={idx}
                    style={{
                        objectFit:'cover'

                    }}
                    src={image}
                ></img>
                ))}
        </div>

            <div className="slideshowDots">
                {images.map((_, idx) => (
                <div
                    key={idx}
                    className={`slideshowDot${index === idx ? " active" : ""}`}
                    onClick={() => {
                    setIndex(idx);
                    }}
                ></div>
                ))}
            </div>
        </div>
    </div>
);
}
