import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Poserobics, PoseProvider } from './Components/Poserobics';
import Canvas from './Components/Canvas';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <PoseProvider>
            <div style={{ display: 'flex' }}>
                <Poserobics />
                <Canvas />
            </div>
        </PoseProvider>
    </React.StrictMode>
);