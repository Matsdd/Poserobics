import ml5 from 'ml5';

async function loadModelAndPredict() {
    try {
        const response = await fetch('testData.json');
        const testDataset = await response.json();

        // Proceed with ML5 model loading and prediction
        const modelDetails = {
            model: 'model.json',
            metadata: 'model_meta.json',
            weights: 'model.weights.bin'
        };

        const nn = ml5.neuralNetwork({ task: 'classification', debug: true });

        nn.load(modelDetails, async () => {
            console.log("ML5 Model has been loaded");

            async function predictLabels(data) {
                const predictedLabels = [];

                for (let i = 0; i < data.length; i++) {
                    const { pose } = data[i];
                    const result = await nn.classify(pose);
                    predictedLabels.push(result[0].label);
                }

                return predictedLabels;
            }

            function calculateAccuracy(testDataset, predictedLabels) {
                if (testDataset.length !== predictedLabels.length) {
                    throw new Error("Number of predicted labels does not match the number of test samples.");
                }

                const totalSamples = testDataset.length;
                let correctPredictions = 0;

                for (let i = 0; i < totalSamples; i++) {
                    if (testDataset[i].label === predictedLabels[i]) {
                        correctPredictions++;
                    }
                }

                const accuracy = (correctPredictions / totalSamples) * 100;
                return accuracy.toFixed(2); // Return accuracy rounded to 2 decimal places
            }

            // Call predictLabels with your testDataset to get predictedLabels
            const predictedLabels = await predictLabels(testDataset);

            // Calculate accuracy
            const accuracy = calculateAccuracy(testDataset, predictedLabels);
            console.log(`Accuracy of the model: ${accuracy}%`);
        });

    } catch (error) {
        console.error('Error loading or parsing testData.json:', error);
    }
}

loadModelAndPredict();
