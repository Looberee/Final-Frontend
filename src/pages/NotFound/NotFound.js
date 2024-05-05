import React from 'react';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found">
            <h1 className='not-found-title'>404 Not Found</h1>
            <p className='not-found-description'>The page you are looking for does not exist.</p>
        </div>
    );
};

export default NotFound;
