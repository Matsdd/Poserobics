import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import PoseImage from './PoseImage';
import { classifyPose } from '../Data/UseNN';

// Define the context
const PoseContext = createContext();

// Create a provider component
const PoseProvider = ({ children }) => {
    const [predictedPoseLabel, setPredictedPoseLabel] = useState(null);

    return (
        <PoseContext.Provider value={{ predictedPoseLabel, setPredictedPoseLabel }}>
            {children}
        </PoseContext.Provider>
    );
};

// Custom hook to use the context
const usePose = () => {
    return useContext(PoseContext);
};

const Poserobics = () => {
    const [poseImages] = useState([
        'Flex.jpg',
        'Straight.jpg',
        'Down.jpg'
    ]);
    const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
    const [points, setPoints] = useState(0);
    const { predictedPoseLabel } = usePose();

    const handlePoseMatch = useCallback(() => {
        const poseImage = poseImages[currentPoseIndex];
        const expectedPoseLabel = poseImage.split('.')[0]; // Extract the pose label from the image name

        if (predictedPoseLabel) {
            if (expectedPoseLabel === predictedPoseLabel) {
                setPoints(prevPoints => prevPoints + 1);
                console.log(`Good job! Now you have ${points + 1} points!`);
            }
        }
    }, [poseImages, currentPoseIndex, predictedPoseLabel, points]);

    useEffect(() => {
        // Interval to change the current pose image every 5 seconds
        const changePoseInterval = setInterval(() => {
            setCurrentPoseIndex(prevIndex => (prevIndex + 1) % poseImages.length);
        }, 2000);

        // Interval to check the user's pose match every 5 seconds
        const checkPoseInterval = setInterval(() => {
            handlePoseMatch();
        }, 2000);

        return () => {
            clearInterval(changePoseInterval);
            clearInterval(checkPoseInterval);
        };
    }, [poseImages.length, handlePoseMatch]);

    return (
        <div className="Canvas">
            <h1>It's time for some poserobics!</h1>
            <PoseImage src={poseImages[currentPoseIndex]}/>
            <p className="text">Current points: {points}</p>
        </div>
    );
};

export {Poserobics, PoseProvider, usePose};
