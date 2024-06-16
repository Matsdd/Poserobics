import React, { createContext, useState, useContext } from 'react';

const PoseContext = createContext();

export const PoseProvider = ({ children }) => {
    const [predictedPoseLabel, setPredictedPoseLabel] = useState(null);

    return (
        <PoseContext.Provider value={{ predictedPoseLabel, setPredictedPoseLabel }}>
            {children}
        </PoseContext.Provider>
    );
};

export const usePose = () => {
    return useContext(PoseContext);
};
