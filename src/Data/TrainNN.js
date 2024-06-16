import ml5 from 'ml5';

let neuralNetwork; // Declare outside the function scope

export async function trainNN() {
    try {
        // Load training data from a JSON file (replace with your actual data loading method)
        const response = await fetch('poseData.json');
        const data = await response.json();

        if (!data) {
            console.error('Failed to load training data');
            return;
        }

        // Initialize neural network instance
        neuralNetwork = ml5.neuralNetwork({
            task: 'classification',
            debug: true,
            layers: [
                { type: 'dense', units: 32, activation: 'relu' },
                { type: 'dense', units: 32, activation: 'relu' },
                { type: 'dense', activation: 'softmax' }
            ]
        });

        // Add training data to the neural network
        data.forEach(point => {
            neuralNetwork.addData(point.pose, { label: point.label });
        });

        // Normalize data and start training
        neuralNetwork.normalizeData();
        await neuralNetwork.train({ epochs: 100 }, () => {
            console.log('Training complete');
            finishedTraining()
        });
    } catch (error) {
        console.error('Error during training:', error);
    }
}

export function getNeuralNetwork() {
    return neuralNetwork;
}

async function finishedTraining() {
    const neuralNetwork = getNeuralNetwork();

    if (neuralNetwork) {
        const poseToClassify = [
            0.316304267379313,
            0.512323494062887,
            0.711716295837412
        ];

        neuralNetwork.classify(poseToClassify, (err, results) => {
            if (err) {
                console.error('Error classifying pose:', err);
                return;
            }
            console.log('Classification results:', results);

            // Save the model after classification if needed
            neuralNetwork.save('model', () => {
                console.log('Model saved successfully!');
            });
        });
    } else {
        console.error('Neural network not initialized or trained');
    }
}