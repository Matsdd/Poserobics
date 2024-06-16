import React, { useRef, useEffect, useState } from 'react';
import { Holistic } from '@mediapipe/holistic';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { classifyPose } from '../Data/UseNN';
import { usePose } from './Poserobics';

const POSE_CONNECTIONS = [
  [11, 13], [13, 15], [15, 19],
  [12, 14], [14, 16], [16, 20],
  [11, 12], [23, 24],
  [23, 25], [25, 27], [27, 29], [29, 31],
  [24, 26], [26, 28], [28, 30], [30, 32],
];

function Canvas() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { predictedPoseLabel, setPredictedPoseLabel } = usePose();
  const [poseLandmarks, setPoseLandmarks] = useState(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');

    function onResults(results) {
      setPoseLandmarks(results.poseLandmarks);

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

      if (results.poseLandmarks) {
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
        drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });

        const [shoulderY, elbowY, handY] = [
          results.poseLandmarks[11].y,
          results.poseLandmarks[13].y,
          results.poseLandmarks[15].y
        ];

        classifyPose(shoulderY, elbowY, handY)
            .then((poseLabel) => {
              console.log('Predicted pose:', poseLabel);
              setPredictedPoseLabel(poseLabel);
            })
            .catch((error) => {
              console.error('Error classifying pose:', error);
            });
      }

      canvasCtx.restore();
    }

    const holistic = new Holistic({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
    });
    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    holistic.onResults(onResults);

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await holistic.send({ image: videoElement });
      },
      width: 1280,
      height: 720
    });
    camera.start();
  }, [setPredictedPoseLabel]);

  // const handleCollectData = async () => {
  //   const data = await getDataPoints(() => poseLandmarks);
  //   const dataStr = JSON.stringify(data);
  //   const blob = new Blob([dataStr], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'poseData.json';
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  return (
      <div className="Canvas">
        <h1>It's time for some poserobics!</h1>
        <video ref={videoRef} className="input_video" style={{ display: 'none' }}></video>
        <canvas ref={canvasRef} className="output_canvas" width="853" height="480"></canvas>
        {/*<button onClick={handleCollectData}>Collect Pose Data</button>*/}
        <div className='text'>
          Current Pose: {predictedPoseLabel || 'No pose detected'}
        </div>
      </div>
  );
}

export default Canvas;
