
import React from 'react';

const NotFound = () => {
    return (
        <div className="animate__animated animate__flash">
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: '#fff',
                    borderRadius: '8px',
                    textAlign: 'center',
                }}
            >
                <h1>404 - Content Not Found</h1>
                <p>The content you are looking for does not exist.</p>
            </div>
        </div>
    );
};

export default NotFound;
