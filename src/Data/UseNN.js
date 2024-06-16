import ml5 from 'ml5';

const nn = ml5.neuralNetwork({ task: 'classification' });

// Load the model
const modelDetails = {
    model: 'model.json',
    metadata: 'model_meta.json',
    weights: 'model.weights.bin'
};

nn.load(modelDetails, () => console.log("NN Model has been loaded"));

// Function to classify pose
export async function classifyPose(shoulderY, elbowY, handY) {
    const result = await nn.classify([shoulderY, elbowY, handY]);
    return result[0].label;
}
