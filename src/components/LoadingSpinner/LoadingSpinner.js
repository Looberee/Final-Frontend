import React, { useState, useEffect } from "react";
import './LoadingSpinner.css'; // Import your CSS file for styling

export const PlaylistLoadingSpinner = () => {



    return (
        <div className="playlist-loader-container">
            <div className="playlist-loader">
                <span className="stroke"></span>
                <span className="stroke"></span>
                <span className="stroke"></span>
                <span className="stroke"></span>
                <span className="stroke"></span>
                <span className="stroke"></span>
                <span className="stroke"></span>
            </div>
        </div>
    )


}



const LoadingSpinner = () => {
const [loading, setLoading] = useState(true);

useEffect(() => {
    // Simulate data loading delay with setTimeout
    const timeout = setTimeout(() => {
    setLoading(false); // Set loading state to false after delay
    }, 3000); // Simulate 3 seconds loading time

    return () => clearTimeout(timeout); // Cleanup function
}, []);

return (
    <div className="loader-container">
        <div className="loader">
            <span className="stroke"></span>
            <span className="stroke"></span>
            <span className="stroke"></span>
            <span className="stroke"></span>
            <span className="stroke"></span>
            <span className="stroke"></span>
            <span className="stroke"></span>
        </div>
    </div>
);
};

export default LoadingSpinner;
