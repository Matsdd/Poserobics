import React from 'react';

const PoseImage = ({ src }) => {
    return (
        <div className="PoseImage">
            <img src={src} alt="Pose" style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} />
        </div>
    );
};

export default PoseImage;
